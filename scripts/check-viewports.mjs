// Renders every route in the sitemap, plus the 404, at four widths, and fails
// on any of: horizontal overflow, a non-200 status (404 for the 404 route),
// or a console error or uncaught exception. That covers the bug class that
// has shipped before (one unbreakable string dragging a phone-width page
// sideways) and the hydration errors that only show in a browser.
//
// Talks to Chrome over the DevTools Protocol with real device metrics.
// Headless Chrome's --window-size flag clamps to about 500px wide, which
// silently turns a 390px check into a 500px one; this does not.
//
// usage: node scripts/check-viewports.mjs [base-url]   (default http://localhost:3111)
//        CHROME_PATH=/path/to/chrome to override the browser binary
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3111";
const NOT_FOUND = "/this-route-does-not-exist";
const WIDTHS = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
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
  routes.push(NOT_FOUND);
  return [...new Set(routes)];
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
  const chromePath = findChrome();
  const profile = mkdtempSync(join(tmpdir(), "viewports-"));
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
    let checks = 0;
    for (const { width, height } of WIDTHS) {
      for (const route of routes) {
        const { targetId } = await send("Target.createTarget", { url: "about:blank" });
        const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
        await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile: width < 800 }, sessionId);
        await send("Page.enable", {}, sessionId);
        await send("Runtime.enable", {}, sessionId);
        await send("Network.enable", {}, sessionId);

        // The document's own status, and anything the page logs as an error.
        let status = null;
        const errors = [];
        const listener = (m) => {
          if (m.sessionId !== sessionId) return;
          if (m.method === "Network.responseReceived" && m.params.type === "Document" && status === null) status = m.params.response.status;
          if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.text ?? "exception");
          if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") {
            const text = m.params.args.map((a) => a.value ?? a.description ?? "").join(" ");
            if (!/Ignoring Event: localhost/.test(text)) errors.push(text.slice(0, 160));
          }
        };
        listeners.add(listener);

        const loaded = waitFor("Page.loadEventFired", sessionId);
        await send("Page.navigate", { url: base + route }, sessionId);
        await loaded;
        // Fonts swap widths and the deferred extras arrive after load.
        await send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true }, sessionId);
        await sleep(600);

        const v = (await send("Runtime.evaluate", { expression: MEASURE, returnByValue: true }, sessionId)).result.value;
        const wantStatus = route === NOT_FOUND ? 404 : 200;
        const problems = [];
        if (v.sw > v.cw) {
          const culprits = (await send("Runtime.evaluate", { expression: CULPRITS, returnByValue: true }, sessionId)).result.value;
          problems.push(`overflow ${v.sw} > ${v.cw}` + culprits.map((c) => `\n              ${c}`).join(""));
        }
        if (status !== wantStatus) problems.push(`status ${status} (wanted ${wantStatus})`);
        for (const e of errors) problems.push(`console: ${e}`);

        checks++;
        console.log(`${problems.length ? "FAIL" : "ok  "}  ${String(width).padStart(4)}px  ${String(status).padStart(3)}  ${route}`);
        for (const p of problems) {
          console.log(`            ${p}`);
          failures.push(`${route} @ ${width}px: ${p.split("\n")[0]}`);
        }

        listeners.delete(listener);
        await send("Target.closeTarget", { targetId });
      }
    }

    console.log(`\n${checks} renders, ${failures.length} failure${failures.length === 1 ? "" : "s"}`);
    if (failures.length) {
      console.error(failures.map((f) => `  ${f}`).join("\n"));
      process.exitCode = 1;
    }
  } finally {
    ws?.close();
    await new Promise((res) => { chrome.once("exit", res); chrome.kill(); });
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
