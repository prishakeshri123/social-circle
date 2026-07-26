Recommended Workflow

1. Create a CLAUDE.md in the project root

CLAUDE.md is auto-loaded into every new conversation — no need to paste context manually. Keep it short: pointers only, not full spec content.

# Social Circle — Frontend Project

React 19 + TypeScript + Vite + Tailwind + Zustand + TanStack Query + React Router v7

## Spec Documents (read these before coding)

All spec files are in: `spec/`

- spec-part1-foundation.md — PRD summary, features, user journeys
- spec-part2-screens.md — all 37 screens with full spec
- spec-part3-architecture.md — folder structure, routing, state, components, design system
- spec-part4-backend-mock.md — data models (TypeScript interfaces), API contract, auth
- spec-part5-quality.md — forms/Zod, search, performance, accessibility, security
- spec-part6-delivery.md — phases, sprint plan, constants spec (P1-A through P1-D)

## Key rules

- No magic values — all strings in `src/shared/constants/locales/en.ts`
- All routes in `src/shared/constants/routes.ts`
- All Zod schemas in `src/shared/utils/validators.ts`
- Admin Dashboard is OUT OF SCOPE (built separately) — covers club/event creation and all moderation tooling; this app is members-only except for owner Edit/Cancel Event
- Mock backend only — no real API calls

---

2. Yes — close this chat and start a new one for development

This chat is a spec/planning session. It has ~100k+ tokens of context that is irrelevant to coding. Starting fresh means:

- Cheaper per turn
- Faster responses
- Claude focuses only on what you give it

---

3. Which files to attach per phase

Only attach what that phase actually needs — not all 6 parts every time.

┌─────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase │ Attach these files │
├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 1 — Setup + Constants │ spec-part3-architecture.md (folder structure, design system), spec-part6-delivery.md §P1-A through §P1-D (the │
│ │ constants spec) │
├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 2 — Auth + Onboarding │ spec-part2-screens.md (S-01 to S-07), spec-part4-backend-mock.md (auth endpoints + User model), │
│ │ spec-part6-delivery.md (Phase 2 tasks) │
├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 3 — Discovery + │ spec-part2-screens.md (S-08 to S-10, S-37), spec-part4-backend-mock.md (Club model + endpoints), spec-part6-delivery.md │
│ Landing page │ (Phase 3 tasks) │
├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 4 — Club Dashboard │ spec-part2-screens.md (S-11 to S-19), spec-part4-backend-mock.md (Chat, Event, Album models), spec-part6-delivery.md │
│ │ (Phase 4 tasks) │
├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 5 — User Panel + │ spec-part2-screens.md (S-20 to S-33), spec-part4-backend-mock.md (Payment, Notification models), │
│ Payments │ spec-part6-delivery.md (Phase 5 tasks) │
├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 6 — QA + Polish │ spec-part5-quality.md (full file), spec-part6-delivery.md (Phase 6 + Final Checklist) │
└─────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

---

4. How to start a new implementation chat

Open a new Claude Code session in the social-circle project folder. The CLAUDE.md loads automatically. Then say something like:

▎ "Implement Phase 1 from spec-part6-delivery.md. Start with project scaffolding. Reference spec-part3-architecture.md for the folder structure and design
▎ system tokens."

That's all Claude needs. It reads the files directly — no copy-pasting.

---

Summary: Create CLAUDE.md now (I can write it for you), then close this chat. Each new implementation session: attach only the 1-2 spec files relevant to
that phase.
