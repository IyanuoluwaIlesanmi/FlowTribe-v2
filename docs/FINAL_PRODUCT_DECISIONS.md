# Final Product Decisions

**Status: BINDING. This document governs.**
**Decided by the project owner. Supersedes any contrary reading of any other
document, including the three design documents.**

Any future session — human or Claude — must read this before acting on
anything in `docs/` or in the `.docx` design files.

---

## 1. The decision, in one line

> **The implementation is the source of truth for how Flow Tribe *works*.
> The design documents are the source of truth for how Flow Tribe *looks*.**

This resolves the divergence previously catalogued as **D0** in
[`CURRENT_STATE.md`](CURRENT_STATE.md). Option **B** was chosen.

---

## 2. Two authorities, two scopes

| Authority | Scope | Precedence |
|---|---|---|
| **The built implementation** (Phases 1–7, approved) | All product behaviour, business logic, workflows, engineering | **Absolute** for functionality |
| **The three `.docx` design documents** | Visual design and UI presentation only | **Absolute** for appearance |

The three design documents:

- `Flow-Tribe-Design-System.docx`
- `Flow-Tribe-UI-Design-Specification.docx`
- `Flow-Tribe-UI-Spec-Screens-7-15.docx`

They must never be recreated, rewritten, replaced, or merged.

---

## 3. FROZEN — do not change without explicit owner approval

These are settled. **Do not change, refactor, "improve", or re-litigate any of
them**, even if a design document describes something different.

| # | Frozen |
|---|---|
| 1 | **Authentication flow** — including exponential backoff and constant-time comparison |
| 2 | **Registration flow** — three steps, invite-gated |
| 3 | **Username + 6-digit PIN authentication** |
| 4 | **Invite-only registration** — single-use codes, 14-day default expiry |
| 5 | **Weekly streak logic** — consecutive weeks meeting goal; the current week never breaks a streak |
| 6 | **Weekly goals** — 3, 5, or 7; `GoalAtSubmission` frozen per row |
| 7 | **Submission workflow** — one field; platform fixed at registration |
| 8 | **All business rules** — see `PROJECT_OVERVIEW.md` §Business Rules |
| 9 | **Database schema** — all 14 sheets, every column |
| 10 | **Google Apps Script architecture** — layering, orchestrators, pipeline |
| 11 | **API contracts** — all 39 actions, envelope, error codes |
| 12 | **Backend logic** — services, repositories, jobs, reconciliation |
| 13 | **Frontend behaviour** — data flow, state, loading, error handling |
| 14 | **Navigation flow** — routes, guards, information architecture |
| 15 | **All engineering decisions already implemented** — D1–D42 in [`decisions.md`](decisions.md) |

### Also frozen — earlier locked decisions, unchanged

- **No emojis anywhere in the application.** The design documents use emojis
  as shorthand; the Design System itself specifies *"premium icon badges
  rather than emojis"*. **The icon system wins.**
- **Charts are hand-rolled SVG.** Do not introduce Chart.js or any charting
  library. The Design System also specifies SVG, so these agree.
- **No build step. No runtime dependencies.**

---

## 4. ADOPTABLE — visual design from the design documents

Everything here changes appearance only. **If a visual change would alter
behaviour, it is out of scope and must be raised first.**

### 4.1 Brand colours — `Flow-Tribe-Design-System.docx` Step 1

| Purpose | Name | Hex |
|---|---|---|
| Primary | Deep Burgundy | `#5B0000` |
| Secondary | Bright Red | `#FF2D2D` |
| Accent | Golden Yellow | `#F5B400` |
| White | White | `#FFFFFF` |
| Background | Soft Off White | `#F8F8F8` |
| Text | Charcoal | `#222222` |
| Border | Light Grey | `#E5E5E5` |
| Success | Green | `#22C55E` |
| Warning | Amber | `#F59E0B` |
| Error | Red | `#DC2626` |

**Implementation note:** these replace the values in `styles/tokens.css`. Every
component reads from tokens, so this is largely a single-file change. Scales
(50–900) will need regenerating around the new anchors.

### 4.2 Typography — Step 2

- **Satoshi** — headings, cards, statistics, buttons. Bold 700, Medium 500.
- **Inter** — body, forms, tables, labels, navigation, admin. Regular 400,
  Medium 500, SemiBold 600.

Type scale: Hero 48 · Page 36 · Section 28 · Card 22 · Subheading 18 · Body 16
· Small 14 · Caption 12.

Buttons: Satoshi Medium 16px. Statistics: Satoshi Bold, 32–48px.

**Implementation note:** `styles/fonts.css` already has `@font-face` blocks
written and commented, and `--ft-font-display` / `--ft-font-brand` already
exist. Drop `.woff2` files into `assets/fonts/`, uncomment, repoint the
variables. **Self-host — do not use the Google Fonts CDN** (render-blocking
third-party request, leaks member IPs, breaks when blocked).

### 4.3 Design tokens — Step 3

| Token | Value |
|---|---|
| Radius — buttons, inputs | 12px |
| Radius — cards | 20px |
| Radius — modals | **24px** *(currently 28px)* |
| Radius — badges | 999px (pill) |
| Radius — avatars | 50% (circle) |
| Spacing | Multiples of 8: XS 4 · SM 8 · MD 16 · LG 24 · XL 32 · XXL 48 · XXXL 64 |
| Shadows | 3 levels: cards · hover · modals. Soft, never harsh |
| Max content width | 1280px |
| Grid | Desktop 12-col · Tablet 8-col · Mobile 4-col |

Cards: white background, 20px radius, soft shadow, 24px internal padding.
Inputs: white background, light border, rounded, burgundy focus glow.
Buttons: Primary burgundy/white · Secondary white with burgundy border ·
Success green · Danger red.

### 4.4 Iconography — Step 4

Outline icons, 2px stroke, rounded corners, clean geometry — the existing
system already matches this.

Sizes: navigation 24 · buttons 20 · cards 24 · statistics 28 · empty states 64
· feature highlights 80.

Icon colours: default `#222222` · active `#5B0000` · success `#22C55E` ·
warning `#F59E0B` · error `#DC2626` · disabled `#BDBDBD`.

**Icon mappings to adopt** (the milestone *set* stays exactly as built — only
the icons change):

| Milestone | Icon |
|---|---|
| First Step | Footsteps |
| First Goal Completed | Target |
| 7 Active Days | Calendar Check |
| 30 Active Days | Calendar Star |
| 100 Active Days | Medal |
| Perfect Week | Check Circle |
| Five Perfect Weeks | Shield |
| Consistency Champion | Crown |
| Weekly Champion | Trophy |
| 10 / 50 / 100 / 250 / 500 Posts | Pen · Feather · Spark · Mountain · Diamond |
| Founding Member | Flag |

**Note:** the design document's milestone list omits **Top 10**, which exists
in the build. Keep it; assign an icon consistent with the set (Medal is taken —
suggest a numbered badge or ribbon). This is an icon gap, not a product change.

| Flow Level | Icon |
|---|---|
| Seedling | Leaf |
| Creator | Pencil |
| Builder | Hammer |
| Consistent Creator | Mountain |
| Community Leader | Compass |
| Tribe Legend | Star |

Feature icons: Dashboard→Home · Submit→Pen · Calendar→Calendar · Weekly
Goal→Target · Flow Level→Mountain · Milestones→Award · Leaderboard→Trophy ·
Profile→User · Notifications→Bell · Settings→Gear · Members→Users ·
Analytics→Bar Chart · Audit→Clipboard · Invites→Ticket · Logout→Arrow Out.

### 4.5 Illustrations

Flat, friendly, minimal, clean, modern. No cartoon characters, 3D, excessive
gradients, or busy backgrounds. Empty states get a simple illustration that
encourages action without feeling childish.

### 4.6 Animations

Smooth, never distracting. Button hover · card hover · page transitions ·
progress updates · achievement unlocks · loading states. No excessive bouncing
or flashy effects. Milestone unlock: clean badge, subtle glow, soft scaling,
minimal restrained confetti.

### 4.7 Responsive layout and UI polish

Generous whitespace · large cards · rounded corners · clear typographic
hierarchy · minimal borders · colour used intentionally.

**Desktop navigation becomes a left sidebar; mobile keeps bottom navigation.**

> **This one deserves care.** It is the largest visual change and touches
> layout components. It is classified as **visual** because the routes, guards,
> and information architecture are unchanged — only the presentation of the
> same navigation moves. If implementing it would require changing any route or
> guard, **stop and raise it**.

---

## 5. Conflicts — resolved, and closed

Where a design document contradicts the implementation, **the implementation
wins**. The conflicting specification is recorded as a *conceptual or future
enhancement* and is **not** to be built without explicit owner approval.

| # | Design document says | Resolution — BINDING |
|---|---|---|
| C1 | Email + password (min 8 chars) | **KEEP username + 6-digit PIN.** Backlog only |
| C2 | Registration collects email, no invite code | **KEEP invite-gated registration, no email at registration.** Backlog only |
| C3 | "Remember me" checkbox | **KEEP the always-on 30-day session.** Backlog only |
| C4 | Functional forgot-password recovery | **KEEP admin PIN reset.** Backlog only |
| C5 | Separate Admin Login screen | **KEEP shared login with role-based redirect.** Backlog only |
| C6 | **Daily** streak ("14-Day Streak") | **KEEP the weekly streak.** Backlog only |
| C7 | Platform chosen per submission (dropdown) | **KEEP platform fixed at registration.** The locked spec says *"The user should NEVER choose a platform again"* — the design document contradicts it |
| C8 | 10 platforms (adds Facebook, Threads, Medium, Website, Other) | **KEEP the 5 supported platforms.** Backlog only |
| C9 | Submission has Title and Reflection fields | **KEEP the single-field submission.** Backlog only |
| C10 | One submission per day | **KEEP the 30-day duplicate-link rule and daily cap.** Backlog only |
| C11 | Emojis throughout | **KEEP the no-emoji rule.** Use the icon system |
| C12 | Screens not built: marketing landing, member Settings, Pending Reviews / moderation, Export, Flow Journey timeline, calendar month navigation and day detail panel, leaderboard Top 3 spotlight, invite codes with max uses | **NOT BUILT. Backlog only.** Do not build without approval |

**None of the above is a defect. Each is a recorded product decision.**

---

## 6. Two cautions for whoever implements the visual work

Raised now so they are not discovered mid-implementation.

### 6.1 Contrast

The design documents require **WCAG AA** on every screen. Two of the new
colours need checking against their intended backgrounds before use:

- **Golden Yellow `#F5B400`** on white is roughly 1.9:1 — far below the 4.5:1
  required for normal text. It is safe for large numerals, fills, borders, and
  icons, **not** for body text.
- **Bright Red `#FF2D2D`** on white is roughly 3.9:1 — below AA for normal
  text, acceptable for large text and non-text elements.

Use them as accents and fills. Keep body copy on Charcoal `#222222`.

### 6.2 Bright Red as "Secondary"

`#FF2D2D` (Secondary) sits very close to `#DC2626` (Error). Using a red as a
general secondary colour risks reading as a warning wherever it appears.

**Suggestion, not a decision:** reserve Bright Red for celebratory and
brand-expressive moments only, and keep every error state on `#DC2626`. Confirm
with the owner before applying Secondary broadly.

---

## 7. What a future session must do

1. **Read this document before acting on any other.**
2. Treat §3 as immovable. If a design document appears to require changing
   something in §3, **it does not — §5 has already resolved it.**
3. Apply §4 freely, as visual work.
4. If something is genuinely ambiguous, **ask the owner. Do not decide.**
5. Never recreate, rewrite, or replace the three `.docx` files.

### The test that catches a mistake

`tests/backend.html` — **94 checks, 13 groups.** Visual work must leave it at
**94/94**. If a "visual" change breaks a test, it was not a visual change.

---

## 8. Revision

| Date | Change |
|---|---|
| 2026-07-31 | Created. Option B adopted. D0 resolved and closed |

Only the project owner may amend this document. A future session that believes
something here is wrong should **say so and wait**, not edit it.
