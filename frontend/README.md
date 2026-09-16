# English Coach \u2014 Frontend

Frontend-only React (Vite) build covering every feature module from the feature plan:
vocabulary, grammar, Bangladeshi curriculum (SSC/HSC), IELTS/SAT/PTE exam prep, AI-scored
speaking test UI, progress/gamification, community, live exam rooms, and pricing/payment UI
(bKash/Nagad/card). All screens call stub API functions in `src/api/*` shaped to match a
real backend \u2014 point `VITE_API_URL` at your Node/Express API and they'll work as-is.

## Run it

```
npm install
npm run dev
```

## Structure

- `src/context/AuthContext.jsx` \u2014 auth state (login/register/guest/logout)
- `src/components/` \u2014 Layout (nav rail + topbar), RequireTier (tier gating), Icon
- `src/api/` \u2014 one file per backend resource (auth, vocab, grammar, curriculum, exams,
  speaking, community, liveRooms, gamification, payments, socket, client)
- `src/pages/` \u2014 one page per nav item, plus Login and Profile

Admin panel and real-time Socket.io wiring for live rooms/chat are not included \u2014 this
covers the learner-facing frontend only, as requested.
