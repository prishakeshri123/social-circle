# API Reference for Backend Team

This document lists every API call the frontend currently makes against the mock backend (`axios-mock-adapter`, handlers in `src/mock/handlers/*.ts`), organized **page by page**, in the order a user encounters them in the app. Only pages with real, built UI are included — routes that currently render a placeholder screen are omitted entirely.

## Conventions used throughout this doc

- **Base URL**: all paths below are relative to `apiClient`'s baseURL, which is `import.meta.env.VITE_API_BASE_URL || '/api'` (`src/services/apiClient.ts`). So `GET /clubs` really means `GET {VITE_API_BASE_URL}/clubs`.
- **Endpoint constants**: every path string is centralized in `src/shared/constants/apiEndpoints.ts` (`API_ENDPOINTS`) — that file is the single source of truth for exact paths on the frontend side.
- **Auth header**: `apiClient` automatically attaches `Authorization: Bearer <accessToken>` to every request if a token is present in storage (no per-call opt-in). "Auth: required" below means the handler 401s without a valid token; "Auth: none" means the endpoint works with or without one; "Auth: optional — personalizes response" means it works either way but the response shape/content changes if authenticated.
- **Standard error shape**: `{ "code": string, "message": string }` (types `ApiErrorBody` / `ApiErrorResponse`).
- **Standard list wrapper** (non-paginated): `{ "data": T[] }`.
- **Standard paginated wrapper**: `PaginatedResponse<T> = { "data": T[], "meta": { "total": number, "page": number, "limit": number, "totalPages": number, "hasNextPage": boolean, "hasPreviousPage": boolean } }`.
- **Token minting**: on any successful login-type response, the frontend stores `accessToken`/`refreshToken` client-side and attaches the Bearer header on all subsequent calls. The mock's tokens are just strings shaped `mock.access.token.<userId>` — **a real backend must issue real JWTs**; this is a stub to replace, not a contract to replicate.
- A **"Reusing existing API"** note means the endpoint is already fully documented earlier in this file — only trigger/param/response _differences_ are called out, not the full contract again.

---

# Section 1: Public Pages (Not Logged In)

## Page: Home (`/`)

Renders two different experiences depending on whether the visitor is logged in.

### Guest (logged-out) view

**1. List Clubs** — `GET /clubs`

- Purpose: populate the "Explore Top Communities" carousel.
- Called from: `src/features/discovery/pages/HomePage.tsx` → `useClubsFeed()` (`src/features/discovery/hooks/useClubsFeed.ts`) → `clubService.list()` (`src/features/clubs/services/clubService.ts`)
- Trigger: on page load
- Auth: none
- Request Payload (query params):
  ```ts
  { type?: 'free' | 'paid'; sort?: string; page: number; limit: number }
  ```
  Example sent by Home: `{ sort: "recommended", page: 1, limit: 12 }`
- Response Payload: `PaginatedResponse<Club>`
  ```json
  {
    "data": [
      {
        "id": "clu_bizpromo01",
        "slug": "business-promotion",
        "name": "Business Promotion",
        "tagline": "Helping businesses reach their audience and hit their marketing goals.",
        "category": "business-promotion",
        "tags": ["marketing", "branding", "advertising"],
        "city": "Dubai",
        "language": "en",
        "privacy": "public",
        "status": "live",
        "type": "paid",
        "ownerId": "usr_owner01",
        "memberCount": 410,
        "logoUrl": "https://picsum.photos/seed/business-promotion-logo/200/200",
        "bannerUrl": "https://picsum.photos/seed/business-promotion-banner/1200/675",
        "brandColor": "#f97316",
        "galleryImages": ["https://picsum.photos/seed/business-promotion-1/600/600"],
        "about": "We are specialized in assisting businesses...",
        "mission": "...",
        "codeOfConduct": "...",
        "highlights": ["Monthly promotion clinics", "410+ members", "Shared marketing playbooks"],
        "faqs": [{ "question": "Is this only for marketers?", "answer": "No — founders..." }],
        "membershipApproval": "auto",
        "featured": false,
        "pricingPlans": [
          {
            "id": "plan_bizpromo_monthly",
            "name": "Monthly",
            "price": 999,
            "billingCycle": "monthly"
          }
        ],
        "createdAt": "2026-01-01T09:00:00.000Z",
        "updatedAt": "2026-07-20T09:00:00.000Z"
      }
    ],
    "meta": {
      "total": 42,
      "page": 1,
      "limit": 12,
      "totalPages": 4,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
  ```
  Note: `pricingPlans` only present on `type: "paid"` clubs. Server filters to `status === "live"` only.
- Errors: none defined (always 200, possibly empty `data`).

**2. List Events** — `GET /events`

- Purpose: populate the "Upcoming Events" strip.
- Called from: `src/features/discovery/components/UpcomingEventsStrip.tsx` → `useEventsFeed()` → `eventService.list()`
- Trigger: on page load
- Auth: optional — `currentUserRsvp` is filled from the bearer token if present, else `null`
- Request Payload (query params):
  ```ts
  { clubId?: string; upcoming?: boolean; status?: 'upcoming'|'past'|'cancelled'; search?: string; page?: number; limit?: number }
  ```
  Example: `{ upcoming: true, limit: 8 }`
- Response Payload: `PaginatedResponse<EventWithClub>`
  ```json
  {
    "data": [
      {
        "id": "evt_001",
        "clubId": "clu_bizpromo01",
        "creatorId": "usr_owner01",
        "type": "event",
        "title": "Promotion Weekend Meetup",
        "description": "<p>Join fellow Business Promotion members...</p>",
        "coverImageUrl": "https://picsum.photos/seed/evt_001/800/450",
        "startAt": "2026-08-02T00:30:00.000Z",
        "endAt": "2026-08-02T02:30:00.000Z",
        "timezone": "Asia/Dubai",
        "recurrence": "one_time",
        "locationType": "physical",
        "physicalAddress": "Dubai World Trade Centre, Dubai",
        "capacity": 60,
        "ticketType": "free",
        "visibility": "public",
        "status": "published",
        "rsvpCounts": { "going": 10, "interested": 4, "not_going": 0 },
        "currentUserRsvp": null,
        "createdAt": "2026-06-26T03:30:00.000Z",
        "updatedAt": "2026-06-26T03:30:00.000Z",
        "club": {
          "id": "clu_bizpromo01",
          "slug": "business-promotion",
          "name": "Business Promotion",
          "category": "business-promotion",
          "logoUrl": "https://picsum.photos/seed/business-promotion-logo/200/200"
        }
      }
    ],
    "meta": {
      "total": 8,
      "page": 1,
      "limit": 8,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
  ```
  Server only returns events where `visibility === 'public' || 'all_members'`.
- Errors: none defined.

### Member (logged-in) view

All calls below fire in parallel on page load — this is the dashboard a returning member sees at `/`.

**3. My Clubs** — `GET /me/clubs`

- Purpose: list clubs the current user actively belongs to (stat tiles, "Continue your Communities" cards).
- Called from: `src/features/clubs/hooks/useMyClubs.ts` → `clubService.myClubs()`
- Trigger: on page load
- Auth: required — `401 { "code": "UNAUTHORIZED", "message": "..." }` if no token
- Request Payload: none
- Response Payload: `{ "data": MyClub[] }` where `MyClub` = `Club` (see #1) + `{ "myRole": "owner" | "member" }`. Only clubs with `status === "active"` membership are returned.

**4. My Conversations (unread count)** — `GET /me/conversations`

- Purpose: chat unread badge in dashboard header.
- Called from: `src/features/chat/hooks/useConversations.ts` → `chatService.myConversations()`
- Trigger: on page load, then polled every 30,000ms (`NOTIFICATION_POLL_MS`) while authenticated
- Auth: required — `401` without token
- Request Payload: none
- Response Payload: `{ "data": ConversationSummary[] }`
  ```json
  {
    "data": [
      {
        "channelId": "ch_bp_general",
        "kind": "group",
        "clubId": "clu_bizpromo01",
        "clubSlug": "business-promotion",
        "clubName": "Business Promotion",
        "clubLogoUrl": "https://picsum.photos/seed/business-promotion-logo/200/200",
        "channelName": "general",
        "lastMessage": {
          "preview": "Welcome to...",
          "senderId": "usr_owner01",
          "isMine": false,
          "sentAt": "2026-07-25T02:00:00.000Z"
        },
        "unreadCount": 0
      },
      {
        "channelId": "ch_dm_mod_member01",
        "kind": "direct",
        "otherUser": {
          "id": "usr_mod01",
          "fullName": "Arjun Mehta",
          "avatarUrl": "https://picsum.photos/seed/usr-mod01/200/200",
          "isOnline": true
        },
        "lastMessage": {
          "preview": "See you Saturday!",
          "senderId": "usr_mod01",
          "isMine": false,
          "sentAt": "2026-08-01T10:00:00.000Z"
        },
        "unreadCount": 2
      }
    ]
  }
  ```

**5. My Notifications (unread count)** — `GET /me/notifications`

- Purpose: notifications badge.
- Called from: `src/features/notifications/hooks/useNotifications.ts` → `notificationService.list({ limit })`
- Trigger: on page load
- Auth: intended to require auth, but the mock handler currently returns `{ "data": [] }` for a missing/invalid token instead of `401` — **flagged as an inconsistency below**.
- Request Payload (query): `{ limit?: number }` (defaults server-side to 20 if omitted)
- Response Payload: `{ "data": Notification[] }`
  ```json
  {
    "data": [
      {
        "id": "ntf_001",
        "userId": "usr_member01",
        "type": "event_reminder_24h",
        "title": "Reminder",
        "body": "Reminder: \"Circle Weekend Meetup\" is happening tomorrow at 6:00 AM.",
        "deepLink": "/clubs/bengaluru-tech-circle/dashboard/events/evt_006",
        "read": false,
        "createdAt": "2026-07-31T08:00:00.000Z"
      }
    ]
  }
  ```
  `type` is one of: `club_joined | event_created | event_reminder_24h | event_reminder_1h | event_rsvp | event_cancelled | event_updated | chat_mention | payment_success | payment_failed | subscription_renewal | subscription_expiry | system`.

**6. My Invitations (pending count)** — `GET /me/invitations`

- Purpose: pending-invitations badge.
- Called from: `src/features/clubs/hooks/useInvitations.ts` → `invitationService.myInvitations()`
- Trigger: on page load
- Auth: same inconsistency as #5 — returns `{ "data": [] }` instead of `401` when unauthenticated.
- Request Payload: none
- Response Payload: `{ "data": ClubInvitationWithClub[] }`, already filtered to `status === "pending"` and sorted newest-first
  ```json
  {
    "data": [
      {
        "id": "inv_001",
        "clubId": "clu_bizpromo01",
        "invitedUserId": "usr_member01",
        "invitedByUserId": "usr_member06",
        "status": "pending",
        "createdAt": "2026-07-28T10:00:00.000Z",
        "club": {
          "id": "clu_bizpromo01",
          "slug": "business-promotion",
          "name": "Business Promotion",
          "logoUrl": "https://picsum.photos/seed/business-promotion-logo/200/200"
        },
        "invitedBy": {
          "id": "usr_member06",
          "fullName": "Rahul Nair",
          "avatarUrl": "https://picsum.photos/seed/usr-member06/200/200"
        }
      }
    ]
  }
  ```

**7. My Upcoming Events**
[Reusing existing API — `GET /events`, already documented above.] Difference: called with `{ upcoming: true, limit: 50 }`, then filtered client-side to events whose `clubId` is in the `/me/clubs` result (there is no server-side "my events" filter — flagged below).

**8. Recent Club Albums** — `GET /clubs/:clubId/albums`

- Purpose: "recent photos" preview on each club card in "Continue your Communities".
- Called from: `src/features/albums/hooks/useMyRecentAlbums.ts` → `albumService.listByClub(clubId, limit)`, fired once per club the user belongs to (parallel requests, after `/me/clubs` resolves)
- Trigger: on page load
- Auth: none enforced by this handler (frontend only calls it for the user's own clubs)
- Request Payload (query): `{ limit?: number }`, e.g. `{ limit: 20 }`
- Response Payload: `PaginatedResponse<Album>`
  ```json
  {
    "data": [
      {
        "id": "alb_annualmeet",
        "clubId": "clu_userswell01",
        "eventId": "evt_040",
        "title": "Annual Meetup Photos",
        "description": "Highlights from our 2026 Annual Meetup...",
        "coverUrl": "https://picsum.photos/seed/alb-annualmeet-cover/600/450",
        "mediaCount": 5,
        "visibility": "members_only",
        "allowMemberUploads": true,
        "createdById": "usr_owner01",
        "createdAt": "2026-07-12T08:00:00.000Z"
      }
    ],
    "meta": {
      "total": 5,
      "page": 1,
      "limit": 20,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
  ```

---

## Page: About (`/about`)

**1. Get About Page Content** — `GET /content/about`

- Purpose: hero copy, stats, mission, story timeline, and values content for the page.
- Called from: `src/features/discovery/pages/AboutPage.tsx` → `useAboutContent()` (`src/features/discovery/hooks/useContent.ts`) → `contentService.getAbout()`
- Trigger: on page load
- Auth: none
- Request Payload: none
- Response Payload: `{ "data": AboutContent }`
  ```json
  {
    "data": {
      "pageTitle": "About Us",
      "metaDescription": "Social Circle helps people find their community...",
      "heroEyebrow": "About Us",
      "heroTitleLine1": "Building Connections.",
      "heroTitleLine2Prefix": "Creating ",
      "heroTitleHighlight": "Communities.",
      "heroSubtitle": "Social Circle is an all-in-one platform designed to help people discover clubs...",
      "heroHighlight": "A place for real community",
      "heroCardSubtitle": "Meet people, join events, and grow together.",
      "stats": [{ "icon": "Users", "value": "12,458+", "label": "Active Members" }],
      "missionEyebrow": "Our Mission",
      "missionTitle": "Empowering Communities Around the World",
      "missionBody": "We believe communities have the power to transform lives...",
      "missionFeatures": [
        { "icon": "Users", "title": "Connect People", "body": "Bring like-minded people together." }
      ],
      "storyEyebrow": "Our Story",
      "storyTitle": "How It All Started",
      "storyBody": [
        "Social Circle began as a spreadsheet three friends used to track the clubs they'd joined..."
      ],
      "storyTimeline": [
        {
          "year": "2020",
          "icon": "PenLine",
          "title": "The Idea",
          "body": "A small idea to help people connect through shared interests."
        }
      ],
      "valuesEyebrow": "Our Values",
      "valuesTitle": "What Drives Us",
      "values": [
        {
          "icon": "Users",
          "title": "Community First",
          "body": "We put communities and their needs at the heart of everything we do."
        }
      ],
      "ctaTitle": "Be Part of Something Bigger",
      "ctaSubtitle": "Join a community, create your own club, and start making meaningful connections today.",
      "ctaPrimaryCta": "Explore Clubs",
      "ctaSecondaryCta": "Create a Club"
    }
  }
  ```
  `icon` fields are lucide icon names, resolved client-side via an icon registry — not meaningful to backend beyond passing the string through.
- Errors: none defined (always 200).

Full field list, types, and current seed values: `src/mock/data/content.json` (`about` key) and `src/types/content.types.ts` (`AboutContent`).

## Page: Services (`/services`)

**1. Get Services Page Content** — `GET /content/services`
[Same content-endpoint pattern as About, above.]

- Called from: `src/features/discovery/pages/ServicesPage.tsx` → `useServicesContent()`
- Response Payload: `{ "data": ServicesContent }`
  ```json
  {
    "data": {
      "pageTitle": "Services",
      "metaDescription": "Everything a club needs to launch, run, and grow a thriving community...",
      "heroEyebrow": "What we offer",
      "heroTitle": "Everything a thriving community needs, in one place.",
      "heroSubtitle": "Whether you're joining your first club or running one with thousands of members...",
      "services": [
        {
          "icon": "Compass",
          "title": "Discovery",
          "body": "Browse clubs and events by category, city, or interest..."
        }
      ],
      "ctaTitle": "Bring your community online in minutes.",
      "ctaSubtitle": "Start a free club today, or explore how existing circles use Social Circle.",
      "ctaPrimaryCta": "Create a Club",
      "ctaSecondaryCta": "Explore Clubs"
    }
  }
  ```
  See `src/types/content.types.ts` (`ServicesContent`) and `src/mock/data/content.json` (`services` key) for the full `services[]` list (6 entries) and exact field names.

## Page: How It Works (`/how-it-works`)

**1. Get How It Works Page Content** — `GET /content/how-it-works`
[Same content-endpoint pattern as About, above.]

- Called from: `src/features/discovery/pages/HowItWorksPage.tsx` → `useHowItWorksContent()`
- Response Payload: `{ "data": HowItWorksContent }`
  ```json
  {
    "data": {
      "pageTitle": "How It Works",
      "metaDescription": "See exactly how Social Circle works...",
      "heroEyebrow": "The Process",
      "heroSubtitle": "From your first visit to your first meetup — here is exactly how Social Circle takes you there.",
      "stats": [{ "icon": "Users", "value": "12,458+", "label": "Active Members" }],
      "stepsEyebrow": "Four simple steps",
      "stepsTitle": "How it works",
      "steps": [
        {
          "icon": "Compass",
          "title": "Browse",
          "body": "Explore clubs and events picked around your interests..."
        }
      ],
      "whyEyebrow": "Why it works",
      "whyTitle": "Built so every circle feels like home",
      "whyBody": "Social Circle isn't just a directory of clubs...",
      "whyFeatures": [
        {
          "icon": "ShieldCheck",
          "title": "Verified clubs",
          "body": "Every club is reviewed before it goes live..."
        }
      ]
    }
  }
  ```
  See `src/types/content.types.ts` (`HowItWorksContent`) and `src/mock/data/content.json` (`howItWorks` key) for the full `steps[]` (4 entries) and `whyFeatures[]` (4 entries).

## Page: Contact (`/contact`)

**1. Get Contact Page Content** — `GET /content/contact`
[Same content-endpoint pattern as About, above.]

- Purpose: hero copy, quick-info (email/phone/hours), "other ways to reach us" channels, and office address — everything on the page except the form itself.
- Called from: `src/features/discovery/pages/ContactPage.tsx` → `useContactContent()`
- Response Payload: `{ "data": ContactContent }`
  ```json
  {
    "data": {
      "pageTitle": "Contact Us",
      "metaDescription": "Have a question, feedback, or a partnership idea?...",
      "heroEyebrow": "Contact Us",
      "heroTitleLine1": "We'd Love to Hear",
      "heroTitleLine2Prefix": "From ",
      "heroTitleHighlight": "You",
      "heroSubtitle": "Have questions, feedback, or need support? Our team is here to help you.",
      "quickInfo": [{ "icon": "Mail", "title": "Email Us", "value": "hello@socialcircle.app" }],
      "formTitle": "Send Us a Message",
      "formSubtitle": "Fill out the form below and we'll get back to you shortly.",
      "channelsTitle": "Other Ways to Reach Us",
      "channels": [
        {
          "icon": "MessageCircle",
          "title": "Live Chat",
          "body": "Chat with our support team in real-time."
        }
      ],
      "officeTitle": "Our Office",
      "officeAddress": "Social Circle Technologies Pvt. Ltd.",
      "officeAddressLine2": "123 Cyberity Street, Zeeland, Noida, Uttar Pradesh 201301, India",
      "bannerTitle": "We're here to help you build amazing communities.",
      "bannerSubtitle": "Reach out anytime. We'll get back to you as soon as possible."
    }
  }
  ```

**2. Submit Contact Form** — `POST /contact`

- Purpose: send the contact form (previously this was faked client-side with a `setTimeout` — **now a real call**).
- Called from: `src/features/discovery/pages/ContactPage.tsx` → `useSubmitContactForm()` (mutation) → `contentService.submitContactForm()`
- Trigger: submitting the form ("Send Message" button)
- Auth: none
- Request Payload (`ContactFormPayload`, validated client-side by `contactSchema`):
  ```json
  {
    "fullName": "Test User",
    "email": "test@example.com",
    "subject": "Testing the API-backed contact form",
    "message": "This message is being submitted through the new POST /contact endpoint."
  }
  ```
  - `fullName: string` (2–100 chars), `email: string`, `subject: string` (1–`MAX_CONTACT_SUBJECT_LENGTH` chars), `message: string` (min `MIN_CONTACT_MESSAGE_LENGTH` chars) — all required.
- Response Payload (`200`, `ContactFormResponse`):
  ```json
  {
    "message": "Thanks for reaching out — we'll get back to you within 1 business day.",
    "referenceId": "MSG-9F3KQXAB"
  }
  ```
  The success toast on the page now displays this `message` field directly (no longer a hardcoded string).
- Errors: `400 { "code": "VALIDATION_ERROR", "message": "All fields are required." }` if any field is missing (the mock re-validates server-side in addition to the client-side zod check).

## Legal Pages — Terms (`/terms`), Privacy Policy (`/privacy`), Refund Policy (`/refund-policy`), Cookie Policy (`/cookie-policy`)

All four pages share one endpoint shape, parameterized by slug.

**1. Get Legal Page Content** — `GET /content/legal/:slug`

- Purpose: full legal page content (heading, intro, numbered sections with body paragraphs and/or bullet lists).
- Called from: `TermsPage.tsx` / `PrivacyPolicyPage.tsx` / `RefundPolicyPage.tsx` / `CookiePolicyPage.tsx` → `useLegalContent(slug)` → `contentService.getLegal(slug)`, rendered by the shared `src/features/discovery/components/LegalPageTemplate.tsx`
- Trigger: on page load
- Auth: none
- Request Payload: none — `:slug` in path is one of `terms | privacy | refund-policy | cookie-policy` (`LegalPageSlug`)
- Response Payload: `{ "data": LegalContent }`
  ```json
  {
    "data": {
      "pageTitle": "Terms & Conditions",
      "metaDescription": "Read the terms and conditions that govern your use of Social Circle...",
      "eyebrow": "Legal",
      "heading": "Terms & Conditions",
      "intro": "These Terms & Conditions (\"Terms\") govern your access to and use of Social Circle...",
      "calloutText": "Your privacy is important to us — we'll never sell your data.",
      "lastUpdatedDate": "July 1, 2026",
      "sections": [
        {
          "heading": "1. Acceptance of Terms",
          "icon": "CheckCircle2",
          "body": [
            "By registering for or using Social Circle, you confirm that you are at least 18 years old..."
          ]
        },
        {
          "heading": "7. Acceptable Use",
          "icon": "ShieldAlert",
          "list": [
            "No harassment, hate speech, or threats directed at other members",
            "No posting of unlawful, obscene, or infringing content"
          ]
        }
      ]
    }
  }
  ```
  - `calloutText` is optional (only `privacy` currently sets it).
  - Each section has either `body: string[]` (paragraphs) or `list: string[]` (bullets), not both, and both are optional depending on the section.
  - `lastUpdatedDate` is per-page (all 4 seeded to the same date today, but independently editable).
- Errors: `404 { "code": "NOT_FOUND", "message": "The page you are looking for does not exist." }` for an unrecognized slug.

Full content for all 4 pages: `src/mock/data/content.json` (`legal.terms`, `legal.privacy`, `legal.refundPolicy`, `legal.cookiePolicy`), types in `src/types/content.types.ts` (`LegalContent`, `LegalSection`, `LegalPageSlug`).

---

## Page: Clubs — browse/discovery list (`/clubs`)

**1. List Clubs**
[Reusing existing API — `GET /clubs`, already documented under Home page.]

- Called from: `src/features/discovery/pages/ClubsPage.tsx` (direct `useQuery`, not the infinite-scroll hook)
- Trigger: on page load, and on every debounced (250ms) keystroke in the search box
- Difference: params are `{ search: debouncedQuery || undefined, sort: "recommended", limit: 100 }` — no `page` param (single page of up to 100 results, no pagination UI). `search` is the only filter actually wired up in the UI, despite the endpoint also supporting `category`/`type`/`city`.

---

## Page: Events — browse/discovery list (`/events`)

**1. List Events**
[Reusing existing API — `GET /events`, already documented under Home page.]

- Called from: `src/features/discovery/pages/EventsPage.tsx`
- Trigger: on page load, and on every debounced (250ms) keystroke in the search box
- Difference: params are `{ search: debouncedQuery, limit: 100 }` (or just `{ limit: 100 }` when the box is empty) — no `upcoming`/`status`/`page` sent, so this returns **all** public/all-members events, not just upcoming ones.

---

## Page: Search (`/search`)

Three tabs. Each tab's query is independently debounced (300ms, min 2 characters to trigger a "search" request).

### Tab: Clubs

[Reusing existing API — `GET /clubs`, already documented under Home page.]

- Trigger: typing ≥2 characters while this tab is active
- Difference — while searching: `{ search: debouncedQuery }`. Difference — box empty ("Popular Clubs" section): a second call, `{ sort: "most_members", limit: 4 }`.

### Tab: Events

[Reusing existing API — `GET /events`, already documented under Home page.]

- Trigger: typing ≥2 characters while this tab is active
- Difference — while searching: `{ search: debouncedQuery }`. Difference — box empty ("Upcoming Events" section): `{ upcoming: true, limit: 4 }`.

### Tab: People

**No API call.** Unauthenticated users are redirected to `/login` before any request fires. Authenticated users see a static "coming soon" empty state.

> ⚠️ **Flag for backend**: people search is UI-stubbed only — no endpoint exists yet. Needs a contract defined (e.g. `GET /users/search?q=`) before this tab can be built out.

_(Recent-searches list is `localStorage`-only, no API involved.)_

---

## Page: Club Landing — public club profile (`/clubs/:slug`)

**1. Get Club by Slug** — `GET /clubs/:slug`

- Purpose: load the full club profile.
- Called from: `src/features/clubs/pages/ClubLandingPage.tsx` → `useClub(slug)` → `clubService.getBySlug(slug)`
- Trigger: on page load
- Auth: none
- Request Payload: none (`:slug` in path), e.g. `GET /clubs/business-promotion`
- Response Payload: single `Club` object — same shape as inside `GET /clubs`'s `data[]` (see Home page #1)
- Errors: `404 { "code": "NOT_FOUND", "message": "The page you are looking for does not exist." }` if no club matches the slug

**2. Club's Upcoming Events**
[Reusing existing API — `GET /events`, already documented under Home page.]

- Called from: `src/features/clubs/components/ClubEventsStrip.tsx`
- Difference: params are `{ clubId: club.id, upcoming: true, limit: 3 }` — note this uses the flat `GET /events?clubId=...` filter, **not** a nested `/clubs/:clubId/events` route (that nested route exists in the endpoint constants/service layer but nothing in the built UI calls it).

**3. My Saved Clubs (bookmark state)** — `GET /me/saved-clubs`

- Purpose: determine whether to show the bookmark button filled or outline.
- Called from: `src/features/clubs/components/ClubHero.tsx` → `useSavedClubs()` → `savedClubService.list()`
- Trigger: on page load, only if authenticated
- Auth: intended to require auth; handler returns `{ "data": [] }` instead of `401` when unauthenticated (same inconsistency as Home #5/#6)
- Request Payload: none
- Response Payload: `{ "data": SavedClub[] }` where `SavedClub` = `Club` (see Home #1) + `{ "savedAt": string }`

**4. Save Club** — `POST /me/saved-clubs/:clubId`

- Purpose: "Save" bookmark button action.
- Called from: `src/features/clubs/components/ClubHero.tsx` (redirects to login first if unauthenticated, via `useRequireAuth`)
- Trigger: click bookmark icon while not yet saved
- Auth: required — `401 { "code": "UNAUTHORIZED", "message": "..." }` without token
- Request Payload: none (empty POST body)
- Response Payload: `{ "data": SavedClub }` (idempotent — returns existing record if already saved)
- Errors: `404 { "code": "NOT_FOUND", "message": "..." }` if `clubId` doesn't exist

**5. Unsave Club** — `DELETE /me/saved-clubs/:clubId`

- Purpose: "Unsave" bookmark button action.
- Called from: `src/features/clubs/components/ClubHero.tsx`
- Trigger: click bookmark icon while already saved
- Auth: required — `401` without token
- Request Payload: none
- Response Payload: `204 No Content`
- Errors: `404` if no saved-club record exists for that user+club

**6. Join Club** — `POST /clubs/:clubId/join`

- Purpose: primary "Join" CTA — **free clubs only**. Paid clubs navigate client-side to `/checkout/:planId` instead and never call this endpoint (checkout flow is a placeholder page, out of scope here).
- Called from: `src/features/clubs/components/ClubDetailsCard.tsx` and `src/features/clubs/components/ClubStickyMobileBar.tsx` (both call the same `useJoinClub(slug)` hook); gated by `useRequireAuth`
- Trigger: click "Join" button, `club.type === "free"` only
- Auth: required — `401` without token
- Request Payload: `{}` (empty object)
- Response Payload: `ClubMembership`
  ```json
  {
    "id": "mem_abc123",
    "clubId": "clu_bizpromo01",
    "userId": "usr_member01",
    "role": "member",
    "status": "active",
    "joinedAt": "2026-08-07T12:00:00.000Z"
  }
  ```
  `status` is `"pending_approval"` instead of `"active"` if `club.membershipApproval === "manual"`. Idempotent if already a member.
- Errors: `404` if `clubId` not found. Mock handler also defines `402 { "checkoutUrl": string }` for paid clubs, but the frontend never actually calls this endpoint for paid clubs today (it routes to checkout instead) — worth confirming the intended real-world flow with backend/product before dropping this branch.

> Note: `ClubMembersPreview` on this page renders placeholder avatars from `memberCount` only — there's a code comment stating "No member directory API yet" for the public club page, so no member-list call happens here (member listing _is_ used elsewhere — see Club Dashboard Chat page).

---

## Page: Public Event Detail (`/clubs/:slug/events/:eventId`)

**1. Get Event by ID** — `GET /events/:eventId`

- Purpose: load full event detail.
- Called from: `src/features/events/pages/PublicEventDetailPage.tsx` → `useEvent(eventId)` → `eventService.getById(eventId)`
- Trigger: on page load
- Auth: optional — `currentUserRsvp` reflects the bearer token's prior RSVP if authenticated, else `null`
- Request Payload: none (`:eventId` in path)
- Response Payload: single `EventWithClub` object — same shape as inside `GET /events`'s `data[]` (see Home page #2)
- Errors: `404 { "code": "NOT_FOUND", "message": "..." }` if `eventId` doesn't exist

**2. RSVP to Event** — `POST /events/:eventId/rsvp`

- Purpose: RSVP CTA — **free events only**; paid events navigate to `/checkout/:eventId` instead (placeholder, out of scope).
- Called from: `src/features/events/pages/PublicEventDetailPage.tsx` → `useEventRsvp(eventId)` → `eventService.rsvp(eventId, 'going')`; gated by `useRequireAuth`
- Trigger: click "RSVP" button (this page only ever sends `"going"`, though the endpoint supports all 3 values)
- Auth: required — `401` without token
- Request Payload:
  ```ts
  {
    response: 'going' | 'interested' | 'not_going';
  }
  ```
  Example: `{ "response": "going" }`
- Response Payload:
  ```json
  { "rsvpCounts": { "going": 11, "interested": 4, "not_going": 0 }, "currentUserRsvp": "going" }
  ```
  Server keeps one latest RSVP per user per event, decrementing the old bucket and incrementing the new one.
- Errors: `404` if `eventId` not found

---

## Auth Pages

Global note: the request interceptor auto-attaches `Authorization: Bearer <token>` when present. On any non-`/auth/*` call that returns `401`, the client silently calls `POST /auth/refresh` once and retries; if that also fails, tokens are cleared and the browser hard-redirects to `/login`.

## Page: Login (`/login`)

**1. Login (password)** — `POST /auth/login`

- Called from: `src/features/auth/pages/LoginPage.tsx` → `authService.login` → `useLogin`
- Trigger: submitting the "Password" tab form
- Auth: none
- Request Payload:
  ```json
  { "email": "member@example.com", "password": "Member@123", "rememberMe": true }
  ```
  (`email` field actually accepts email-or-phone; `rememberMe` optional)
- Response Payload (`200`):
  ```json
  {
    "user": {
      "id": "usr_member01",
      "email": "member@example.com",
      "phone": null,
      "fullName": "Priya Sharma",
      "username": "priya_sharma",
      "avatarUrl": "",
      "bio": "Weekend hiker and amateur photographer.",
      "city": "Delhi",
      "interests": ["photography", "travel", "food"],
      "status": "active",
      "emailVerified": true,
      "phoneVerified": false,
      "profileComplete": true,
      "joinedAt": "2025-04-18T00:00:00.000Z",
      "lastActiveAt": "2026-07-24T00:00:00.000Z",
      "clubsJoined": 4,
      "linkedProviders": []
    },
    "accessToken": "mock.access.token.usr_member01",
    "refreshToken": "mock.refresh.token.usr_member01"
  }
  ```
- Errors:
  - `401 { "code": "INVALID_CREDENTIALS", "message": "Invalid email or password. Please try again." }`
  - `423 { "code": "ACCOUNT_LOCKED", "message": "Account temporarily locked. Please try again in 30 minutes." }` after 5 failed attempts (30-minute lock)

**2. Send/Resend Login OTP** — `POST /auth/resend-otp`

- Called from: same page, "OTP" tab → `authService.resendOtp` → `useResendOtp`
- Trigger: click "Send code" / "Resend"
- Auth: none
- Request Payload: `{ "target": "member@example.com", "purpose": "login" }` (`purpose` ∈ `signup|login|forgot_password|change_email|change_phone`)
- Response Payload: `{ "message": "A new code has been sent." }`
- Errors: none defined in mock — recommend real backend add rate-limit/not-found handling

**3. Verify Login OTP** — `POST /auth/verify-otp`

- Called from: same page, "OTP" tab → `authService.verifyOtp` → `useVerifyOtp`
- Trigger: entering the 6-digit code (dev bypass value: `123456`)
- Auth: none
- Request Payload: `{ "target": "member@example.com", "otp": "123456", "purpose": "login" }`
- Response Payload: `{ "verified": true }`
  > ⚠️ **Flag for backend**: unlike `purpose: "signup"` (below), a `login`-purpose verify does **not** return `user`/tokens — the frontend's success handler only consumes tokens `if ('accessToken' in data)`, so **OTP login currently never actually authenticates the user**. Recommend the real backend also mint tokens on a successful `login`-purpose verify, and the frontend gets a small fix to consume them.
- Errors:
  - `400 { "code": "OTP_INVALID", "message": "The code you entered is incorrect." }`
  - `429 { "code": "OTP_MAX_ATTEMPTS", "message": "Too many attempts. Please wait 5 minutes and try again." }` after 3 wrong attempts

---

## Page: Signup (`/signup`)

6-step wizard (account info → personal info → family/occupation → references → document uploads → review/submit). **Only step 1's `fullName`/`email` are ever sent to the API today.**

**1. Signup** — `POST /auth/signup`

- Called from: `src/features/auth/pages/SignupPage.tsx` → `authService.signup` → `useSignup`
- Trigger: submitting the final step
- Auth: none
- Request Payload — **exactly what's sent**:
  ```json
  { "fullName": "Priya Sharma", "email": "new.user@example.com" }
  ```
  > ⚠️ **Flag for backend — biggest gap in this flow**: the wizard collects far more (phone, community, address, date of birth, religion, nationality, resident status, parent/spouse/children names, occupation, 2 reference contacts, terms acceptance, and 7 document uploads), but **none of it is sent to any API**. It's JSON-serialized to `localStorage` and discarded. There is currently no real endpoint to persist this KYC/document data — recommend a new endpoint (e.g. an extended `POST /auth/signup` body, or a separate `POST /signup/kyc` with multipart file upload) before backend work starts here.
  > Also note: the form has **no password field at all**, so accounts created this way are password-less at creation — they cannot use `POST /auth/login` (password mode) afterward unless a password is set some other way.
- Response Payload (`200`):
  ```json
  { "message": "We sent a 6-digit code to", "channel": "email", "maskedTarget": "n***@example.com" }
  ```
- Errors: `409 { "code": "EMAIL_EXISTS", "message": "An account with this email already exists. Try logging in." }`

## Page: Signup Success (`/signup/success`)

No API calls. The "reference ID" shown (`REQ-XXXXXXXX`) is fabricated client-side with `nanoid` — **not** returned by any backend call.

> ⚠️ **Flag for backend**: today, this page follows straight from Signup without ever calling OTP verification — the app does not navigate to `/verify-otp` or call `POST /auth/verify-otp` after signup, so **no account is actually created** by the current signup flow (the mock only completes account creation inside the OTP-verify handler, which this path never reaches). This needs to be reconciled — either wire Signup → OTP Verification → account creation, or change the flow intentionally.

## Page: OTP Verification (`/verify-otp`)

Registered as a route, but **no page in the app currently navigates to it** with the state it requires — visiting it directly redirects back to Signup. Documenting its contract since it's real, working code, in case it gets wired up:

**1. Verify OTP (signup purpose)** — `POST /auth/verify-otp`
[Reusing existing API — already documented under Login.]

- Difference: called with `purpose: "signup"`. On success, **this is the only path in the app that actually creates the pending-signup user and returns full auth tokens**:
  ```json
  {
    "user": {
      "id": "usr_AbCdEfGhIj",
      "email": "new.user@example.com",
      "phone": null,
      "fullName": "Priya Sharma",
      "username": "new.user_ab12",
      "avatarUrl": "",
      "bio": "",
      "city": "",
      "interests": [],
      "status": "active",
      "emailVerified": true,
      "phoneVerified": false,
      "profileComplete": false,
      "joinedAt": "2026-08-07T12:00:00.000Z",
      "lastActiveAt": "2026-08-07T12:00:00.000Z",
      "clubsJoined": 0,
      "linkedProviders": []
    },
    "accessToken": "mock.access.token.usr_AbCdEfGhIj",
    "refreshToken": "mock.refresh.token.usr_AbCdEfGhIj"
  }
  ```
- Extra error: `400 { "code": "SIGNUP_NOT_FOUND", "message": "The code you entered is incorrect." }` if no pending signup exists for that target.
- On success: navigates to `/onboarding/profile`.

**2. Resend OTP** — `POST /auth/resend-otp` — [Reusing existing API, already documented under Login.]

---

## Page: Forgot Password (`/forgot-password`)

3-step inline flow (target → OTP → new password) on one page.

**1. Request Password Reset** — `POST /auth/forgot-password`

- Called from: `src/features/auth/pages/ForgotPasswordPage.tsx` → `authService.forgotPassword` → `useRequestPasswordReset`
- Trigger: step 1 submit
- Auth: none
- Request Payload: `{ "target": "member@example.com" }`
- Response Payload: `{ "message": "We sent a 6-digit code to", "maskedTarget": "m***@example.com" }`
- Errors: `404 { "code": "NOT_FOUND", "message": "..." }` — reuses the generic "page not found" copy; recommend a proper "no account found" message. Also: a social-only account (no password ever set) will 404 here even if the email exists — confirm intended behavior with backend.

**2. Verify Reset OTP** — `POST /auth/verify-otp`
[Reusing existing API, already documented under Login.] Difference: called with `purpose: "forgot_password"`; response is always `{ "verified": true }` (never the full auth payload).

**3. Reset Password** — `POST /auth/reset-password`

- Called from: same page, step 3 submit → `authService.resetPassword` → `useResetPassword`
- Trigger: submitting new password + confirm
- Auth: none
- Request Payload:
  ```json
  { "target": "member@example.com", "otp": "123456", "newPassword": "NewPass@123" }
  ```
  `newPassword` must be ≥8 chars with 1 uppercase, 1 digit, 1 special character.
- Response Payload: `{ "message": "Password reset successfully. Please log in." }`
- Errors: `400 OTP_INVALID`, `429 OTP_MAX_ATTEMPTS` (same shapes as Login #3)
- Side effect: no tokens set — user is redirected to `/login` to sign in again.

---

## Page: Social Callback (`/auth/callback`)

**1. Social Login** — `POST /auth/social-login`

- Called from: `src/features/auth/pages/SocialCallbackPage.tsx` → `authService.socialLogin(provider)` → `useSocialLogin`
- Trigger: page mount, when URL has `?provider=google|apple|facebook` (post-OAuth-redirect)
- Auth: none
- Request Payload:
  ```json
  { "provider": "google", "code": "mock-code" }
  ```
  > ⚠️ **Flag for backend**: the frontend currently hardcodes the literal string `"mock-code"` instead of a real OAuth authorization code — it will need updating once a real OAuth code-exchange flow exists.
- Response Payload (`200`), extends the standard auth response with `isNewUser`:
  ```json
  {
    "user": {
      "id": "usr_XyZ123abcd",
      "email": "google.demo@social.mock",
      "fullName": "Google User",
      "username": "google_ab12",
      "avatarUrl": "",
      "bio": "",
      "city": "",
      "interests": [],
      "status": "active",
      "emailVerified": true,
      "phoneVerified": false,
      "profileComplete": false,
      "joinedAt": "2026-08-07T12:00:00.000Z",
      "lastActiveAt": "2026-08-07T12:00:00.000Z",
      "clubsJoined": 0,
      "linkedProviders": ["google"]
    },
    "accessToken": "mock.access.token.usr_XyZ123abcd",
    "refreshToken": "mock.refresh.token.usr_XyZ123abcd",
    "isNewUser": true
  }
  ```
- Errors: none defined in mock — recommend an `OAUTH_FAILED`-style error for a bad/expired code.
- Side effect: if `isNewUser`, navigates to `/onboarding/interests` (skips profile step 1 entirely); else navigates home.

---

## Page: Onboarding Step 1 — Profile (`/onboarding/profile`)

**1. Update Profile** — `PATCH /users/me`

- Called from: `src/features/onboarding/pages/ProfileSetupStep1Page.tsx` → `onboardingService.updateProfile(patch)` → `useUpdateProfile`
- Trigger: submitting the form (the "Skip" control is also a submit of the same form, not a true bypass)
- Auth: required — `401 { "code": "UNAUTHORIZED", "message": "..." }` if token missing/invalid
- Request Payload (`Partial<User>`):
  ```json
  {
    "fullName": "Priya Sharma",
    "bio": "Weekend hiker and amateur photographer.",
    "avatarUrl": "data:image/png;base64,..."
  }
  ```
  `avatarUrl` is a client-cropped image embedded as a base64 data URL — there is no separate upload endpoint.
  > ⚠️ **Flag for backend**: consider a dedicated multipart avatar-upload endpoint instead of accepting a large base64 string inline on this PATCH.
- Response Payload: full updated `User` object (`200`), e.g.:
  ```json
  {
    "id": "usr_member01",
    "email": "member@example.com",
    "phone": null,
    "fullName": "Priya Sharma",
    "username": "priya_sharma",
    "avatarUrl": "data:image/png;base64,...",
    "bio": "Weekend hiker and amateur photographer.",
    "city": "Delhi",
    "interests": ["photography", "travel", "food"],
    "status": "active",
    "emailVerified": true,
    "phoneVerified": false,
    "profileComplete": true,
    "joinedAt": "2025-04-18T00:00:00.000Z",
    "lastActiveAt": "2026-08-07T12:00:00.000Z",
    "clubsJoined": 4,
    "linkedProviders": []
  }
  ```
  Server recomputes `profileComplete = Boolean(fullName) && interests.length > 0` unless the patch explicitly sets `profileComplete`.
- Side effect: merges the returned user into the client's auth store; navigates to `/onboarding/interests`.

## Page: Onboarding Step 2 — Interests (`/onboarding/interests`)

**1. Update Profile (interests + city)**
[Reusing existing API — `PATCH /users/me`, already documented above.]

- Called from: `src/features/onboarding/pages/ProfileSetupStep2Page.tsx` (same `useUpdateProfile` hook)
- Difference — "Finish" submit: `{ "interests": ["sports", "outdoors", "tech"], "city": "Pune" }` (`interests` requires ≥1 selection)
- Difference — "Skip" button: `{ "interests": [], "city": "Pune", "profileComplete": true }` — **explicitly forces `profileComplete: true` with zero interests**, overriding the normal auto-compute logic. Worth confirming with backend/product whether a real "skip" should be allowed to force-complete onboarding this way.
- Side effect on success: navigates to `/` (home).

---

# Section 2: Logged-In Member Area

## Page: My Clubs (`/my-clubs`)

**1. My Clubs**
[Reusing existing API — `GET /me/clubs`, already documented under Home page.]

- Called from: `src/features/clubs/pages/MyClubsPage.tsx`
- No payload/response differences.

Also loads on page mount (all reused, already documented under Home page): `GET /me/conversations`, `GET /me/notifications`, `GET /me/invitations` (sidebar badges), and `GET /events?limit=200` (client-filtered to the user's own clubs, for upcoming-events stats).

---

## Page: My Events (`/events/mine`)

Tabs: **Upcoming / Past / Cancelled**. Each tab switch re-runs the same query with a different `status` param (a real refetch, not a client-side re-filter of one cached response).

**1. List Events (mine)**
[Reusing existing API — `GET /events`, already documented under Home page.]

- Called from: `src/features/events/pages/MyEventsPage.tsx` → `useMyEvents({status, search, sort})` → `useEventsFeed`
- Trigger: page load, tab switch, debounced search input, sort change
- Difference: query params `{ status: 'upcoming'|'past'|'cancelled', search?: string, limit: 200 }`. `sort=title` is applied **client-side**; `sort=date` (default) is the server's natural order.
  > ⚠️ **Flag for backend**: this endpoint is **not** membership-scoped server-side — the frontend fetches up to 200 events matching `status`/`search` and then filters client-side to events belonging to the user's own clubs (via a separately-fetched `/me/clubs` list). Recommend a real `GET /me/events` (or `GET /events?mine=true`) endpoint that does this filtering server-side.

Also loads on page mount (reused, documented under Home page): `GET /me/conversations`, `GET /me/notifications`, `GET /me/invitations`.

---

## Page: Invitations (`/invitations`)

**1. List My Invitations**
[Reusing existing API — `GET /me/invitations`, already documented under Home page.]

- Called from: `src/features/clubs/pages/InvitationsPage.tsx`

**2. Accept Invitation** — `POST /me/invitations/:invitationId/accept`

- Called from: same page, `InvitationCard` → `useAcceptInvitation`
- Trigger: click "Accept"
- Auth: required — `401` without token
- Request Payload: none
- Response Payload: `{ "data": ClubMembership }`
  ```json
  {
    "data": {
      "id": "mem_abc123",
      "clubId": "clu_bizpromo01",
      "userId": "usr_member01",
      "role": "member",
      "status": "active",
      "joinedAt": "2026-08-07T12:00:00.000Z"
    }
  }
  ```
  `status` is `"pending_approval"` if the club requires manual approval. Accepting an already-accepted/declined invite is a no-op that still returns the membership.
- Errors: `404 { "code": "NOT_FOUND", "message": "..." }` if invitation doesn't exist or doesn't belong to the caller
- Side effect: invalidates the invitations list (#1) and `/me/clubs`

**3. Decline Invitation** — `POST /me/invitations/:invitationId/decline`

- Called from: same page, `InvitationCard` → `useDeclineInvitation`
- Trigger: click "Decline"
- Auth: required — `401` without token
- Request Payload: none
- Response Payload: `204 No Content`
- Errors: `404` if not found/not owned by caller

---

## Page: Saved Clubs (`/saved-clubs`)

**1. List Saved Clubs**
[Reusing existing API — `GET /me/saved-clubs`, already documented under Club Landing page.]

- Called from: `src/features/clubs/pages/SavedClubsPage.tsx`
- Note: response `data[].id` here is the **club's** id (the mock spreads the club object over the save record on the way out), not the join-table row id.

**2. Unsave Club**
[Reusing existing API — `DELETE /me/saved-clubs/:clubId`, already documented under Club Landing page.]

- Called from: same page, `SavedClubCard` → `useUnsaveClub`

Also loads on page mount (reused): `GET /me/conversations`, `GET /me/notifications`, `GET /me/invitations`; and a "Clubs you might like" section reusing `GET /clubs`.

---

## Page: Notifications (`/notifications`)

Category tabs (All / Club Activity / Events / Payments / System) are **purely client-side filters** over one response — no separate call per tab.

**1. List Notifications**
[Reusing existing API — `GET /me/notifications`, already documented under Home page.]

- Called from: `src/features/notifications/pages/NotificationsPage.tsx` with `{ limit: 20 }`
- Note: this is a flat capped list, not paginated — there's no "load more" on this page.

**2. Mark All Notifications Read** — `POST /me/notifications/mark-read`

- Called from: same page, "Mark all read" button → `useMarkAllNotificationsRead`
- Trigger: click "Mark all read" (disabled if nothing unread)
- Auth: required — `401 { "code": "UNAUTHORIZED", "message": "Unauthorized" }` (note: this literal message string differs slightly from the shared error copy used elsewhere — worth normalizing)
- Request Payload: `{ "all": true }`
- Response Payload: `204 No Content`

**3. Mark Single Notification Read**
Same endpoint (`POST /me/notifications/mark-read`) with body `{ "ids": ["ntf_001"] }` — a hook for this exists (`useMarkNotificationAsRead`) but wasn't found wired to any button on this page.

> ⚠️ **Flag for backend**: confirm the intended trigger for per-notification "mark read" (e.g. clicking an individual notification row) before assuming it's unused.

---

## Page: Messages / Conversations Hub (`/messages`, `/messages/:userId`)

Filter tabs (All / Chats / Groups / Clubs) are **entirely client-side**, built from the conversations list plus `/me/clubs` — no separate call per tab or per search keystroke.

**1. List Conversations**
[Reusing existing API — `GET /me/conversations`, already documented under Home page.]

- Called from: `src/features/chat/pages/ConversationsHubPage.tsx`

**2. List a Club's Chat Channels** — `GET /clubs/:clubId/channels`

- Purpose: resolve channel metadata (name, type, pinned message) for the currently open group thread.
- Called from: `GroupChatView` component (shared by this page and Club Dashboard Chat) → `useChannels(clubId)`
- Trigger: opening a club/group thread
- Auth: **none enforced** by this handler — flagged below as a gap (should probably require active membership)
- Request Payload: none
- Response Payload: `{ "data": ChatChannel[] }`
  ```json
  {
    "data": [
      {
        "id": "ch_bp_general",
        "clubId": "clu_bizpromo01",
        "name": "general",
        "type": "group",
        "createdAt": "2026-01-01T09:00:00.000Z"
      },
      {
        "id": "ch_bp_announcements",
        "clubId": "clu_bizpromo01",
        "name": "announcements",
        "type": "announcement",
        "createdAt": "2026-01-01T09:00:00.000Z"
      }
    ]
  }
  ```

**3. Resolve/Create DM Channel** — `POST /users/:userId/dm-channel`

- Purpose: get-or-create the 1:1 channel with `:userId`, used when landing directly on `/messages/:userId`.
- Called from: same page
- Trigger: page load when a `userId` route param is present
- Auth: required — `401` without token
- Request Payload: `{}`
- Response Payload: `{ "data": ChatChannel }`
  ```json
  {
    "data": {
      "id": "ch_dm_mod_member01",
      "clubId": "",
      "name": "Arjun Mehta",
      "type": "direct",
      "participantIds": ["usr_mod01", "usr_member01"],
      "createdAt": "2026-08-07T12:00:00.000Z"
    }
  }
  ```
  Idempotent — returns the existing channel if one already exists for this pair.

**4. List Messages in a Channel** — `GET /channels/:channelId/messages`

- Purpose: fetch message history — used identically for DM threads and club-group threads.
- Called from: `useMessages(channelId)`, on opening a thread; polled every 4,000ms as a real-time fallback
- Auth: **none enforced** by this handler — flagged below (should probably require membership)
- Request Payload (query): `{ before?: string /* ISO cursor */, limit?: number }` — default `limit: 50`
- Response Payload: `{ "data": ChatMessage[], "cursor": string | null, "hasMore": boolean }`
  ```json
  {
    "data": [
      {
        "id": "msg_gen_001",
        "channelId": "ch_mt_general",
        "senderId": "usr_owner01",
        "type": "text",
        "text": "Welcome to Mumbai Trail Runners #general!",
        "reactions": { "thumbs_up": ["usr_mod01", "usr_member01"] },
        "edited": false,
        "deleted": false,
        "deliveredTo": ["usr_mod01", "usr_member01", "usr_member02"],
        "readBy": ["usr_mod01", "usr_member01"],
        "sentAt": "2026-07-25T02:00:00.000Z"
      }
    ],
    "cursor": "2026-07-25T02:00:00.000Z",
    "hasMore": false
  }
  ```
  `type` ∈ `text|image|video|document|voice|poll|system`. Fetching also marks messages as `deliveredTo` the caller server-side.
  > Note: `cursor`/`hasMore` are returned by the API but no "load more"/infinite-scroll trigger was found wired to them in the current UI — the contract supports pagination even though the frontend doesn't yet use it.

**5. Send Message** — `POST /channels/:channelId/messages`

- Called from: composer form submit, file attach, voice recording, or poll composer (group chats only) — all via `useSendMessage(channelId)`
- Auth: required — `401` without token; `404` if `channelId` doesn't exist
- Request Payload:
  ```ts
  { type: MessageType; text?: string; mediaUrl?: string; mediaType?: string; mediaSize?: number; mediaThumbnailUrl?: string; poll?: ChatPoll; replyTo?: ChatReplyTo }
  ```
  Example (text + reply): `{ "type": "text", "text": "Count me in for Saturday!", "replyTo": { "id": "msg_gen_003", "senderId": "usr_mod01", "senderName": "Arjun Mehta", "previewText": "Anyone else running..." } }`
  Example (poll, group chats only): `{ "type": "poll", "poll": { "question": "Meetup time?", "options": [{ "id": "opt1", "text": "6am", "voteCount": 0 }], "allowMultiple": false, "closed": false } }`
  > ⚠️ **Flag for backend**: media messages currently send the file inline as a base64 `mediaUrl` data URL for files under the size cap, or an ephemeral session-only object URL for larger ones. A real backend needs a proper upload/pre-signed-URL flow instead of embedding file bytes in the message body.
- Response Payload: `201 { "data": ChatMessage }` (server assigns `id`, `senderId`, `sentAt`, empty `reactions`/`deliveredTo`/`readBy`, `edited: false`, `deleted: false`)
- Side effect: group-channel text messages are scanned for `@FullName` mentions of active members, generating a `chat_mention` notification for each.

**6. Mark Channel Read** — `POST /channels/:channelId/read`

- Called from: automatically when a thread is opened (`useMarkAsRead`) — not a manual button
- Auth: required — `401` without token
- Request Payload: `{}`
- Response Payload: `200 { "data": { "ok": true } }` — marks every message not sent by the caller as delivered+read

**7. Toggle Message Reaction** — `POST /messages/:messageId/reactions`

- Request Payload: `{ "emoji": "❤️" }` — toggles the caller's id in/out of that emoji's reactor list
- Response Payload: `200 { "data": { "reactions": Record<string, string[]> } }`
- Errors: `404` if message not found or unauthenticated

**8. Edit Message** — `PATCH /messages/:messageId`

- Request Payload: `{ "text": "corrected text" }`
- Response Payload: `200 { "data": ChatMessage }`
- Errors: `403 { "code": "FORBIDDEN", "message": "..." }` if not the sender; `404` if not found

**9. Delete Message** — `DELETE /messages/:messageId`

- Request Payload: `{ "scope": "for_me" | "for_everyone" }`
  > ⚠️ **Flag for backend**: the mock currently **ignores `scope` entirely** and always hard-deletes for everyone server-side; `"for_me"` is actually implemented as a **client-only** localStorage hidden-message list that never calls this API. A real backend needs to honor `scope` properly (per-user hidden state vs. true delete).
- Response Payload: `204 No Content`
- Errors: same `403`/`404` as Edit

**10. Vote on Poll** — `POST /messages/:messageId/vote`

- Request Payload: `{ "optionIds": ["opt1"] }`
- Response Payload: `200 { "data": ChatMessage }` with `poll.userVotedOptionIds` updated (previous vote retracted first)
- Errors: `401` if unauthenticated, `404` if message/poll not found

**11. Pin Message** — `POST /channels/:channelId/pin`

- Request Payload: `{ "messageId": string | null }`
- Response Payload: `200 { "data": ChatChannel }`

> Exists in the service layer but no UI trigger (pin button) was found wired to it — confirm intended trigger point before building.

Also loads on page mount (reused): `GET /me/clubs`, `GET /me/notifications`, `GET /me/invitations`; opening a sender's avatar hits `GET /users/:id` (documented under Profile page, below).

---

## Page: Club Dashboard — Chat tab (`/clubs/:slug/dashboard/chat`)

This is the only implemented tab of the club dashboard today. It renders the same `GroupChatView` component used by the Messages hub's group/club threads, scoped to this club's default channel.

**1. Get Club by Slug (dashboard access gate)**
[Reusing existing API — `GET /clubs/:slug`, already documented under Club Landing page.]

- Called from: `src/features/clubs/components/ClubDashboardLayout.tsx` (wraps this page)
- Difference: used purely as an access gate — a 404 or failed membership check (see #2) redirects to the public Club Landing page instead of rendering the dashboard.

**2. Get My Membership for This Club** — `GET /clubs/:clubId/members/me`

- Purpose: confirm the caller has an **active** membership before rendering any dashboard tab — doubles as the paywall/approval gate.
- Called from: `ClubDashboardLayout` → `useMyMembership(club.id)`
- Trigger: on dashboard mount, before the Chat tab itself renders
- Auth: required — `401 { "code": "UNAUTHORIZED", "message": "..." }` without token
- Request Payload: none
- Response Payload: `{ "data": ClubMembership }` — same shape as Invitations #2's response
  ```json
  {
    "data": {
      "id": "mem_bp_owner",
      "clubId": "clu_bizpromo01",
      "userId": "usr_owner01",
      "role": "owner",
      "status": "active",
      "joinedAt": "2026-02-05T09:00:00.000Z"
    }
  }
  ```
- Errors: `404 { "code": "NOT_FOUND", "message": "..." }` if no membership row exists — treated the same as a non-`"active"` status (e.g. `"pending_approval"`): both redirect to the public club page.

**3. List Club Channels (find default "general" channel)**
[Reusing existing API — `GET /clubs/:clubId/channels`, already documented under Messages page.] Difference: this page picks `channels.find(c => c.type === "group" && c.name === "general")`, falling back to the first group channel — same list call, just client-side selection.

**4. List Club Members (roster / @mention list)** — `GET /clubs/:clubId/members`

- Purpose: build the online-member count and @mention autocomplete inside the chat composer, and resolve sender display names.
- Called from: `useClubMembers(club.id, club.memberCount)` inside `GroupChatView`
- Trigger: on mount
- Auth: not verified in this pass — likely intended to require membership; confirm.
- Request Payload (query): `{ limit: number }`, e.g. `?limit=410` (club's `memberCount`)
- Response Payload: `PaginatedResponse<ClubMemberWithUser>` where `ClubMemberWithUser` = `ClubMembership` + `{ "isOnline": boolean, "user": User }`

**5. Message-level actions**
[Reusing existing APIs — list/send/mark-read/react/edit/delete/vote/pin, all already documented under Messages page §4–§11.] Same endpoints and payload shapes, just scoped to this club's general channel instead of a DM/other-group channel.

> ⚠️ **Flag for backend**: no restriction exists in the mock preventing regular members from posting into an `announcement`-type channel — if the real backend wants to restrict posting there to owners/moderators, that needs to be added; it's not enforced today.

---

## Page: Profile — view (`/profile/:userId`)

Tabs: **Clubs / Activity** (client-side state, not separate routes).

**1. Get User Profile** — `GET /users/:userId`

- Purpose: load the profile being viewed.
- Called from: `src/features/profile/pages/ProfilePage.tsx` → `useUser(userId)` → `userService.getById`
- Trigger: on page load / param change
- Auth: none required; content doesn't change based on caller identity beyond the "Send Message" button being hidden on your own profile
- Request Payload: none (`:userId` in path)
- Response Payload: full `User` object (see Onboarding Step 1 for shape)
- Errors: `404 { "code": "NOT_FOUND", "message": "..." }` if user doesn't exist

**Tab: Clubs** (own profile only)
[Reusing existing API — `GET /me/clubs`, already documented under Home page.] Only fetched/rendered when `isOwnProfile` is true; viewing someone else's profile shows a static empty state with **zero** API calls (no public "this user's clubs" endpoint exists).

**Tab: Activity**
**No API call.** Renders a static "coming soon" empty state regardless of whose profile is being viewed.

> ⚠️ **Flag for backend**: no activity-feed endpoint exists yet — needs a contract defined if this tab is meant to be built out.

**"Send Message" button**: not an API call — it's a plain link to `/messages/:userId` (the Messages page then resolves/creates the DM channel, documented above).

---

## Page: Edit Profile (`/profile/edit`)

**1. Update Profile**
[Reusing existing API — `PATCH /users/me`, already documented under Onboarding Step 1.]

- Called from: `src/features/profile/pages/EditProfilePage.tsx` (same `useUpdateProfile` hook as onboarding)
- Trigger: form submit
- Difference — payload sent by this page:
  ```json
  {
    "fullName": "Priya Sharma",
    "bio": "Product designer & weekend hiker.",
    "city": "Bengaluru",
    "websiteUrl": "https://priya.design",
    "interests": ["design", "hiking", "startups"],
    "socialLinks": { "twitter": "@priyad", "linkedin": "", "instagram": "priya.creates" },
    "avatarUrl": "data:image/png;base64,...",
    "coverPhotoUrl": "data:image/jpeg;base64,..."
  }
  ```
  Adds `websiteUrl`, `socialLinks.{twitter,linkedin,instagram}`, and `coverPhotoUrl` on top of what onboarding sends. There is **no `username` field anywhere on this page** despite `User.username` existing — it is not editable from the built UI, and there's no "check username availability" endpoint/call in the codebase.
- Response: full updated `User` object (adds `coverPhotoUrl`, `websiteUrl`, `socialLinks` to the shape shown earlier).
- Avatar/cover photo: both are read client-side via `FileReader.readAsDataURL()` and submitted inline as base64 on this same PATCH — no separate upload endpoint (same pattern/flag as Onboarding Step 1).

---

## Page: Settings (`/settings`, `/settings/notifications`, `/settings/privacy`, `/settings/payments`)

One page component, 4 tabs, each with its own endpoints.

### Tab: Account (`/settings`)

**1. Change Email (step 1 — initiate)** — `POST /account/email`

- Trigger: submit "New email" form in `ChangeContactDialog`
- Auth: required
- Request Payload: `{ "email": "priya.new@example.com" }`
- Response Payload: `{ "message": "Enter the 6-digit code we sent.", "maskedTarget": "priya.new@example.com" }`

**2. Change Email (step 2 — verify)** — `POST /account/email/verify`

- Trigger: OTP auto-submit or "Verify" click
- Request Payload: `{ "otp": "123456" }`
- Response Payload: full updated `User` with new `email`, `emailVerified: true`
- Errors: `400 { "code": "OTP_INVALID", "message": "..." }`, `400 { "code": "NO_PENDING_CHANGE", "message": "This code has expired. Please request a new one." }`

**3. Change Phone (step 1 — initiate)** — `POST /account/phone`

- Request Payload: `{ "phone": "+919876543210" }`
- Response Payload: `{ "message": "...", "maskedTarget": "..." }`

**4. Change Phone (step 2 — verify)** — `POST /account/phone/verify`

- Request Payload: `{ "otp": "123456" }`
- Response Payload: full updated `User` with new `phone`, `phoneVerified: true`
- Errors: same `OTP_INVALID` / `NO_PENDING_CHANGE` as email

**5. Change Password** — `POST /account/password`

- Trigger: `ChangePasswordDialog` submit
- Request Payload: `{ "currentPassword": "OldPass@123", "newPassword": "NewPass@123" }` (`confirmPassword` is validated client-side only, never sent)
- Response Payload: `{ "success": true }`
- Errors: `400 { "code": "INVALID_PASSWORD", "message": "Current password is incorrect." }`

**6. Delete Account** — `POST /account/delete`

- Trigger: `DeleteAccountDialog` submit (after typing "DELETE" to confirm, client-side gate only)
- Request Payload: none
- Response Payload: `{ "success": true }`
- Side effect: mock sets `user.status = "suspended"` (does not hard-delete the record); client then clears auth and navigates home.

### Tab: Notifications (`/settings/notifications`)

**1. Get Notification Preferences** — `GET /users/me/notification-preferences`

- Trigger: tab mount
- Response Payload:
  ```json
  {
    "emailEnabled": true,
    "pushEnabled": true,
    "eventReminders": true,
    "chatMentions": true,
    "clubUpdates": true,
    "paymentAlerts": true
  }
  ```
  Defaults to all-`true` if never saved.

**2. Update Notification Preferences** — `PATCH /users/me/notification-preferences`

- Trigger: toggling any switch, auto-saves after a debounce (no explicit Save button) — first hydration from the GET is skipped so it doesn't PATCH on load
- Request Payload: the **full current object** (all 6 keys), not a single-field diff — same shape as the GET response
- Response Payload: the merged, updated object

### Tab: Privacy (`/settings/privacy`)

**1. Get Privacy Settings** — `GET /users/me/privacy`

- Response Payload:
  ```json
  { "profileVisibility": "members_only", "showInDiscovery": true, "allowDmsFrom": "club_members" }
  ```
  `profileVisibility` ∈ `public|members_only|private`; `allowDmsFrom` ∈ `anyone|club_members|nobody`.

**2. Update Privacy Settings** — `PATCH /users/me/privacy`

- Trigger: changing any select/toggle, same debounced auto-save pattern as Notifications
- Request/Response: full `PrivacySettings` object

**Blocked Users list**: **not a backend call** — reads/writes `localStorage` only, and resolves display names via `GET /users/:id` per blocked id (reused from Profile page). Unblocking does not call any API today.

> ⚠️ **Flag for backend**: there is no `POST`/`DELETE /users/me/blocked-users` contract at all — needs to be specified from scratch if server-side blocking is wanted.

### Tab: Payments (`/settings/payments`)

**1. List Saved Payment Methods** — `GET /users/me/payment-methods`

- Response Payload: `SavedPaymentMethod[]` (plain array, not wrapped)
  ```json
  [
    {
      "id": "pm_ab12cd34ef",
      "userId": "usr_member01",
      "brand": "visa",
      "last4": "4242",
      "expiryMonth": 11,
      "expiryYear": 2028,
      "isDefault": true,
      "createdAt": "2026-07-01T10:00:00.000Z"
    }
  ]
  ```

**2. Add Payment Method** — `POST /users/me/payment-methods`

- Trigger: `AddPaymentMethodDialog` submit
- Request Payload: `{ "cardNumber": "4242 4242 4242 4242", "cardExpiry": "11/28", "cardCvv": "123", "cardName": "Priya Sharma" }`
  > ⚠️ **Flag for backend (security)**: the mock handler only reads `cardNumber`/`cardExpiry` and silently discards `cardName`/`cardCvv` — real backend must never persist raw PAN/CVV; ensure the real endpoint tokenizes via a PCI-compliant processor rather than accepting raw card data at all.
- Response Payload: `201`, single `SavedPaymentMethod` (brand auto-detected from first digit; `isDefault: true` only if it's the user's first saved card)

**3. Delete Payment Method** — `DELETE /users/me/payment-methods/:id`

- Request Payload: none
- Response Payload: `200`, the user's **full remaining array** of `SavedPaymentMethod[]` (not 204, not just the deleted item). If the deleted card was default, the first remaining card is auto-promoted to default.

**4. Set Default Payment Method** — `PATCH /users/me/payment-methods/:id`

- Trigger: "Set as default" link
- Request Payload: **none** (empty PATCH body — purely path-driven)
  > Confirm with backend whether an explicit `{ "isDefault": true }` body is preferred over an empty PATCH.
- Response Payload: `200`, full array with `isDefault` flipped to only the targeted id

**5. Get Billing Address** — `GET /users/me/billing-address`

- Response Payload: `BillingAddress | null` (null if never saved)
  ```json
  {
    "line1": "221B Baker Street",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560001",
    "country": "India"
  }
  ```

**6. Update Billing Address** — `PUT /users/me/billing-address` (full replace, not PATCH)

- Request Payload: `{ "line1": string, "city": string, "state": string, "postalCode": string, "country": string }` (all 5 required)
- Response Payload: the same object echoed back

---

## Page: Payments / Subscriptions (`/payments`)

**1. List My Subscriptions** — `GET /users/me/subscriptions`

- Called from: `src/features/payments/pages/SubscriptionsPage.tsx` → `useSubscriptions()`
- Response Payload: `{ "data": Subscription[] }`
  ```json
  {
    "data": [
      {
        "id": "sub_001",
        "userId": "usr_member01",
        "clubId": "clu_investors01",
        "planId": "plan_investors_annual",
        "status": "active",
        "currentPeriodStart": "2026-06-01T09:00:00.000Z",
        "currentPeriodEnd": "2027-06-01T09:00:00.000Z",
        "cancelAtPeriodEnd": false,
        "createdAt": "2026-06-01T09:00:00.000Z"
      }
    ]
  }
  ```
  `status` ∈ `active|cancelled|expired|trialing`. Note: plan name/price is **not** part of this object — it's looked up client-side from the club's `pricingPlans` (fetched via reused `GET /me/clubs`), matched by `planId`.

**2. List Transactions** — `GET /users/me/transactions`

- Request Payload (query, all optional): `{ page?: number, limit?: number, type?: 'club_joining_fee'|'club_subscription'|'event_ticket', status?: 'success'|'failed'|'pending'|'refunded'|'partially_refunded' }` — this page only ever sends `limit`
- Response Payload: `PaginatedResponse<Transaction>`
  ```json
  {
    "data": [
      {
        "id": "txn_001",
        "userId": "usr_member01",
        "clubId": "clu_investors01",
        "type": "club_subscription",
        "amount": 1499,
        "currency": "INR",
        "status": "success",
        "gateway": "mock",
        "gatewayTransactionId": "mockpay_txn_001",
        "planId": "plan_investors_annual",
        "description": "Investors — Annual Membership",
        "invoiceUrl": "#",
        "createdAt": "2026-06-01T09:05:00.000Z"
      }
    ],
    "meta": {
      "total": 4,
      "page": 1,
      "limit": 20,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
  ```
  Sorted newest-first. `eventId` appears only on `event_ticket` rows.

**3. Cancel Subscription** — `DELETE /subscriptions/:subscriptionId`

- Trigger: "Cancel" on `SubscriptionCard`, confirmed in a dialog
- Request Payload: none
- Errors: `404 { "code": "NOT_FOUND", "message": "..." }` if unknown id; `403 { "code": "FORBIDDEN", "message": "..." }` if it belongs to another user
- Side effect: sets `cancelAtPeriodEnd = true`; access remains until `currentPeriodEnd`.
  > ⚠️ **Flag for backend — real bug, needs a decision before building**: the mock's actual wire response is **enveloped**: `{ "data": { "cancelAtPeriodEnd": true, "accessUntil": "2027-06-01T09:00:00.000Z" } }`. But the frontend's service/hook typing expects the **flat**, unwrapped shape (`{ "cancelAtPeriodEnd": boolean, "accessUntil": string }`) and destructures `accessUntil` directly off the result — so today, `accessUntil` is `undefined` at runtime and the success toast shows something like "Subscription cancelled. Invalid Date." Recommend the real API return the **flat** shape (matching the frontend's types/intent), and have frontend fix the mock or the pairing before this ships.
- There is no "subscribe/upgrade/resubscribe" endpoint in this feature — that happens via the (placeholder, out-of-scope) checkout flow.

---

# Summary: Endpoint Reuse Map

| Endpoint                                                                               | First documented at | Reused at                                                                                                                                     |
| -------------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /clubs`                                                                           | Home (guest)        | Clubs browse, Search (Clubs tab)                                                                                                              |
| `GET /events`                                                                          | Home (guest)        | Home (member, "my upcoming"), Events browse, Search (Events tab), Club Landing (club's events), My Events                                     |
| `GET /clubs/:slug`                                                                     | Club Landing        | Club Dashboard Chat (access gate)                                                                                                             |
| `GET /events/:eventId`                                                                 | Public Event Detail | —                                                                                                                                             |
| `GET /me/saved-clubs`                                                                  | Club Landing        | Saved Clubs                                                                                                                                   |
| `POST /me/saved-clubs/:clubId`                                                         | Club Landing        | —                                                                                                                                             |
| `DELETE /me/saved-clubs/:clubId`                                                       | Club Landing        | Saved Clubs                                                                                                                                   |
| `POST /clubs/:clubId/join`                                                             | Club Landing        | —                                                                                                                                             |
| `POST /events/:eventId/rsvp`                                                           | Public Event Detail | —                                                                                                                                             |
| `POST /auth/verify-otp`                                                                | Login               | Signup Success/OTP Verification (purpose=signup), Forgot Password (purpose=forgot_password)                                                   |
| `POST /auth/resend-otp`                                                                | Login               | OTP Verification                                                                                                                              |
| `PATCH /users/me`                                                                      | Onboarding Step 1   | Onboarding Step 2, Edit Profile (extra fields)                                                                                                |
| `GET /users/:id`                                                                       | Profile (view)      | Messages (sender profile drawer), Settings > Privacy (blocked users display)                                                                  |
| `GET /me/clubs`                                                                        | Home (member)       | My Clubs, My Events, Messages, Profile (Clubs tab), Payments/Subscriptions                                                                    |
| `GET /me/conversations`                                                                | Home (member)       | My Clubs, My Events, Saved Clubs, Messages                                                                                                    |
| `GET /me/notifications`                                                                | Home (member)       | My Clubs, My Events, Saved Clubs, Notifications, Messages                                                                                     |
| `GET /me/invitations`                                                                  | Home (member)       | My Clubs, My Events, Saved Clubs, Invitations, Messages                                                                                       |
| `GET /clubs/:clubId/channels`                                                          | Messages            | Club Dashboard Chat                                                                                                                           |
| Message CRUD/react/vote/pin (`/channels/:channelId/messages`, `/messages/:messageId*`) | Messages            | Club Dashboard Chat (same endpoints, different channel)                                                                                       |
| `GET /content/:page` (`about`\|`services`\|`how-it-works`\|`contact`\|`legal/:slug`)   | — (one page each)   | Same response envelope (`{ data: <PageContent> }`) and error handling across all 6 content pages — see `src/mock/handlers/contentHandlers.ts` |

---

# Flags for Backend Team — Full List

1. **Contact form has no backend endpoint.** Needs to be built from scratch (`ContactPage`).
2. **People search (Search page) has no backend endpoint.** UI-stubbed only.
3. **Signup wizard only sends `fullName`/`email` to the API** — all KYC/community/document data is discarded client-side. Needs a real endpoint before backend work starts on this flow.
4. **Signup → account creation is currently broken end-to-end**: Signup Success never triggers OTP verification, and OTP verification (the only path that actually creates the user) is never navigated to. Needs the flow reconciled.
5. **OTP-based login never actually authenticates** — `verify-otp` with `purpose: "login"` doesn't return tokens today; recommend it should.
6. **Social login sends a hardcoded `"mock-code"`** instead of a real OAuth code — expected, but frontend needs updating once real OAuth exists.
7. **Auth enforcement is inconsistent across `/me/*` list endpoints**: `GET /me/invitations`, `GET /me/saved-clubs`, `GET /me/notifications`, `GET /clubs/:clubId/channels`, `GET /channels/:channelId/messages` all either silently return empty results or skip the check entirely when unauthenticated, while `GET /me/clubs` and `GET /me/conversations` correctly 401. Recommend standardizing on 401 for all of these.
8. **My Events has no server-side membership scoping** — client fetches up to 200 events and filters to the user's clubs locally. Recommend a real `GET /me/events`.
9. **Message "delete for me" is client-only** (localStorage hide-list); the `scope` field sent to `DELETE /messages/:messageId` is ignored server-side today.
10. **Chat media attachments are sent as inline base64** in the message body — needs a real upload/pre-signed-URL flow.
11. **Avatar and cover photo uploads are sent as inline base64** on `PATCH /users/me` — consider a dedicated upload endpoint.
12. **`POST /users/me/payment-methods` silently discards `cardName`/`cardCvv`** — real implementation must never persist raw card data; use a PCI-compliant tokenization flow.
13. **Cancel-subscription response envelope mismatch**: mock returns `{ data: {...} }`, frontend expects the flat shape — causes a real runtime bug (`Invalid Date` in the success toast) that needs resolving before backend build.
14. **No username-availability check or username field exists anywhere in Edit Profile**, despite `User.username` existing as a field.
15. **No "block user" backend contract exists** — blocking is entirely `localStorage`-based today.
16. **No activity-feed endpoint exists** for the Profile page's "Activity" tab.
17. **`chatService.pin`** (`POST /channels/:channelId/pin`) and **per-notification mark-read** (`POST /me/notifications/mark-read` with `ids`) exist in the service layer with no confirmed UI trigger — verify intended entry points before building.
18. **No restriction on posting into `announcement`-type chat channels** — if real backend wants to restrict these to owners/moderators, that logic doesn't exist in the mock to reference.
19. **`GET /clubs/:clubId/members` (roster)** has no auth check confirmed in this pass — verify intended requirement (likely should require active membership).
