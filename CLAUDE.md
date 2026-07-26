# Social Circle — Frontend Project

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · Zustand · TanStack Query · React Router v7  
Shadcn UI · Radix UI · Framer Motion · React Hook Form · Zod · Axios · date-fns · Lucide Icons

## Spec Documents

All in `spec/` — read the relevant file before starting any task.

| File                         | What it covers                                                                |
| ---------------------------- | ----------------------------------------------------------------------------- |
| `spec-part1-foundation.md`   | PRD summary, all features, user journeys, navigation IA                       |
| `spec-part2-screens.md`      | Every screen: layout, components, interactions, states, permissions           |
| `spec-part3-architecture.md` | Folder structure, routing, state management, component library, design system |
| `spec-part4-backend-mock.md` | TypeScript interfaces, mock API endpoints, auth flow, notifications           |
| `spec-part5-quality.md`      | Forms + Zod schemas, search, performance, accessibility, SEO, security        |
| `spec-part6-delivery.md`     | Phase tasks, sprint plan, constants spec (P1-A to P1-D), risks, checklist     |

## Hard Rules

- **No magic values** — every string in `src/shared/constants/locales/en.ts`
- **No hardcoded routes** — every path in `src/shared/constants/routes.ts`
- **No hardcoded numbers** — every limit/size/timing in `src/shared/constants/app.constants.ts`
- **No inline Zod** — all schemas in `src/shared/utils/validators.ts`
- **No default exports** — named exports only
- **No `any`** — use `unknown` + type narrowing
- **Admin Dashboard is OUT OF SCOPE** — already built separately; do not create admin routes/components, club-creation/event-creation screens, or club/member/chat moderation tooling. This app is members-only; the one exception is that the member who owns a club can Edit/Cancel that club's events

## Mock-only

Backend APIs do not exist yet. All data comes from `src/mock/`. Use `axios-mock-adapter`.  
Switching to real API later = delete `mockAdapter.ts` only. No component changes needed.

## Phase Reference

| Phase | Focus                                          | Key spec sections                                       |
| ----- | ---------------------------------------------- | ------------------------------------------------------- |
| 1     | Project setup + ALL constants                  | Part 3 §6.2, Part 6 §P1-A to §P1-D                      |
| 2     | Auth + Onboarding                              | Part 2 S-01 to S-07, Part 4 §16, Part 6 Phase 2         |
| 3     | Discovery + Landing page + Public event detail | Part 2 S-08 to S-10, S-37, Part 4 §10.2, Part 6 Phase 3 |
| 4     | Club dashboard (Chat, Events, Albums, Members) | Part 2 S-11 to S-19, Part 4 §10.4-10.6, Part 6 Phase 4  |
| 5     | User panel + Payments + Notifications          | Part 2 S-20 to S-33, Part 4 §10.7-10.8, Part 6 Phase 5  |
| 6     | QA, accessibility, performance polish          | Part 5 (full), Part 6 Phase 6 + §33 checklist           |

## Dev Credentials (mock)

| Account             | Email              | Password   | Notes                                                                   |
| ------------------- | ------------------ | ---------- | ----------------------------------------------------------------------- |
| Member              | member@example.com | Member@123 | Standard member                                                         |
| Member (club owner) | owner@example.com  | Owner@123  | Owns one seeded club — use to test the conditional Edit/Cancel Event UI |
