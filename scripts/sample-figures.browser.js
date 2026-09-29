// Paste into the DevTools console on an internal dashboard (Heimdall, the
// Sentry test-reports UI) before taking a screenshot for the site.
//
// It rewrites the page in your tab only. Nothing is sent anywhere and a
// reload puts everything back. What it changes:
//   - standalone figures become smaller sample figures; labels, units and
//     step numbers (01–04, 24h, 14d) are left alone so the page still reads
//   - ticket keys (ABC-1234) become DEMO-1234
//   - commit hashes and image digests become sample hex, consistently, so
//     the same build still matches across environments
//   - every name in NAMES and PEOPLE becomes a neutral stand-in, in both
//     kebab-case and Title Case ("orders-api" and "Orders Api")
//
// Fill in NAMES and PEOPLE first, then check the page by eye before
// capturing: this catches patterns, not everything. Leave out any page
// that shows free text you can't vouch for, like ticket titles.
// Capture: DevTools → Cmd+Shift+P → "Capture screenshot" at 1440px wide.
(() => {
  const NAMES = {
    // "real-service": "neutral-stand-in",
  };
  const PEOPLE = [
    // "Full Name",
  ];
  const COMPANY = /\bacme-internal\b/gi; // your company's name, if it appears
  const KEEP = /^(0[1-9]|\d+[hd])$/;

  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const title = (s) => s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
  const rules = [];
  Object.entries(NAMES).sort((a, b) => b[0].length - a[0].length).forEach(([from, to]) => {
    rules.push([new RegExp(`(^|[^A-Za-z0-9-])${esc(title(from))}(?![A-Za-z0-9-])`, "g"), title(to)]);
    rules.push([new RegExp(`(^|[^A-Za-z0-9-])${esc(from)}(?![A-Za-z0-9-])`, "gi"), to]);
  });
  PEOPLE.forEach((p, i) => rules.push([new RegExp(`()${esc(p)}`, "g"), `engineer-${i + 1}`]));

  // High bits of an LCG: the low bits cycle and give runs like 0000000.
  let seed = 20260929;
  const nibble = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return (seed >>> 24) & 15; };
  const hexes = new Map();
  const sampleHex = (h) => {
    if (!hexes.has(h)) {
      let out = "";
      for (let i = 0; i < h.length; i++) out += "0123456789abcdef"[nibble()];
      hexes.set(h, out);
    }
    return hexes.get(h);
  };
  const sampleFigure = (n) => (n <= 3 ? Math.max(0, n - 1) : Math.max(1, Math.round(n * 0.28)));

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node, changed = 0;
  while ((node = walker.nextNode())) {
    const before = node.nodeValue;
    const trimmed = before.trim();
    let text = before;
    if (/^\d+$/.test(trimmed) && !KEEP.test(trimmed) && trimmed.length < 7) {
      text = before.replace(trimmed, String(sampleFigure(Number(trimmed))));
    } else {
      text = text
        .replace(/\b(?=[0-9a-f]*[a-f])(?=[0-9a-f]*\d)[0-9a-f]{7,40}\b/g, sampleHex)
        .replace(/^(\s*)(\d{7,8})(\s*)$/, (_, a, h, b) => a + sampleHex(h) + b)
        .replace(/\b[A-Z][A-Z0-9]{1,9}-(\d+)\b/g, "DEMO-$1");
    }
    for (const [re, to] of rules) text = text.replace(re, (_, pre) => (pre || "") + to);
    text = text.replace(COMPANY, "acme");
    if (text !== before) { node.nodeValue = text; changed++; }
  }
  document.querySelectorAll("input, textarea").forEach((el) => {
    el.value = "";
    if (el.placeholder) el.placeholder = el.placeholder.replace(/\b[A-Z][A-Z0-9]{1,9}-(?=\d)/g, "DEMO-");
  });

  const page = document.body.innerText;
  const leaks = [...Object.keys(NAMES), ...PEOPLE].filter((n) => page.toLowerCase().includes(n.toLowerCase()));
  console.log(`sample-figures: rewrote ${changed} text nodes. Still visible: ${leaks.length ? leaks.join(", ") : "none of the listed names"}. Check the page by eye before capturing.`);
})();
