# Social Circle -- Frontend Technical Specification

## Part 1: Foundation -- Executive Summary, Feature Breakdown, User Journeys, Information Architecture

> **Document Series:** This is Part 1 of 6.
>
> - Part 1 (this file): Executive Summary / Feature Breakdown / User Journeys / Information Architecture
> - Part 2: Screen Inventory / Every Screen Specification
> - Part 3: Frontend Architecture / Routing / State Management / Component Library / UI Design System
> - Part 4: Mock Backend / Data Models / API Contract / Authentication / Notifications
> - Part 5: Forms / Search / Performance / Accessibility / SEO / Security / Error Handling
> - Part 6: Project Structure / Dev Standards / Dev Phases / Sprint Planning / Risks / Final Checklist

---

# Section 1 -- Executive Summary

## 1.1 Project Goal

Social Circle is an enterprise-grade, multi-panel community platform that enables people to discover, create, and actively participate in interest-based clubs -- spanning sports, hobbies, professional networks, social causes, and alumni groups. The platform provides every club with the full toolkit of a mini social network: a branded landing page, real-time WhatsApp-style group chat, event scheduling, media albums, and a payment engine for monetised communities.

## 1.2 Target Audience

This frontend serves two audiences only. Club onboarding/creation, event creation, and all club/member/chat moderation tooling are handled by a separately-built Admin Dashboard product and are not part of this app.

| Persona         | Description                                                                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Member / User   | Joins clubs matching their interests. Needs discovery, seamless joining (free or paid), chat participation, RSVP, media, and — if they own a club — light edit/cancel control over that club's events. |
| Guest / Visitor | Not yet registered. Needs to browse public club landing pages, see a preview of content, and be converted to a signed-up member.                                                                       |

## 1.3 Business Objectives

1. Let club organisers launch a live, paid, chat-enabled community via the separate Admin Dashboard's onboarding tools -- this frontend is not involved in club creation.
2. Monetise communities through a flexible model: free clubs (open communities) and paid clubs (subscription / one-time joining fee / event tickets), set up via the Admin Dashboard and consumed here.
3. Drive member engagement via real-time chat, polls, media albums, event RSVPs, and push notifications.
4. Give club owners and the platform team full visibility and control -- users, clubs, content moderation, revenue, and reporting -- from the separately-built Admin Dashboard (out of scope for this frontend).
5. Build trust through verified payments, transaction transparency, and reliable transactional email.

## 1.4 Success Metrics

| Metric                          | Target (6 months post-launch)                                |
| ------------------------------- | ------------------------------------------------------------ |
| Club creation to live approval  | < 24 hours median                                            |
| Onboarding completion rate      | > 70% of signups complete profile setup                      |
| Member retention (D30)          | > 40% of joined members still active                         |
| Paid club conversion            | > 15% of clubs opt into paid tier                            |
| Chat engagement                 | > 60% of members send at least 1 message/week in their clubs |
| Payment success rate            | > 95% (gateway-level)                                        |
| Admin response time (approvals) | < 4 hours during business hours                              |
| Page load (LCP)                 | < 2.5 s on 4G connection                                     |
| Accessibility                   | WCAG 2.1 AA compliance across all screens                    |

## 1.5 Application Scope

### In Scope

- Responsive web application (desktop-first, fully mobile-responsive)
- Club landing page, rendered from data authored via the Admin Dashboard
- Club internal dashboard (Chat, Events, Albums, Members, About, Payments tabs)
- User onboarding, discovery feed, My Clubs, notifications, profile, settings
- WhatsApp-style group chat + 1:1 direct messages
- Events & Meetings (view, RSVP, ticketing, calendar export; the member who owns an event's club can edit/cancel that event)
- Media albums (upload, gallery, per-event auto-album)
- Payment flows (joining fee, subscriptions, event tickets) -- mock gateway in Phase 1
- In-app notification centre + push notifications (mock in Phase 1)
- SMTP-based transactional emails (mock templates in Phase 1)
- Lightweight, API-driven conditional UI (e.g. showing Edit/Cancel Event actions only to the member who owns that event's club) -- no role-based route guards, no separate role-specific journeys or screens

### Out of Scope

- **Admin Dashboard** -- already built separately; not part of this frontend project. It owns:
  - Club creation / onboarding
  - Event creation
  - Club settings editing
  - Member management (approve / promote / remove / block)
  - Chat moderation (delete-any-message, pin management, admins-only mode)
  - Album upload-approval queues
  - Platform-wide reporting & analytics
- Native mobile apps (iOS/Android) -- web only
- Live video/audio streaming inside chat
- AI-powered club recommendations (beyond interest-tag matching)
- Multi-currency / multi-language (English only for v1; i18n scaffolding included)
- Third-party integrations beyond payment gateway and SMTP
- Marketplace / e-commerce features beyond club/event payments
- White-label or multi-tenant mode

## 1.6 Assumptions

1. **Backend APIs are not yet built.** All data is served from local mock JSON files via a mock service layer. The abstraction layer is designed so that replacing mocks with real API calls requires only changing the service implementation, not the component layer.
2. **Authentication is simulated** using mock JWT tokens stored in `localStorage`. Token refresh is simulated with a timer.
3. **Payment gateway is mocked.** A mock checkout UI is implemented; no real gateway SDK is loaded in development.
4. **Real-time chat is mocked** with polling or a local event emitter. WebSocket (Socket.io) integration is scaffolded but disabled.
5. **Push notifications** are simulated via the in-app notification centre. Browser Push API integration is scaffolded.
6. **SMTP email** sending is logged to console in development; no emails are dispatched.
7. The platform is single-language (English) for v1. All string literals are extracted to a `locales/en.ts` constants file for future i18n.
8. Images/media use placeholder URLs (e.g., Unsplash, picsum.photos) in mock data.
9. All monetary values in mock data use INR as default currency unless otherwise specified.
10. The application targets modern evergreen browsers (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+).

## 1.7 Dependencies

| Dependency            | Type                  | Notes                                                           |
| --------------------- | --------------------- | --------------------------------------------------------------- |
| React 19              | Core framework        | Use new features: `use()` hook, Server Components if applicable |
| TypeScript 5.4+       | Type safety           | Strict mode enabled                                             |
| Vite 5+               | Build tool            | Fast HMR, optimised prod build                                  |
| Tailwind CSS 3.4+     | Styling               | JIT mode, custom design tokens                                  |
| Zustand 4+            | Client state          | Slices pattern                                                  |
| TanStack Query v5     | Server state          | Stale-while-revalidate, optimistic updates                      |
| React Router v7       | Routing               | File-based routing optional, nested layouts                     |
| Shadcn UI             | Component primitives  | Built on Radix UI                                               |
| Radix UI              | Accessible primitives | Headless, composable                                            |
| Framer Motion         | Animations            | Layout animations, page transitions                             |
| React Hook Form + Zod | Forms + validation    | Schema-driven validation                                        |
| Axios                 | HTTP client           | Interceptors for auth token injection                           |
| date-fns              | Date utilities        | Formatting, parsing, timezone helpers                           |
| clsx + tailwind-merge | Class utilities       | Conditional classes without conflicts                           |
| Lucide Icons          | Icon library          | Consistent, accessible SVG icons                                |
| ESLint + Prettier     | Code quality          | Enforced via pre-commit hooks                                   |

## 1.8 Constraints

1. **No real backend** -- all data interactions use the mock service layer.
2. **No SSR** -- this is a pure SPA. SEO for public pages (club landing pages, discovery) is addressed via `react-helmet-async` for meta tags and a static pre-render strategy (Vite SSG plugin) for public routes only.
3. **Bundle size target** -- initial JS bundle < 150 KB gzip; route-level code splitting for all pages.
4. **No IE support** -- all modern browser targets only.
5. **Accessibility** -- WCAG 2.1 AA is a hard requirement, not a nice-to-have.

---

# Section 2 -- Complete Feature Breakdown

## 2.1 Feature Index

| #    | Feature                                                                                     | Module        | Priority | Status       |
| ---- | ------------------------------------------------------------------------------------------- | ------------- | -------- | ------------ |
| F-01 | User Registration & Onboarding                                                              | Auth          | P0       | Required     |
| F-02 | Login / Logout                                                                              | Auth          | P0       | Required     |
| F-03 | Social Login (Google / Apple / Facebook)                                                    | Auth          | P1       | Required     |
| F-04 | OTP Verification                                                                            | Auth          | P0       | Required     |
| F-05 | Forgot Password                                                                             | Auth          | P1       | Required     |
| F-06 | Profile Setup Wizard                                                                        | Onboarding    | P0       | Required     |
| F-07 | Club Discovery / Home Feed                                                                  | Discovery     | P0       | Required     |
| F-08 | Global Search                                                                               | Discovery     | P1       | Required     |
| F-09 | Club Landing Page (public)                                                                  | Clubs         | P0       | Required     |
| F-11 | Club Branding Display (logo, banner, colour) -- authored via Admin Dashboard, rendered here | Clubs         | P0       | Required     |
| F-12 | Club Landing Page (auto-generated from Admin-Dashboard-authored data)                       | Clubs         | P0       | Required     |
| F-13 | Membership: Free Join                                                                       | Clubs         | P0       | Required     |
| F-14 | Membership: Paid Join (checkout)                                                            | Payments      | P0       | Required     |
| F-15 | Club Internal Dashboard (tabs)                                                              | Clubs         | P0       | Required     |
| F-16 | Group Chat                                                                                  | Chat          | P0       | Required     |
| F-17 | 1:1 Direct Messages                                                                         | Chat          | P1       | Required     |
| F-18 | Chat: Media Sharing                                                                         | Chat          | P1       | Required     |
| F-19 | Chat: Polls                                                                                 | Chat          | P1       | Required     |
| F-20 | Chat: Reactions & @Mentions                                                                 | Chat          | P1       | Required     |
| F-22 | Event Viewing & Owner Edit/Cancel                                                           | Events        | P0       | Required     |
| F-23 | Event Detail & RSVP                                                                         | Events        | P0       | Required     |
| F-24 | Event Ticketing (paid)                                                                      | Events        | P1       | Required     |
| F-25 | Calendar Export (.ics)                                                                      | Events        | P2       | Nice-to-have |
| F-26 | Attendee List (view only)                                                                   | Events        | P2       | Nice-to-have |
| F-27 | Album / Media Gallery                                                                       | Albums        | P0       | Required     |
| F-28 | Upload Media (photo / video)                                                                | Albums        | P0       | Required     |
| F-29 | Album: Like / Comment                                                                       | Albums        | P1       | Required     |
| F-30 | Notification Centre (in-app)                                                                | Notifications | P0       | Required     |
| F-31 | Push Notifications                                                                          | Notifications | P1       | Required     |
| F-32 | Transactional Emails                                                                        | Notifications | P1       | Required     |
| F-33 | My Clubs Dashboard                                                                          | User Panel    | P0       | Required     |
| F-34 | User Profile & Edit                                                                         | User Panel    | P0       | Required     |
| F-35 | Settings (notifications, privacy)                                                           | User Panel    | P1       | Required     |
| F-36 | Subscription Management                                                                     | Payments      | P0       | Required     |
| F-37 | Payment Checkout Flow                                                                       | Payments      | P0       | Required     |
| F-38 | Payment Invoice / Receipt                                                                   | Payments      | P1       | Required     |
| F-39 | Guest Action-Gating Pattern                                                                 | Discovery     | P0       | Required     |
| F-40 | Public Event Detail View                                                                    | Events        | P0       | Required     |
| F-48 | Dark Mode                                                                                   | UI            | P2       | Nice-to-have |
| F-49 | Internationalisation (scaffolding)                                                          | i18n          | P2       | Nice-to-have |
| F-50 | Offline Indicator & Message Queue                                                           | Chat          | P2       | Nice-to-have |

---

## 2.2 Feature Details

### F-01 -- User Registration & Onboarding

**Purpose:** Allow new visitors to create a Social Circle account and set up their profile.

**Priority:** P0 -- Core. The application is useless without this.

**Dependencies:** F-04 (OTP), F-06 (Profile Setup), F-07 (Discovery Feed post-onboarding)

**User Value:** Converts a visitor to a member who can join clubs, participate in chat, and attend events.

**Acceptance Criteria:**

- User can register with email + password, or phone + OTP
- Email/phone uniqueness is validated before submission
- OTP is sent within 5 seconds (mock: pre-filled)
- After OTP verification, user is redirected to Profile Setup Wizard
- Profile setup is completable in < 2 minutes
- User cannot access member features until profile step 1 (name + photo) is complete

**Future Enhancements:** LinkedIn import for profile data; photo crop on upload; skill/profession tags.

---

### F-02 -- Login / Logout

**Purpose:** Authenticate an existing user and maintain a secure session.

**Priority:** P0

**Dependencies:** F-30 (notification badge restored on login)

**User Value:** Fast, reliable access to the user's clubs and content.

**Acceptance Criteria:**

- Email/password login with inline field-level validation
- "Remember me" keeps session persistent (7 days, mocked)
- Failed login shows error count; after 5 failures, account lock warning is shown
- Logout clears all auth tokens, query cache, and Zustand auth slice
- Redirect after login respects an optional `?next=` query param

**Future Enhancements:** Biometric login (WebAuthn); session management (view all active sessions).

---

### F-03 -- Social Login

**Purpose:** Allow one-click registration/login via Google, Apple, or Facebook.

**Priority:** P1

**Dependencies:** F-01, F-02

**User Value:** Reduces registration friction; converts more visitors.

**Acceptance Criteria:**

- Mock social login buttons on Login + Sign Up screens
- Mock flow: clicking "Continue with Google" simulates a successful OAuth callback
- On first social login, user is redirected to Profile Setup (interests/tags step only)
- On subsequent logins, user is redirected to Home Feed
- Social accounts can be linked/unlinked in Settings

**Future Enhancements:** Real OAuth 2.0 PKCE flow with provider SDKs.

---

### F-04 -- OTP Verification

**Purpose:** Verify phone/email ownership during registration and sensitive operations.

**Priority:** P0

**Dependencies:** F-01 (registration flow)

**User Value:** Adds account security and confirms real identity.

**Acceptance Criteria:**

- 6-digit OTP input with auto-advance between digits
- OTP auto-submits on last digit entry
- Resend OTP after 60-second cooldown (countdown timer displayed)
- Mock: OTP is always `123456` in dev; displayed as hint below the input
- OTP screen shows masked phone/email; "change" link goes back
- Error state if wrong OTP (max 3 attempts, then lock with 5-minute wait message)

**Future Enhancements:** TOTP / authenticator app support.

---

### F-05 -- Forgot Password

**Purpose:** Allow users who have forgotten their password to reset it via email/OTP.

**Priority:** P1

**Dependencies:** F-04 (OTP)

**User Value:** Reduces support tickets; prevents user churn.

**Acceptance Criteria:**

- User enters email or phone; receives OTP (mock)
- After OTP, user sets new password (with strength meter)
- Password must be min 8 chars, contain at least 1 uppercase, 1 number, 1 special character
- After reset, user is redirected to login with success toast

---

### F-06 -- Profile Setup Wizard

**Purpose:** Guided 2-step onboarding that collects profile essentials and interest tags.

**Priority:** P0

**Dependencies:** F-01 (flows directly after registration)

**User Value:** Enables personalised club recommendations; makes the user's profile meaningful to other members.

**Acceptance Criteria:**

- Step 1: Upload photo (optional but encouraged), full name (required), bio (optional, 160 chars)
- Step 2: Select interest categories (multi-select chips, min 1 required) and city/region
- Progress indicator (1/2 -> 2/2) shown at top
- "Skip for now" available on each step (except name)
- On completion, user lands on Discovery Feed with a welcome banner

**Future Enhancements:** LinkedIn profile import; skill tags; availability preference for events.

---

### F-07 -- Club Discovery / Home Feed (Public Landing Page)

**Purpose:** The app's homepage (`/`, via `/home`) -- public for everyone, and the primary discovery surface for recommended clubs and events. Works like a BookMyShow/Amazon homepage: real listings are visible before login; personalisation and joining/RSVP require an account.

**Priority:** P0

**Dependencies:** F-06 (interests used for recommendations when logged in), F-39 (action-gating), F-23 (event RSVP)

**User Value:** Lets guests evaluate the platform with real content before signing up; immediately surfaces relevant clubs and events to members; drives engagement and joining.

**Acceptance Criteria:**

- **No authentication required to view.** Guests see a generic/trending ranking; logged-in members see a personalised ranking based on interests + location (mock: hard-coded ranking either way).
- Header adapts to auth state: guest sees "Sign In" / "Join / Create Account" buttons; member sees search bar, notification bell, avatar menu.
- Hero banner (guest only, hidden once logged in): headline + subheadline + "Explore Clubs" / "Browse Events" CTAs.
- Stats strip (guest only): active clubs, members, events hosted -- social proof, mirrors reference site's value-proposition section.
- Category filter chips, Free/Paid toggle, and sort dropdown (Recommended / Newest / Most Members / Most Active) -- all usable without login.
- **Upcoming Events strip:** real `<EventCard>` grid (date, club, title, venue, time, price) pulled from the mock events API, with "View all events ->" linking to `/search?tab=events`.
- Club Grid: responsive grid of `<ClubCard>` components (unchanged layout), personalised if authenticated, generic/trending if guest.
- Infinite scroll (or Load More) with skeleton loaders during fetch. Empty state when no clubs match filters.
- Each club card: cover image, name, category badge, member count, free/paid badge, short tagline, Join CTA -- clicking Join while logged out triggers the F-39 auth gate (redirect to `/login?next=&intent=join`) instead of performing the join.
- "How It Works" steps (guest only, P2): Browse -> Sign Up -> Join/RSVP -> Connect.
- Testimonials, FAQ accordion, newsletter signup, footer (P2, guest only) -- marketing sections matching the reference site, lower priority than the real listings above.

**Future Enhancements:** AI-personalised feed; trending/viral clubs section; location-based map view.

---

### F-39 -- Guest Action-Gating Pattern

**Purpose:** A single, reusable way for any public page (home feed, search, club landing, public event page) to let a logged-out visitor look at everything but stop them at the moment they try to act.

**Priority:** P0

**Dependencies:** F-02 (Login), F-07/F-09/F-40 (the public pages that use it)

**User Value:** Visitors can freely explore before committing to sign up -- no dead-end login walls on pages that should be browsable; every gated CTA behaves identically, so the experience feels consistent.

**Acceptance Criteria:**

- A `useRequireAuth()` hook wraps any action that needs an account: Join Club, RSVP, Get Tickets / Buy, Message, Comment, Like.
- On click, if `authSlice.isAuthenticated` is false, the app navigates to `/login?next=<current-url>&intent=<action>` **instead of** performing the action or calling its mock API -- no request is attempted while logged out.
- The `intent` query param lets the Login/Sign Up page show a contextual message (e.g. "Sign in to join Weekend Hikers Club").
- After successful login/sign-up, the user is returned to the `next` URL (existing `?next=` redirect behaviour, reused rather than duplicated).
- If already authenticated, the action runs immediately with no redirect.

---

### F-09 -- Club Landing Page (Public)

**Purpose:** A publicly visible, SEO-friendly branded page for each club -- the primary conversion surface for potential members.

**Priority:** P0

**Dependencies:** F-11, F-12 (club data, authored via the Admin Dashboard, populates this page)

**User Value:** Guests and potential members can learn about a club before committing to join.

**Acceptance Criteria:**

- Accessible at `/clubs/:clubSlug` without authentication
- Sections: Hero (banner + logo + tagline + Join CTA), About, Highlights/Stats, Photo Gallery preview, Upcoming Events strip, Member avatars + count, FAQs, Social share
- Join button: free -> instant join (or approval pending if manual); paid -> opens pricing modal -> checkout
- If user is already a member, Join button becomes "View Club ->" that takes them to the internal dashboard
- Meta tags: title, description, OG image for social sharing
- Mobile: single-column layout, sticky Join CTA bar at bottom

---

> Club creation/onboarding (the multi-step setup that produces a club and its landing page data) happens entirely in the separately-built Admin Dashboard and is not documented in this series. This app only renders the resulting club landing page (F-09) once a club is live.

---

### F-16 -- Group Chat (WhatsApp-Style)

**Purpose:** Real-time messaging within a club -- the primary engagement mechanism.

**Priority:** P0

**Dependencies:** Real-time mock (polling / local emitter); F-18 (media), F-19 (polls)

**User Value:** Keeps members engaged day-to-day within their club.

**Acceptance Criteria:**

- Bubble UI: own messages right-aligned (blue), others left-aligned (grey) with avatar
- Sent / Delivered / Read tick icons (mock: always "sent" in dev)
- Reply-to (quote message), edit (own messages, within 15 min), delete for me / delete for everyone
- @mention (triggers notification for mentioned user)
- Emoji picker and emoji reactions on messages (long-press or hover)
- Pinned message bar at top of chat, read-only here (set via the Admin Dashboard; no in-app pin/unpin control)
- Media tab (accessible from chat header): shows all shared images/docs/links
- Search within chat (local search over mock messages)

---

### F-22 -- Event Viewing & Owner Edit/Cancel

**Purpose:** Members view and RSVP to events created via the Admin Dashboard; the member who owns an event's club can edit or cancel that event from this app.

**Priority:** P0

**Dependencies:** F-15 (club dashboard -- accessed from Events tab)

**User Value:** Keeps the community active around scheduled activities, with a light in-app touch-up path for the club owner without duplicating full event-authoring tooling here.

**Acceptance Criteria:**

- All members see the Events tab list and full Event Detail (title, description, cover image, date/time, location, capacity, RSVP deadline, ticket info) and can RSVP/buy tickets.
- The member who owns the event's club (`ClubMembership.role === 'owner'`) additionally sees **Edit Event** and **Cancel Event** actions on Event Detail.
- Edit Event opens a modal covering only: title, description, cover image, date & time, timezone, location, capacity, RSVP deadline. Ticket pricing/type/quantity, visibility, and recurrence are not editable from this app (set at creation time via the Admin Dashboard).
- Cancel Event asks for confirmation, then cancels the event and notifies attendees.
- Event creation itself is out of scope here -- handled entirely by the Admin Dashboard.

---

### F-40 -- Public Event Detail View

**Purpose:** A guest-safe, SEO-indexed event page reachable without logging in -- the event equivalent of F-09's public Club Landing Page.

**Priority:** P0

**Dependencies:** F-22 (event exists via Admin Dashboard creation; viewing/RSVP/owner edit-cancel happens here), F-39 (action-gating), F-09 (links back to the club landing page)

**User Value:** Lets a visitor evaluate a specific event (what, when, where, how much) before deciding to sign up, matching how BookMyShow/Amazon expose product/event detail pages pre-login.

**Acceptance Criteria:**

- Accessible at `/clubs/:slug/events/:eventId` without authentication, for events whose Visibility is `public` (per F-22).
- Shows: cover image, event title, date/time, venue (address or "Virtual"), organising club name + logo (links to `/clubs/:slug`), description, price (Free or amount), capacity/spots-left if applicable.
- RSVP / Get Tickets CTA: guest -> F-39 auth gate (`/login?next=&intent=rsvp` or `intent=buy`); logged-in member who has already RSVP'd/joined -> CTA becomes "View in Club Dashboard ->" deep link to the full event view (S-13) inside the club dashboard.
- Does **not** show attendee list, comments, or the owning member's Edit/Cancel Event controls -- those remain exclusive to the authenticated dashboard event view (S-13).
- Meta tags + `Event` JSON-LD schema for SEO (see Part 5 §21.4).

---

### F-27 -- Album / Media Gallery

**Purpose:** Per-club media storage -- event photos, general photos/videos organised in albums.

**Priority:** P0

**Dependencies:** F-22 (auto-album creation when event concludes)

**User Value:** Creates a lasting visual record of the community; drives engagement.

**Acceptance Criteria:**

- Albums list view: grid of album cover thumbnails with title, date, media count
- Album detail: masonry or uniform grid of media items
- Upload: drag-and-drop or file picker; multiple files at once; progress indicator per file
- Media item: click to open full-screen lightbox with left/right navigation
- Like (heart) + Comment on individual media items
- Download button (if club owner allows); Share button (copy link)
- Auto-album: created 24 hours after a concluded event; name pre-filled as event name

---

# Section 4 -- User Journeys

## 4.1 Journey: Guest User

```
[Visits app URL "/"]
        |
        v
[Home / Discovery Feed -- public, no login required]
  - Hero, real Upcoming Events strip, real Club Grid, filters/search all visible
        |
        +-- Browsing club cards
        |           |
        |           v
        |   [Club Landing Page -- /clubs/:slug]
        |           |
        |           +-- Clicks "Join Free" / "Buy Membership"
        |           |           |
        |           |           v
        |           |   [F-39 auth gate: /login?next=/clubs/:slug&intent=join]
        |           |           |
        |           |           v
        |           |   [Sign Up -> OTP -> Profile Setup (Step 1 -> 2)]
        |           |           |
        |           |           v
        |           |   [Redirected back to next -> Join/Checkout completes -> Club Internal Dashboard]
        |           |
        |           \-- (paid) same flow, adds Checkout step before Club Dashboard
        |
        +-- Browsing event cards
        |           |
        |           v
        |   [Public Event Detail -- /clubs/:slug/events/:eventId]
        |           |
        |           +-- Clicks "RSVP" / "Get Tickets"
        |                       |
        |                       v
        |           [F-39 auth gate: /login?next=<event-url>&intent=rsvp|buy]
        |                       |
        |                       v
        |           [Sign Up -> OTP -> Profile Setup -> (Checkout if paid) -> back to event, RSVP'd]
        |
        \-- Clicks "Log In" / "Sign In" (already has account)
                    |
                    v
            [Login Page -> back to "/" or ?next= target]
```

## 4.2 Journey: Registered Member (Returning User)

```
[Opens app / navigates to URL]
        |
        v
[Auto-login from stored token] --(expired)--> [Login Page]
        |
        v
[Home Feed / Discovery]
        |
        +-- [My Clubs sidebar] -> [Club Internal Dashboard]
        |           |
        |           +-- Chat tab -> send message / reply / react
        |           +-- Events tab -> view upcoming -> RSVP -> add to calendar
        |           |         (if this member owns the club: Edit Event / Cancel Event also available on Event Detail)
        |           +-- Albums tab -> browse -> like / comment -> upload
        |           +-- Members tab -> view profiles -> start 1:1 DM
        |           \-- Payments tab (paid clubs) -> view subscription -> renew / cancel
        |
        +-- [Notifications bell] -> [Notification Centre]
        |           \-- Click notification -> deep-link to relevant screen
        |
        \-- [Profile avatar] -> [User Profile]
                    +-- Edit Profile
                    +-- Settings -> Notification Preferences / Privacy
                    \-- Subscription Management
```

## 4.4 Journey: Admin

**Note:** The Admin Dashboard is built separately and is out of scope for this frontend project. It now also covers club/event creation and all club/member/chat moderation (previously partly documented here as separate owner/moderator journeys). The Admin journey is not documented in this series.

---

## 4.6 Journey: New User Onboarding

```
[Signs Up]
        |
        v
[OTP Verification] (email or phone)
        |
        v
[Profile Setup -- Step 1]
  - Upload photo
  - Enter full name (required)
  - Enter bio (optional)
        |
        v
[Profile Setup -- Step 2]
  - Select interest categories (chips -- at least 1 required)
  - Enter city / region
        |
        v
[Discovery Feed with welcome banner]
  "Welcome to Social Circle, {name}!
   Here are clubs matching your interests."
        |
        v
[User sees 6 recommended club cards]
        |
        v
[User joins first club] -> [Club Internal Dashboard]
```

## 4.7 Journey: Logout

```
[User clicks profile avatar or hamburger menu]
        |
        v
[Dropdown -> "Log Out"]
        |
        v
[Confirmation: "Are you sure you want to log out?"]
(if unsaved changes exist -- e.g. an in-progress Edit Event form -- warn first)
        |
        v
[Clear localStorage: authToken, refreshToken]
[Clear Zustand auth slice]
[Invalidate all TanStack Query cache]
        |
        v
[Redirect -> /login with ?loggedOut=true query param]
        |
        v
[Login page shows: "You have been logged out successfully." toast]
```

---

# Section 5 -- Information Architecture

## 5.1 Navigation Hierarchy

```
Social Circle
+-- Public Routes (no auth -- browsable by guests)
|   +-- / (redirects to /home)
|   +-- /home (Discovery Feed -- public, personalises when logged in)
|   +-- /search (Clubs & Events tabs public; People tab redirects to /login)
|   +-- /clubs/:slug (Club Landing Page)
|   +-- /clubs/:slug/events/:eventId (Public Event Detail -- RSVP/Buy gated via F-39)
|   +-- /login
|   +-- /signup
|   +-- /forgot-password
|   +-- /verify-otp
|   \-- /auth/callback (social login)
|
+-- Onboarding Routes (auth required, profile incomplete)
|   +-- /onboarding/profile (step 1)
|   \-- /onboarding/interests (step 2)
|
+-- Member Routes (auth + profile complete)
|   +-- /my-clubs
|   +-- /notifications
|   +-- /messages (DM inbox)
|   +-- /messages/:userId (1:1 DM thread)
|   +-- /profile/:userId
|   +-- /profile/edit
|   +-- /settings
|   +-- /settings/notifications
|   +-- /settings/privacy
|   +-- /settings/payments
|   +-- /subscriptions
|   +-- /checkout/:planId
|   +-- /checkout/success
|   +-- /checkout/failure
|   |
|   \-- /clubs/:slug/dashboard (Club Internal -- tabs)
|       +-- /clubs/:slug/dashboard/chat
|       +-- /clubs/:slug/dashboard/events
|       +-- /clubs/:slug/dashboard/events/:eventId (Edit/Cancel Event shown inline to the owning member)
|       +-- /clubs/:slug/dashboard/albums
|       +-- /clubs/:slug/dashboard/albums/:albumId
|       +-- /clubs/:slug/dashboard/members
|       +-- /clubs/:slug/dashboard/members/:userId
|       +-- /clubs/:slug/dashboard/about
|       \-- /clubs/:slug/dashboard/payments
|
\-- [Admin Routes -- out of scope, handled by the separately built Admin Dashboard, which also covers club/event creation, club settings, and all club/member/chat moderation]
```

## 5.2 Primary Navigation (Desktop -- Sidebar)

For the **Member** experience the primary nav is a left sidebar (collapsible on mobile to bottom tab bar):

| Icon    | Label         | Route          | Badge        |
| ------- | ------------- | -------------- | ------------ |
| Home    | Home          | /home          | --           |
| Compass | Discover      | /search        | --           |
| Groups  | My Clubs      | /my-clubs      | unread count |
| Bell    | Notifications | /notifications | unread count |
| Chat    | Messages      | /messages      | unread DMs   |
| User    | Profile       | /profile/:me   | --           |

## 5.3 Secondary Navigation

- **Club Internal Dashboard** -- horizontal tab bar below club hero (Chat / Events / Albums / Members / About / Payments)
- **Settings** -- left sub-nav tabs: Account / Notifications / Privacy / Payments

## 5.4 Footer (Public Pages)

```
Social Circle
(c) 2026 Social Circle. All rights reserved.

Links: About | Privacy Policy | Terms of Service | Contact | Help Centre
Social: Twitter | Instagram | LinkedIn
```

## 5.5 Mobile Navigation

On viewports < 768 px the left sidebar collapses into a **bottom tab bar** (5 items max):

| Tab           | Icon    | Route          |
| ------------- | ------- | -------------- |
| Home          | House   | /home          |
| Discover      | Compass | /search        |
| Clubs         | Users   | /my-clubs      |
| Notifications | Bell    | /notifications |
| Me            | User    | /profile/:me   |

- Secondary navigation within Club Dashboard becomes a horizontally scrollable tab strip.

## 5.6 Breadcrumb Strategy

- Not used in the member-facing app (back-arrow navigation is sufficient).
- If needed in future, breadcrumbs are generated from the route hierarchy using React Router's `useMatches()` hook.

## 5.7 Deep Links

All routes are deep-linkable. Key deep-link patterns:

| Scenario                     | URL                                                   |
| ---------------------------- | ----------------------------------------------------- |
| Specific club public page    | `/clubs/running-club-mumbai`                          |
| Club dashboard chat          | `/clubs/running-club-mumbai/dashboard/chat`           |
| Specific event               | `/clubs/running-club-mumbai/dashboard/events/evt_123` |
| Notification deep-link to DM | `/messages/usr_456`                                   |

Deep links that require authentication redirect to `/login?next=<encodedOriginalURL>` and after login, navigate to the original destination.

## 5.8 Profile Navigation

Accessible via avatar click in sidebar or top-right corner:

```
[Avatar]
  +-- View Profile
  +-- Edit Profile
  +-- My Subscriptions
  +-- Settings
  +-- Help Centre (external link)
  \-- Log Out
```

---

_End of Part 1. Continue with `spec-part2-screens.md` for the complete Screen Inventory and per-screen specifications._
