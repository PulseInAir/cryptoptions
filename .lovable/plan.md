## Problem

After Google login, the user is redirected to the landing page (`/`) instead of the dashboard.

**Root cause:** in `src/contexts/AuthContext.tsx`, `signInGoogle` sets `redirect_uri: ${window.location.origin}/`. Google OAuth returns the user to `/` (landing), not `/dashboard`. The `useEffect` in `Auth.tsx` that pushes to `/dashboard` never runs because the user never lands back on `/auth`.

The same issue exists in `signUpEmail` (`emailRedirectTo: ${window.location.origin}/`) for email-confirmation flows.

## Fix

1. **`src/contexts/AuthContext.tsx`**
   - `signInGoogle`: change `redirect_uri` to `${window.location.origin}/dashboard`.
   - `signUpEmail`: change `emailRedirectTo` to `${window.location.origin}/dashboard`.

2. **`src/pages/Index.tsx` (landing)** — defensive guard so a logged-in user who somehow lands on `/` is forwarded to `/dashboard`:
   - Read `useAuth()`; if `user && !loading`, `navigate('/dashboard', { replace: true })` from a `useEffect`.
   - This also makes the Navbar's logo click behave naturally for logged-out users (lands on marketing) while logged-in users always end up in the app.

3. **`src/pages/Auth.tsx`** — already redirects to `/dashboard` when `user` becomes truthy; no change needed beyond confirming behavior after fix #1.

## Out of scope

- No changes to dashboard content, auth UI, or backend/RLS.
- No new routes.

## Verification

- Email login → lands on `/dashboard`.
- Google login → returns to `/dashboard` directly.
- Logged-in user visiting `/` → auto-redirects to `/dashboard`.
- Logged-out user visiting `/` → sees landing page as today.
