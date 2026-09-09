# Surface audit — 8 September 2026

The visual direction is an inspectable engineering portfolio. Public pages use
charcoal and green; the terminal is a workbench, the pager is an amber incident
desk, and embedded tools have labelled instrument frames. The aim is for each
surface to have a purpose and a distinct working interface.

| Surface | Finding and action |
| --- | --- |
| Terminal opening, welcome and output | Rebuilt as a two-pane workbench with a project directory, command prompt, quick starts and readable output. Project inspection uses the shared project source. Removed invented cluster/git output presented alongside real facts. |
| Terminal commands and navigation | Added project-name completion, real project comparison, research discovery and direct SQL access. Kept history, shortcuts, CV/contact access and explicit handoffs to the pager and chaos mode. History is bounded. |
| Overlay lifecycle | Both overlays now portal to the body and share focus capture, inert background, Tab containment, scroll locking and opener restoration. Early launch events load the extras immediately. Konami input is ignored while another dialog owns the keyboard. |
| Pager invitation and briefing | Replaced the ordinary start button with a pager display. The briefing uses an amber 03:12 clock and a five-incident shift strip. |
| Pager active incident | Added the service/alert header, visible phase and progress, readable evidence commands and an explicit pause. Budget drain and active response time exclude pauses. Existing scenario content and shuffled fixes remain. |
| Pager resolution and handover | Retained the evidence, lessons, grades and per-incident results. Added a copyable handover record. Storage failures no longer prevent a shift from running. |
| Lab landing | Reworked hierarchy, type, palette and instrument directory; direct anchors lead to the pager, query tool and measurements. |
| Project connections | Added a selectable tool-to-project map with source-derived relationships, outcomes, reported results and case-study links. Shared tools lead; all tools remain available. |
| Request recorder | Added a real Resource Timing waterfall with request filters, freeze/resume and selectable timing details. Names come from URL paths without query parameters. Buffer and cross-origin limits are stated. |
| Portfolio SQL | Moved behind an optional disclosure, with the engine loading only when opened. Added an editor gutter, shortcut toolbar and SQL copying. Editing clears the misleading selected-question state. A failed engine load can be retried. The real database and guard remain. |
| SQL guard | New instrument frame and larger example targets. Retained canonical-token inspection, live validation and allowed/refused output. |
| Schema directory | New frame; retained keyboard-operable annotations and real compiled-schema explanation. |
| Grounding comparison | New frame and consistent selected-state treatment; retained the toggle and contrasting answers. The switch retains its extended touch target. |
| AI gateway tracer | New frame and larger selection targets. Retained distinct model-existence and per-key allowlist failures, timed trace, reduced-motion handling and timer cleanup. |
| Heimdall demo | Removed decorative traffic-light chrome, kept the frozen-snapshot label and ticket/environment investigation. Frame and controls match the other instruments. |
| Screenshot and code exhibits | Shared labelled chrome replaces simulated desktop window controls. Real screenshots and code remain intact. |
| Architecture maps and drawings | Reviewed the estate, CI/CD, Heimdall and observability diagrams. Retained their system-specific structures, source labels, interactions and per-case accents instead of making every diagram look alike. |
| Homepage cutaway and research | Retained the inspectable layers and shared-source research pairs. Included in route, keyboard and reduced-motion regression checks. |
| Reading rail and progress | Added accessible link names, larger tick targets and collision-safe generated anchors. Progress is clamped and the decorative pulse is removed. |
| Navigation, footer and contact | Reviewed desktop/mobile controls, route state, direct links, CV and contact fallback. Lab now shares the public palette. No contact message was sent. |
| About and project directory | Retained the earlier editorial/content improvements and checked the page layouts. The project directory remains the direct route to all seven case studies. |
| Detailed case-study documents | Preserved the day log, PR, ADR, incident review, receipts, hardware specification and research paper. Shared exhibit changes apply without flattening these distinct document forms. |
| Session measurements | Reshaped as a measurement panel, corrected misleading timing copy and replaced lifetime layout-shift summing with a maximum-window estimate. |
| 404 | Removed invented pod restarts and timers. Now shows the actual missing route, an explicit no-match state and three useful destinations. |
| Chaos mode | Retained the deliberate, visitor-triggered effect. Restores on navigation, stops pending ramp work on dismissal, respects reduced motion, and uses a bounded console that can scroll on small screens. |
| Share cards and app icons | Retained the matching dark identity; asset responses checked. |

Layout-shift implementation reference:
[Chrome's CLS session-window definition](https://web.dev/articles/cls).
The display remains a local browser-document estimate, not a field-data report.

## Verification

Passed: production webpack build, TypeScript, lint, 65 unit tests and 65 route/viewport renders with no failures.

The saved `npm run check:surfaces` journey also passed at all three sizes. It covers
terminal inspection, focus restoration, terminal-to-pager handoff, five complete
incidents, paused budget, handover, budget exhaustion and restart, real SQL, rejected SQL, schema annotations,
grounding, gateway allow/refuse paths, Heimdall cells and chaos restoration. The Experiments follow-up adds connection selection, project evidence links, deferred SQL loading and request recorder filters/details.
It runs at 320, 390 and 1440 pixels and includes blocked browser storage.

These are functional and visual checks, not a claim of exhaustive accessibility
certification or cross-browser coverage. No changes have been deployed.
