# Website review — 8 September 2026

## Direction: inside the machine

The homepage is built around actual software and the decisions underneath it.
The dark palette stays. The oversized serif nameplate, repeated Heimdall feature,
illustrative recovery model and generic delivery animation have been removed
from the homepage.

## Current experience

- **Opening:** Jack’s name, portrait, platform role and availability; a large
  product cutaway built from the real Heimdall screenshot and code-native
  architecture drawings. The four selectable layers explain the product,
  delivery, runtime and observability, with direct case-study links.
- **Decisions:** the shared pipeline stops at an image; ArgoCD handles promotion;
  Heimdall reads pod health directly; monitoring uses existing cluster capacity.
  Drawings describe those systems, not live telemetry or actual pod counts.
- **Clarity:** a focused product story and real answer-with-SQL screenshot,
  linked to the trust-layer case study and AI Gateway.
- **Research:** five recorded pairs from the dissertation’s always-down services
  experiment. Visitors can select a run or see the mean. Both the homepage and
  dissertation import the same numerical data. Lines compare endpoints, not
  invented recovery timelines. The narrow experimental setting is identified.
- **Personal work:** links into the flat’s K3s system, incident simulator and
  queryable portfolio, followed by direct contact.
- **Interior pages:** the earlier improvements to About, Projects and Contact
  remain, with charcoal backgrounds, off-white text and restrained green.
  Technical case studies retain their document forms and detailed evidence.

## Implementation and validation

The cutaway uses CSS transforms and SVG with the real product image. It does not
add an animation library, generated imagery or external service. All controls
are native buttons, focusable and keyboard operable; the content remains
available via ordinary project navigation. Reduced motion disables the cutaway
transition, and the mobile invitation brings the selected drawing into view.

Validation covers the production webpack build, TypeScript, lint, 63 unit tests,
and the viewport script across 13 routes at five widths. The script checks
keyboard navigation, layer selection, unobstructed controls, recorded evidence
values and reduced motion. Additional visual checks cover every cutaway layer
at 320, 390, 1024 and 1440 pixels and the research chart.

These checks do not certify full accessibility or measure visitor response.
No contact message has been sent, and the work remains local and uncommitted.

## Personal material that would strengthen future iterations

- One attributed teammate quote about the effect of the work.
- Sourced before/after pipeline measurements and a publishable Clarity receipt.
- Team size and responsibility boundaries where these clarify ownership.
- Original photos or artefacts from the home setup, if Jack wants to share them.

`PERSONAL-TODO.md` contains older notes. Current profile data and Jack’s direct
instructions take precedence over those notes.
