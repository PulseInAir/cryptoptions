## Goal
Replace the current `/dashboard` page with a closer 1:1 replica of Sensibull's `/home` layout, adapted to CryptOptions (BTC/ETH, Delta Exchange India). No backend changes.

## Layout (top → bottom)

```text
┌─────────────────────────────────────────────────────────────┐
│ Welcome to CRYPTOPTIONS                  [Connect broker ▸] │
│ India's first crypto option trading terminal                 │
└─────────────────────────────────────────────────────────────┘

┌──────── Primary actions card (white/elevated, 3×2 grid) ────┐
│ [icon] Easiest way to    [icon] Get ready-made   [icon] ... │
│        trade options            strategies                  │
│        copy                     copy                        │
│        [Easy options]           [Strategy wizard]   [...]   │
│ ─────────────────────────────────────────────────────────── │
│ [icon] Practice Trade    [icon] BTC/ETH Heatmap  [icon] #Ve │
│        / Drafts                  copy                       │
│        [Practice Trade]          [Heatmap]          [Share] │
└─────────────────────────────────────────────────────────────┘

┌──────── Advanced tools (single elevated card) ──────────────┐
│ Tools to guess the direction                                │
│  ┌─ thumbnail ─┐ Option chain      ┌─ thumb ─┐ OI analysis  │
│  ┌─ thumb ─┐ Multi-strike OI       ┌─ thumb ─┐ Whale Flow   │
│  ┌─ thumb ─┐ Multi Straddle Charts ┌─ thumb ─┐ Live Options │
│  ┌─ thumb ─┐ Crypto data                                    │
│                                                             │
│ Find great trades                                           │
│  ┌─ thumb ─┐ Screener              ┌─ thumb ─┐ Tech signals │
│                                                             │
│ Others                                                      │
│  ┌─ thumb ─┐ IV chart              ┌─ thumb ─┐ Events cal.  │
└─────────────────────────────────────────────────────────────┘
```

## Key differences from current Dashboard
- Drop the "live traders carousel" and the gradient "Mindful Trading" side promo — Sensibull's home doesn't have them. Keeps the page focused like the source.
- Wrap the 6 primary actions in **one** elevated card with internal dividers (Sensibull style), not separate cards in a side-by-side grid with a promo.
- Wrap **Advanced tools / Find great trades / Others** in **one** elevated card with section sub-headings (matches Sensibull).
- Each advanced-tool item becomes a horizontal row: small thumbnail (mock SVG) on the left, title + description on the right — same pattern as Sensibull's screenshot mockups.
- Header reads "Welcome to CRYPTOPTIONS / India's first crypto option trading terminal" with a top-right "Connect broker" button (links to Delta Exchange settings placeholder, currently `/pricing` or `#`).
- Light, neutral background (`bg-muted/30`) with `bg-card` elevated panels — matches Sensibull's flat clean look while still respecting our dark/light theme tokens.

## Adaptations (crypto-specific labels)
- "NIFTY Heatmap" → **BTC/ETH Heatmap**
- "FII DII data" → **Whale Flow data** (on-chain large-wallet flow)
- "Stock data" → **Crypto data**
- "#VerifiedBySensibull" → **#VerifiedByCryptOptions**
- Routes map to existing pages: `/strategy-builder`, `/paper-trading`, `/oi-analysis`, `/option-chain`, `/positions`. Items without a matching page link to `#` for now.

## Technical notes
- Rewrite `src/pages/Dashboard.tsx` only. Reuse `Navbar`, `Footer`.
- New small file `src/components/dashboard/ToolThumb.tsx` — renders a 64×64 inline SVG mock per tool (option chain table, OI bars, heatmap squares, line chart, etc.) so we don't need image assets.
- Two presentational sub-components inside `Dashboard.tsx`:
  - `<PrimaryTile icon title desc cta to />`
  - `<ToolRow thumb title desc to />`
- All styling via existing semantic tokens (`bg-card`, `border-border`, `text-muted-foreground`, `bg-gradient-primary`, `shadow-card`). No raw colors.
- Fully responsive: 1 col (mobile) → 2 col (md) → 3 col (lg) for primary tiles; 1 → 2 col for advanced tool rows.

## Out of scope
- No backend, schema, auth, or routing changes (route `/dashboard` already exists and is protected).
- No new dependencies.
- No landing page changes.
