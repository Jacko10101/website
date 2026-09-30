// Interactive surface regression checks using Chrome DevTools Protocol.
// Run against a production server: node scripts/check-surfaces.mjs [base-url]
// CHROME_PATH overrides browser discovery; screenshots go to the OS temp directory.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3111";
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  const found = candidates.find((c) => existsSync(c));
  if (!found) throw new Error(`no Chrome found; set CHROME_PATH (tried ${candidates.join(", ")})`);
  return found;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Chrome writes "port\npath" into DevToolsActivePort once it is listening. */
async function waitForPort(profile) {
  const file = join(profile, "DevToolsActivePort");
  for (let i = 0; i < 100; i++) {
    if (existsSync(file)) {
      const port = Number(readFileSync(file, "utf8").split("\n")[0]);
      if (port) return port;
    }
    await sleep(200);
  }
  throw new Error("chrome did not start");
}

async function main() {
  const root = await fetch(base);
  if (root.headers.get("content-security-policy")?.includes(" 'unsafe-eval'")) throw new Error("production CSP permits unsafe-eval");
  for (const asset of ["/opengraph-image", "/about/opengraph-image", "/projects/opengraph-image", "/apple-icon", "/icon.svg", "/cv.pdf"]) {
    const response = await fetch(base + asset);
    if (!response.ok) throw new Error(`asset ${asset}: ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length === 0) throw new Error(`empty asset ${asset}`);
    if (response.headers.get("content-type")?.includes("image/png")) writeFileSync(join(tmpdir(), `surface-asset-${asset.replaceAll("/", "-")}.png`), bytes);
    console.log(`asset ok ${asset}`);
  }

  const chromePath = findChrome();
  const profile = mkdtempSync(join(tmpdir(), "surfaces-"));
  const chrome = spawn(chromePath, [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage", "--no-first-run",
    "--hide-scrollbars", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank",
  ], { stdio: "ignore" });

  let ws;
  try {
    const port = await waitForPort(profile);
    const { webSocketDebuggerUrl } = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
    ws = new WebSocket(webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    let id = 0;
    const pending = new Map();
    const listeners = new Set();
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        const { res, rej } = pending.get(m.id);
        pending.delete(m.id);
        m.error ? rej(new Error(m.error.message)) : res(m.result);
      } else if (m.method) {
        for (const l of listeners) l(m);
      }
    };
    const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
      const msg = { id: ++id, method, params };
      if (sessionId) msg.sessionId = sessionId;
      pending.set(msg.id, { res, rej });
      ws.send(JSON.stringify(msg));
    });
    const waitFor = (method, sessionId, timeout = 20000) => new Promise((res, rej) => {
      const t = setTimeout(() => { listeners.delete(l); rej(new Error(`timeout waiting for ${method}`)); }, timeout);
      const l = (m) => { if (m.method === method && m.sessionId === sessionId) { clearTimeout(t); listeners.delete(l); res(m.params); } };
      listeners.add(l);
    });

    const source = readFileSync('components/oncall-game.tsx','utf8');
    const answers = Object.fromEntries([...source.matchAll(/alert: "([^"]+)"[\s\S]*?fixes:\s*\[\s*\{\s*label:\s*"([^"]+)"/g)].map(m=>[m[1],m[2]]));
    for (const width of [320,390,1440]) {
      const height = width < 800 ? 844 : 1000;
      const {targetId} = await send('Target.createTarget',{url:'about:blank'});
      const {sessionId} = await send('Target.attachToTarget',{targetId,flatten:true});
      await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<800},sessionId);
      await send('Page.enable',{},sessionId); await send('Runtime.enable',{},sessionId);
      const errors=[];
      const listener=m=>{if(m.sessionId===sessionId && m.method==='Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);}; listeners.add(listener);
      const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
      const assert=async(expression,label)=>{if(!await evaluate(expression))throw Error(`${width}px ${label}: ` + await evaluate("document.querySelector('.workbench-output')?.textContent || document.body.textContent.slice(-700)"));};
      const wait=async(expression)=>{for(let n=0;n<80;n++){if(await evaluate(expression))return;await sleep(100);}throw Error(`timeout: ${expression}`);};
      const press=async(key,code,vk,modifiers=0)=>{for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key,code,windowsVirtualKeyCode:vk,modifiers,...(type === "keyDown" && key === "Enter" && !modifiers ? {text:"\r"} : {})},sessionId);await sleep(100);};
      const go=async route=>{const ready=waitFor('Page.loadEventFired',sessionId);await send('Page.navigate',{url:base+route},sessionId);await ready;await evaluate('document.fonts.ready');await sleep(800);};
      const shot=async name=>{const data=await send('Page.captureScreenshot',{format:'png'},sessionId);writeFileSync(join(tmpdir(), `surface-${name}-${width}.png`),Buffer.from(data.data,'base64'));};
      const command=async text=>{await evaluate("document.querySelector('#workbench-input').focus()");await send('Input.insertText',{text},sessionId);await press('Enter','Enter',13);};
      const setInput=async(selector,text)=>{await evaluate(`document.querySelector(${JSON.stringify(selector)}).focus();document.querySelector(${JSON.stringify(selector)}).select()`);await send('Input.insertText',{text},sessionId);};
      const clickText=async(selector,text)=>evaluate(`(() => {const b=Array.from(document.querySelectorAll(${JSON.stringify(selector)})).find(b=>b.textContent.trim()===${JSON.stringify(text)});if(!b)throw Error('button missing: '+${JSON.stringify(text)});b.click();})()`);
      await go('/lab');
      await shot('lab');
      await evaluate("document.querySelector('.site-footer button').scrollIntoView({block:'center'});document.querySelector('.site-footer button').focus()");await press(' ','Space',32);
      await wait("!!document.querySelector('.workbench-shell')");
      await shot('terminal');
      await assert("document.activeElement.id==='workbench-input' && document.querySelector('main').closest('[inert]')!==null",'terminal focus and inert');
      await command('inspect heimdall');
      await assert("document.querySelector('.workbench-output').textContent.includes('25')",'real project evidence');
      await command('inspect ml-scheduler');
      await assert("document.querySelector('.workbench-output').textContent.includes('199')",'research in terminal');
      await evaluate("document.querySelector('[aria-label=\"Close terminal\"]').focus()");await press('Tab','Tab',9,8);
      await assert("document.querySelector('[role=dialog]').contains(document.activeElement)",'reverse tab trap');
      await press('Escape','Escape',27);
      await assert("!document.querySelector('[role=dialog]') && document.activeElement===document.querySelector('.site-footer button') && !document.querySelector('[inert]')",'terminal closes and returns focus');
      await press(' ','Space',32);await wait("!!document.querySelector('#workbench-input')");await command('oncall');
      await wait("!!document.querySelector('.pager-shell')");
      await assert("document.querySelectorAll('[role=dialog]').length===1",'single modal after handoff');
      await shot('pager-briefing');
      if(width===320)await evaluate("Storage.prototype.setItem=function(){throw Error('storage blocked')};Storage.prototype.getItem=function(){throw Error('storage blocked')}");
      await assert("document.querySelector('.pager-mode-picker button').getAttribute('aria-pressed')==='true'", 'practice mode by default');
      await clickText('.pager-shell button','Take the pager');
      await wait("document.querySelector('.pager-overlay').dataset.phase==='active'");
      await shot('pager-active');
      const practiceBudget=await evaluate("document.querySelector('.pager-budget').textContent");await sleep(2200);
      if(practiceBudget!==await evaluate("document.querySelector('.pager-budget').textContent"))throw Error('practice mode drains budget');
      await clickText('.pager-shell button','Pause shift');
      const budget=await evaluate("document.querySelector('.pager-budget').textContent");await sleep(2400);
      if(budget!==await evaluate("document.querySelector('.pager-budget').textContent"))throw Error('pause still drains budget');
      await assert("Array.from(document.querySelectorAll('.pager-actions button')).every(b=>b.disabled)",'paused actions disabled');
      await clickText('.pager-shell button','Resume shift');
      for(let round=0;round<5;round++){
        const service=await evaluate("document.querySelector('.pager-incident > div:first-child > p:last-child').textContent");
        const answer=answers[service];if(!answer)throw Error('no answer for '+service);
        await evaluate("document.querySelector('.pager-overlay').focus()");await press('1','Digit1',49);
        if(round===0){await assert("document.querySelector('.pager-feed').textContent.includes('$')",'evidence feed updates');await assert("document.querySelector('.pager-budget').textContent.includes('100%')", 'reading evidence is free');}
        await evaluate(`(() => {const b=Array.from(document.querySelectorAll('.pager-actions button')).find(b=>b.textContent.endsWith(${JSON.stringify(answer)}));if(!b)throw Error('missing fix');b.click()})()`);
        await wait("document.querySelector('.pager-overlay').dataset.phase==='resolved'");
        await evaluate("document.querySelector('.pager-overlay').focus()");await press('Enter','Enter',13);
      }
      await wait("document.querySelector('.pager-overlay').dataset.phase==='handover'");
      await evaluate("document.querySelector('.pager-shell').scrollTop=0");await shot('handover');
      await assert("document.querySelector('.pager-shell').textContent.includes('Copy handover') && document.querySelectorAll('.pager-debrief details').length===5",'handover and incident lessons');
      // Exhaust the budget through actual wrong decisions, then verify restart.
      await clickText('.pager-shell button','Next shift');
      for(let round=0;round<5;round++) {
        const alert=await evaluate("document.querySelector('.pager-incident > div:first-child > p:last-child').textContent");
        const answer=answers[alert];
        if(!answer)throw Error('no answer for '+alert);
        for(let move=0;move<3;move++) {
          await evaluate(`(() => {const buttons=Array.from(document.querySelectorAll('.pager-actions button')).slice(-4);const wrong=buttons.find(b=>!b.disabled&&!b.textContent.endsWith(${JSON.stringify(answer)}));if(wrong)wrong.click();})()`);
          await sleep(100);
          if(await evaluate("document.querySelector('.pager-overlay').dataset.phase==='gameover'"))break;
        }
        if(await evaluate("document.querySelector('.pager-overlay').dataset.phase==='gameover'"))break;
        await evaluate(`Array.from(document.querySelectorAll('.pager-actions button')).find(b=>b.textContent.endsWith(${JSON.stringify(answer)})).click()`);
        await wait("document.querySelector('.pager-overlay').dataset.phase==='resolved'");
        await evaluate("document.querySelector('.pager-overlay').focus()");await press('Enter','Enter',13);
      }
      await wait("document.querySelector('.pager-overlay').dataset.phase==='gameover'");
      await evaluate("document.querySelector('.pager-shell').scrollTop=0");await shot('gameover');
      await clickText('.pager-shell button','Next shift');
      await wait("document.querySelector('.pager-overlay').dataset.phase==='active'");
      await assert("document.querySelector('.pager-budget').textContent.includes('100%')",'restart resets budget');
      await press('Escape','Escape',27);await assert("!document.querySelector('[inert]')",'pager releases focus');
      await evaluate("Array.from(document.querySelectorAll('.connections-tools button')).find(b=>b.textContent.startsWith('Kubernetes')).click()");
      await assert("document.querySelector('.connections-origin strong').textContent==='Kubernetes'",'connection tool selection');
      await evaluate("Array.from(document.querySelectorAll('.connections-projects button')).find(b=>!b.disabled).click()");
      await assert("!!document.querySelector('.connections-evidence a[href^=\"/projects/\"]')",'connection evidence link');
      await assert("!document.querySelector('.query-workstation')",'SQL engine deferred');
      await evaluate("document.querySelector('.lab-query-drawer summary').click()");
      await wait("document.querySelector('.query-workstation table')!==null");
      await setInput('.query-workstation textarea','SELECT count(*) AS projects FROM project;');await press('Enter','Enter',13,2);
      await wait("document.querySelector('.query-workstation table tbody').textContent.trim()==='8'");
      await setInput('.query-workstation textarea','DELETE FROM project;');await press('Enter','Enter',13,2);
      await wait("document.querySelector('.query-workstation [role=status]').textContent.includes('refused') || document.querySelector('.query-workstation').textContent.includes('refused')");
      await clickText('.query-workstation button','schema');await assert("document.querySelector('.query-workstation').textContent.includes('CREATE') || document.querySelector('.query-workstation').textContent.includes('project')",'schema visible');
      await evaluate("document.querySelector('.query-workstation').scrollIntoView({block:'center'})");await shot('sql');
      await evaluate("document.querySelector('.connections').scrollIntoView({block:'center'})");await shot('connections');
      await wait("document.querySelectorAll('.waterfall-row').length>0");
      await clickText('.waterfall button','Freeze view');
      await evaluate("document.querySelector('.waterfall-row').click()");
      await assert("document.querySelector('.waterfall-detail').textContent.includes('elapsed')",'recorded request details');
      await clickText('.waterfall button','Fetch / data');
      await assert("Array.from(document.querySelectorAll('.waterfall-row small')).every(b=>/fetch|xmlhttprequest/.test(b.textContent))",'request filter');
      await clickText('.waterfall button','Everything');
      await evaluate("document.querySelector('.waterfall').scrollIntoView({block:'center'})");await shot('waterfall');
      await go('/projects/clarity');
      await evaluate("document.querySelector('.grounding-toggle').click()");await sleep(350);
      await assert("document.querySelector('.grounding-toggle').getAttribute('aria-pressed')==='false'",'grounding toggle');
      await evaluate("document.querySelector('[data-example=sql]').click()");
      const sqlButtons=await evaluate("document.querySelectorAll('.sql-playground-surface button').length");
      for(let i=0;i<sqlButtons;i++){await evaluate(`document.querySelectorAll('.sql-playground-surface button')[${i}].click()`);await sleep(180);await assert(`document.querySelectorAll('.sql-playground-surface button')[${i}].getAttribute('aria-pressed')==='true'`,'SQL example selection');}
      await evaluate("document.querySelector('.sql-playground-surface').scrollIntoView({block:'center'})");await shot('sql-guard');
      await evaluate("document.querySelector('[data-example=schema]').click()");
      await evaluate("document.querySelectorAll('.schema-directory-surface [role=button]')[1].focus()");await press(' ','Space',32);await assert("document.querySelectorAll('.schema-directory-surface [role=button]')[1].getAttribute('aria-pressed')==='true'",'schema annotation keyboard');
      await go('/projects/ai-gateway');await clickText('.gateway-tracer-surface button','clarity-chat');await sleep(1500);
      await assert("document.querySelector('.gateway-tracer-surface').textContent.includes('200')",'allowed gateway request');
      await clickText('.gateway-tracer-surface button','new-service');await sleep(1100);
      await assert("document.querySelector('.gateway-tracer-surface').textContent.includes('401')",'empty allowlist refusal');
      await evaluate("document.querySelector('.gateway-tracer-surface').scrollIntoView({block:'center'})");await shot('gateway');
      await go('/projects/heimdall');
      await evaluate("document.querySelector('.heimdall-instrument button').click()");
      await evaluate("document.querySelector('.heimdall-instrument button[aria-label]').click()");
      await assert("document.querySelector('.heimdall-instrument').textContent.includes('commit') || document.querySelector('.heimdall-instrument').textContent.includes('revision')",'Heimdall cell details');
      await evaluate("document.querySelector('.heimdall-instrument').scrollIntoView({block:'center'})");await shot('heimdall');
      await go('/projects/ml-scheduler');
      await evaluate("document.querySelectorAll('.evidence-controls button')[1].focus()");await press(' ','Space',32);
      await assert("document.querySelector('.evidence-numbers').textContent.includes('80.5') && document.querySelector('.evidence-numbers').textContent.includes('95.9')", 'recorded run selection');
      await evaluate("document.querySelectorAll('.evidence-controls button')[0].click()");
      await assert("document.querySelector('.evidence-numbers').textContent.includes('81.1') && document.querySelector('.evidence-numbers').textContent.includes('94.0')", 'recorded mean');
      await go('/');
      await shot('home');
      await evaluate("document.querySelector('.pager-invite').click()");
      await wait("!!document.querySelector('.pager-mode-picker')");
      await evaluate("document.querySelectorAll('.pager-mode-picker button')[1].click()");
      await clickText('.pager-shell button','Take the pager');
      await sleep(2300);
      await assert("!document.querySelector('.pager-budget').textContent.includes('100%')", 'timed mode drains budget');
      const timedAlert=await evaluate("document.querySelector('.pager-incident > div:first-child > p:last-child').textContent");
      await evaluate(`Array.from(document.querySelectorAll('.pager-actions button')).find(b=>b.textContent.endsWith(${JSON.stringify(answers[timedAlert])})).click()`);
      await wait("document.querySelector('.pager-overlay').dataset.phase==='resolved'");
      await evaluate("document.querySelector('[aria-label=\"Close game\"]').focus()");await press(' ','Space',32);
      await assert("!document.querySelector('.pager-overlay') && !document.querySelector('[inert]')", 'native close button works after resolution');
      await evaluate("document.querySelector('.motion-toggle').click()");
      await assert("getComputedStyle(document.querySelector('.ambient-light')).animationPlayState==='paused'", 'background motion can pause');
      await evaluate("document.querySelector('.motion-toggle').click()");
      await assert("getComputedStyle(document.querySelector('.ambient-light')).animationPlayState==='running'", 'background motion resumes');
      // The hero's readout is a live region that changes on its own; leave it out of the comparison.
      const MAIN_TEXT="(() => { const m = document.querySelector('main').cloneNode(true); m.querySelectorAll('[aria-live], .pod-readout').forEach((e) => e.remove()); return m.textContent; })()";
      const original=await evaluate(MAIN_TEXT);
      await evaluate("window.dispatchEvent(new Event('devlinops:chaos'))");await sleep(1800);await press('Escape','Escape',27);
      if(original!==await evaluate(MAIN_TEXT))throw Error('chaos did not restore text');
      await assert("!document.querySelector('[data-chaos-ui]')",'chaos dismissed');
      await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]},sessionId);
      await evaluate("window.dispatchEvent(new Event('devlinops:chaos'))");await sleep(150);
      if(original!==await evaluate(MAIN_TEXT))throw Error('reduced-motion chaos mutates page');
      await press('Escape','Escape',27);
      await assert("getComputedStyle(document.querySelector('.ambient-light')).animationName==='none'", 'reduced motion background is static');
      await assert("document.documentElement.scrollWidth<=document.documentElement.clientWidth",'no page overflow');
      if(errors.length)throw Error(errors.join('\n'));
      listeners.delete(listener);await send('Target.closeTarget',{targetId});console.log(`PASS ${width}px: terminal, handoff, five incidents, pause, handover, breach/restart, connections, deferred SQL, request recorder, guard, grounding, schema, gateway, Heimdall, chaos, reduced motion`);
    }
  } finally {
    ws?.close();
    await new Promise((res) => { chrome.once("exit", res); chrome.kill(); });
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
