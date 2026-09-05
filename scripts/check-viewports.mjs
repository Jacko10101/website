// Renders every route in the sitemap at a phone width and a desktop width
// and fails if any of them scrolls sideways. That bug class has shipped
// before: one unbreakable string dragging a whole page into horizontal
// scroll on a 390px viewport.
//
// Talks to Chrome over the DevTools Protocol with real device metrics.
// Headless Chrome's --window-size flag clamps to about 500px wide, which
// silently turns a 390px check into a 500px one; this does not.
//
// usage: node scripts/check-viewports.mjs [base-url]   (default http://localhost:3111)
//        CHROME_PATH=/path/to/chrome to override the browser binary
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3111";
const WIDTHS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
];

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

async function routesFromSitemap() {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const routes = locs.filter((p) => !p.endsWith(".pdf"));
  routes.push("/this-route-does-not-exist"); // the crashed-pod 404
  return [...new Set(routes)];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const chromePath = findChrome();
  const port = 9300 + Math.floor(Math.random() * 300);
  const profile = mkdtempSync(join(tmpdir(), "viewports-"));
  const chrome = spawn(chromePath, [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--no-first-run", "--hide-scrollbars",
    `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank",
  ], { stdio: "ignore" });

  let wsUrl = null;
  for (let i = 0; i < 100 && !wsUrl; i++) {
    try { wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl; }
    catch { await sleep(200); }
  }
  if (!wsUrl) throw new Error("chrome did not start");

  const ws = new WebSocket(wsUrl);
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

  const MEASURE = "({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })";
  const CULPRITS = `(() => {
    const cw = document.documentElement.clientWidth, out = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.right > cw + 1 && r.width > 0) {
        const cls = typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 3).join('.') : '';
        out.push(el.tagName.toLowerCase() + cls + ' right=' + Math.round(r.right) + ' "' + (el.textContent || '').trim().slice(0, 40) + '"');
        if (out.length >= 5) break;
      }
    }
    return out;
  })()`;

  const routes = await routesFromSitemap();
  const failures = [];
  for (const { width, height } of WIDTHS) {
    for (const route of routes) {
      const { targetId } = await send("Target.createTarget", { url: "about:blank" });
      const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
      await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile: width < 800 }, sessionId);
      await send("Page.enable", {}, sessionId);
      await send("Runtime.enable", {}, sessionId);
      const loaded = waitFor("Page.loadEventFired", sessionId);
      await send("Page.navigate", { url: base + route }, sessionId);
      await loaded;
      await sleep(800);
      const v = (await send("Runtime.evaluate", { expression: MEASURE, returnByValue: true }, sessionId)).result.value;
      const ok = v.sw <= v.cw;
      let culprits = [];
      if (!ok) culprits = (await send("Runtime.evaluate", { expression: CULPRITS, returnByValue: true }, sessionId)).result.value;
      console.log(`${ok ? "ok      " : "OVERFLOW"}  ${String(width).padStart(4)}px  ${String(v.sw).padStart(5)}/${v.cw}  ${route}`);
      for (const c of culprits) console.log(`            ${c}`);
      if (!ok) failures.push(`${route} @ ${width}px (${v.sw} > ${v.cw})`);
      await send("Target.closeTarget", { targetId });
    }
  }

  ws.close();
  // Wait for Chrome to actually exit before removing its profile, or the
  // directory is still being written to and the removal fails.
  await new Promise((res) => { chrome.once("exit", res); chrome.kill(); });
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });

  console.log(`\n${routes.length} routes × ${WIDTHS.length} widths, ${failures.length} overflow${failures.length === 1 ? "" : "s"}`);
  if (failures.length) {
    console.error(failures.map((f) => `  ${f}`).join("\n"));
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
