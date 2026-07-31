# Next Session — Handoff Prompt

Copy everything between the lines into a new Claude Code session, then attach
the three `.docx` design documents.

---

```
You are continuing work on Flow Tribe v2, a content accountability platform
for a private community of creators. The project is feature complete for
version 1 and has NOT yet been deployed.

Working directory:
  C:\Users\CG\Documents\Claude\Projects\Personal\OUTPUTS\The-Flow-Tribe\FlowTribe-v2

IMPORTANT: The Flow Tribe v1 application lives in the PARENT folder. It is
read-only reference. Never modify anything outside FlowTribe-v2.

=====================================================================
STEP 1 — READ THESE FIRST, COMPLETELY, BEFORE ANY OTHER ACTION
=====================================================================

Read in this order:

  1. docs/FINAL_PRODUCT_DECISIONS.md      ← BINDING. READ THIS FIRST.
     Governs every other document. Defines exactly what is frozen and what
     may be changed.

  2. docs/PROJECT_OVERVIEW.md
     Vision, personas, workflows, business rules, requirements, roadmap.

  3. docs/ENGINEERING.md
     Architecture, stack, folder structure, auth, RBAC, schema, endpoints,
     services, error handling, security, deployment, testing, assumptions,
     known issues.

  4. docs/CURRENT_STATE.md
     Exactly what is built, what is partial, what has not started, blockers,
     technical debt, remaining decisions.

  5. The three design documents (attached by the user):
       - Flow-Tribe-Design-System.docx
       - Flow-Tribe-UI-Design-Specification.docx
       - Flow-Tribe-UI-Spec-Screens-7-15.docx

     Authoritative for VISUAL DESIGN ONLY.
     Do NOT recreate, rewrite, replace, or merge them.

     If pandoc is unavailable, a .docx is a ZIP of XML — unzip it and read
     word/document.xml directly. That is how they were read previously.

=====================================================================
STEP 2 — THE GOVERNING RULE (already decided — do not re-open)
=====================================================================

  The IMPLEMENTATION is the source of truth for how Flow Tribe WORKS.
  The DESIGN DOCUMENTS are the source of truth for how Flow Tribe LOOKS.

This was decided by the project owner. Option B. It is recorded in
docs/FINAL_PRODUCT_DECISIONS.md and is BINDING.

FROZEN — do not change, refactor, or re-litigate without explicit owner
approval, even if a design document says otherwise:

  authentication flow · registration flow · username + 6-digit PIN ·
  invite-gated registration · weekly streak logic · weekly goals ·
  submission workflow · business rules · database schema ·
  Apps Script architecture · API contracts · backend logic ·
  frontend behaviour · navigation flow · all implemented engineering decisions

ADOPTABLE — apply freely as visual work:

  brand colours · typography · design tokens · spacing · border radius ·
  shadows · buttons · cards · inputs · icons · illustrations · animations ·
  responsive layout improvements · UI polish

WHERE THE DESIGN DOCS CONTRADICT THE BUILD:
  The build wins. The conflict is ALREADY RESOLVED in
  FINAL_PRODUCT_DECISIONS.md §5 — twelve conflicts, all closed.
  Treat the design-document version as backlog, not as a defect.

  Concretely: KEEP username + PIN. KEEP invite-only registration.
  KEEP the weekly streak. KEEP the existing submission workflow.
  KEEP the existing business rules. KEEP the no-emoji rule.

  Do NOT build the screens specified in the docs but not built
  (marketing landing, member Settings, moderation queue, export,
  Flow Journey timeline, calendar month navigation, Top 3 spotlight)
  without explicit owner approval.

=====================================================================
STEP 3 — VERIFY YOUR UNDERSTANDING BEFORE CHANGING ANY CODE
=====================================================================

Run the test suite and confirm it is green BEFORE touching anything:

  powershell -ExecutionPolicy Bypass -File scripts/serve.ps1

  Then open http://localhost:5173/tests/backend.html
  Expected: 94/94 passing across 13 groups.

  Also useful:
    http://localhost:5173/              member app
    http://localhost:5173/admin.html    admin app
    http://localhost:5173/gallery.html  component gallery

Then state back to the user, in your own words:
  - What Flow Tribe is and who it serves
  - The governing rule from Step 2, and that you will not change behaviour
  - The current phase and what is blocking launch
  - What you intend to do next

Wait for confirmation before making changes.

=====================================================================
STEP 4 — CONTINUE FROM HERE
=====================================================================

The session ended after Phase 7 (production readiness) and the final product
decision. All engineering is done. Nothing is deployed.

Immediate priorities:

  1. Deploy — docs/deployment.md, about 30 minutes.
  2. Run setupSmokeTest() on the live project. Expect "ALL 27 CHECKS PASSED".
  3. Work docs/production-checklist.md (~120 items, ~20 minutes).
  4. Record real submission and dashboard latency from the execution log.
     This is the only unmeasured performance number; see ENGINEERING.md
     "Performance Considerations" for the agreed fallback if it exceeds 3s.
  5. VISUAL DESIGN PASS — approved and scheduled.
     Exact scope: FINAL_PRODUCT_DECISIONS.md §4.
     Suggested order: tokens.css colours → fonts → modal radius → icons →
     icon sizing → illustrations → desktop left sidebar navigation.
     APPEARANCE ONLY. If a change would alter behaviour, stop and ask.
     Read §6 first: Golden Yellow (#F5B400) and Bright Red (#FF2D2D) both
     fail WCAG AA for normal text.
  6. Brand & Content Pass — copy only.

Steps 1–4 and step 5 are independent; either order is fine.

AFTER ANY VISUAL WORK: re-run tests/backend.html. It must still be 94/94.
A "visual" change that breaks a test was not a visual change.

=====================================================================
CONVENTIONS YOU MUST PRESERVE
=====================================================================

  - NEVER use innerHTML. Every string goes through textContent via el().
    This is a security rule: session tokens live in localStorage and member
    text renders on admin screens.

  - Business logic is SERVER-SIDE ONLY. Format checks may be mirrored on the
    client for instant feedback; judgements (link matching, duplicates,
    streaks, ranking, milestones) may not — they judge the member.

  - Every backend action declares a capability in the action table in
    03_Router.gs. An action without one cannot exist.

  - Ledger first: Submissions is written before any derived value.

  - Every CSS value comes from tokens.css. No raw hex, no magic pixels.

  - Mobile-first. min-width queries only, never max-width.

  - Apps Script has NO module system. Nothing may run at the top level of a
    .gs file except declarations. Files load alphabetically into one global
    scope.

  - Charts are hand-rolled SVG. LOCKED — do not replace with Chart.js or any
    other library.

  - No emojis anywhere in the application. LOCKED.

  - Comment WHY, not WHAT.

  - Do not build ahead of the current phase. Raise architectural changes and
    wait for approval rather than making them silently.

=====================================================================
WORKING AGREEMENT
=====================================================================

  - Explain architectural decisions before implementing them.
  - If you believe a better approach exists, explain the trade-offs and ask.
  - Preserve existing functionality unless a change is explicitly approved.
  - Report honestly: distinguish what is VERIFIED from what is ASSUMED.
    The previous session drew this line carefully — 94 checks prove our code
    against an in-memory fake of Google's APIs; they do not prove Apps
    Script's runtime, real latency, or the deployment. Keep that distinction.
  - Pause at the end of each phase and wait for review.
```

---

## Why this handoff should work

Everything a new session needs is in files, not in conversation:

| Need | Where |
|---|---|
| **What may and may not be changed** | **`FINAL_PRODUCT_DECISIONS.md` — binding** |
| What the product is and why | `PROJECT_OVERVIEW.md` |
| How it is built, and every reason | `ENGINEERING.md` |
| What is done, pending, and blocked | `CURRENT_STATE.md` |
| Design authority | The three `.docx` files |
| Every decision and its rationale | `decisions.md` (D1–D42) |
| Field-level schema | `data-dictionary.md` |
| Endpoint contracts | `api.md` |
| Security posture with evidence | `security-review.md` |
| How to deploy | `deployment.md` |
| How to verify | `production-checklist.md` |
| **Whether it still works** | `tests/backend.html` — 94 checks |

The test suite is the real safety net. Any future session can prove the system
is intact in about ten seconds, before changing a line.
