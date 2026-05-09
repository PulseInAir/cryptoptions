
## Goal
Match the Sensibull-style look & feel from A1 (landing) and A2 (post-login dashboard) inside CryptOptions, adapted for BTC/ETH crypto options.

## Scope

### 1. Landing page redesign (image A1)
Rework `src/pages/Index.tsx` and supporting components into these sections, in order:

1. **Hero** — "Trade Crypto Options with Clarity and Control" headline, subhead, CTA button, and a dark glass mock of an option chain + payoff chart on the right.
2. **Trust strip** — "50K+ traders", "SEBI*-style transparency", "4.8★" mini-stats row (adapted: "Powered by Delta Exchange India").
3. **Integrations row** — "Integrated with Delta Exchange India" (single broker, since that's the only data source).
4. **Testimonial quote** — single large pull quote with avatar.
5. **Build Strategies without Spreadsheets** — left copy + right payoff/Greeks mock (reuse strategy builder visuals).
6. **Analyse & Manage your Trades** — left copy + right positions table mock.
7. **Rehearse Before You Risk** — paper-trading pitch + screenshot mock.
8. **Track live market data & clarify trends** — OI heatmap mock on left, copy on right.
9. **Pioneers of transparency in Indian F&O** (adapted to "crypto F&O") — bullet list + dashboard mock.
10. **Conquer your Mind** — mindful-trading callout card with two prompt chips.
11. **Access Anywhere** — phone mockup + QR placeholder.
12. **Testimonials grid** — 3–4 user reviews with stars.
13. **In the Spotlight** — press/logo strip (placeholder logos).
14. **Pricing CTA** — existing Pricing block, rebranded to "Join 2 Million+ traders" style banner.
15. **Footer** — keep existing.

All sections use existing semantic tokens (`bg-card`, `text-gradient`, `bg-gradient-primary`, `glass`, `shadow-card`). No raw colors.

### 2. Post-login Dashboard (image A2)
- New route `/dashboard` (component `src/pages/Dashboard.tsx`).
- After login, redirect from `/auth` to `/dashboard` (and update Hero CTA to go to `/dashboard` when logged in).
- Layout:
  - Welcome header: "Welcome {display_name}," + small "X people sharing live positions right now" line.
  - **Top trader carousel row** — 4 placeholder cards with avatar, handle, P&L number, % change.
  - **Primary action grid** (2 rows × 3 cols on desktop):
    - Easiest way to trade options → Easy options (links `/strategy-builder`)
    - Get ready-made strategies → Strategy wizard
    - Create your own strategies → Strategy builder
    - Practice Trade / Draft Portfolios → `/paper-trading`
    - BTC/ETH Heatmap → `/oi-analysis`
    - #VerifiedByCryptOptions → share P&L (placeholder)
  - Right-side promo card "Introducing Mindful Trading".
  - **Advanced tools section** with sub-headers:
    - *Tools to guess the direction*: Option Chain, Open Interest Analysis (2 large cards with mock visuals).
    - *Multi-strike OI*, *Whale Flow data* (2 cards).
    - *Multi Straddle-Strangle Charts*, *Live Options Charts* (2 cards).
    - *Crypto data* (1 card).
  - **Find great trades**: Screener, Technical signals (2 cards).
  - **Others**: IV chart, Events calendar (2 cards).
- Each card is a `Link` to the closest existing route (Option Chain, OI Analysis, Strategy Builder, Paper Trading) or `#` placeholder if no route.
- Cards use `bg-card border border-border rounded-xl p-5 hover:border-primary/40` with a small SVG/emoji thumbnail on top and title + description below.

### 3. Routing & redirect
- Add `/dashboard` route in `src/App.tsx` wrapped in `ProtectedRoute`.
- In `Auth.tsx`, after successful login/signup redirect to `/dashboard`.
- In `Navbar`, add "Dashboard" link visible only when `user` is set (replaces or precedes existing links on the user dropdown).

### 4. Out of scope
- No backend changes, no new tables, no edge function changes.
- No Razorpay or auth logic changes.
- No real "live positions" data — placeholder numbers only.

## Technical notes
- All new components in `src/components/landing/` (one file per major section) and `src/components/dashboard/` for the dashboard cards.
- Reuse `MiniPayoff`-style inline SVGs for mock charts; no new image assets required.
- Keep page under 200 lines per file; split sections aggressively.
- Use `framer-motion` only if already installed; otherwise CSS transitions.
