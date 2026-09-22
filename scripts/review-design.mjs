// Capture complete portfolio pages for design review using Chrome DevTools Protocol.
// Run against a production server: node scripts/review-design.mjs [base-url]
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

    for (const width of [390, 1440]) {
      for (const route of ['/', '/projects', '/projects/nightshift', '/about', '/lab', '/projects/clarity']) {
        const {targetId} = await send('Target.createTarget',{url:'about:blank'});
        const {sessionId} = await send('Target.attachToTarget',{targetId,flatten:true});
        await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<800},sessionId);
        await send('Page.enable',{},sessionId);
        await send('Runtime.enable',{},sessionId);
        const ready=waitFor('Page.loadEventFired',sessionId);
        await send('Page.navigate',{url:base+route},sessionId);
        await ready;
        await send('Runtime.evaluate',{expression:'document.fonts.ready',awaitPromise:true},sessionId);
        await sleep(700);
        // Load below-the-fold screenshots before capturing the complete page.
        await send('Runtime.evaluate',{expression:"Promise.all(Array.from(document.images).map(i=>{i.loading='eager';return i.decode().catch(()=>{})}))",awaitPromise:true},sessionId);
        const layout=await send('Page.getLayoutMetrics',{},sessionId);
        const data=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:layout.cssContentSize.height,scale:1}},sessionId);
        const name=route==='/'?'home':route.slice(1).replaceAll('/','-');
        const file=join(tmpdir(), `design-${name}-${width}.png`);
        writeFileSync(file,Buffer.from(data.data,'base64'));
        console.log(file);
        await send('Target.closeTarget',{targetId});
      }
    }

  } finally {
    ws?.close();
    await new Promise((res) => { chrome.once("exit", res); chrome.kill(); });
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
