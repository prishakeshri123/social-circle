# Social Circle — Frontend Technical Specification

## Part 2: Screen Inventory & Every Screen Specification

> **Document Series:** Part 2 of 6.
> Cross-reference: `spec-part1-foundation.md` for Executive Summary and User Journeys.
> `spec-part3-architecture.md` for component names referenced below.
>
> **Scope note:** The Admin Dashboard is already built separately and is **out of scope** for this frontend project. It covers club creation/onboarding, event creation, club settings editing, and all club/member/chat moderation screens — none of that is documented here. This app is member-facing only; the one exception is that the member who owns a club can Edit/Cancel that club's events (see S-13).

---

# Section 3 — Complete Screen Inventory

| #    | Screen Name                  | URL                                    | Auth Required            | Role         | Description                                                 |
| ---- | ---------------------------- | -------------------------------------- | ------------------------ | ------------ | ----------------------------------------------------------- |
| S-01 | Login                        | /login                                 | No                       | Guest        | Email/password login form                                   |
| S-02 | Sign Up                      | /signup                                | No                       | Guest        | Registration form (email or phone)                          |
| S-03 | OTP Verification             | /verify-otp                            | No                       | Guest        | 6-digit OTP input after signup/forgot-password              |
| S-04 | Forgot Password              | /forgot-password                       | No                       | Guest        | Request OTP to reset password                               |
| S-05 | Social Login Callback        | /auth/callback                         | No                       | Guest        | Handles OAuth redirect; spinner then redirect               |
| S-06 | Profile Setup Step 1         | /onboarding/profile                    | Yes (incomplete profile) | New Member   | Photo, name, bio                                            |
| S-07 | Profile Setup Step 2         | /onboarding/interests                  | Yes (incomplete profile) | New Member   | Interest tags, city                                         |
| S-08 | Home / Discovery Feed        | /home                                  | No                       | Guest/Member | Public club + event listings; personalised when logged in   |
| S-09 | Search                       | /search                                | Partial                  | Guest/Member | Clubs & Events tabs public; People tab requires auth        |
| S-10 | Club Landing Page            | /clubs/:slug                           | No                       | Guest/Member | Public club page (hero, about, events, FAQs)                |
| S-11 | Club Dashboard — Chat        | /clubs/:slug/dashboard/chat            | Yes                      | Member       | Group chat (default tab)                                    |
| S-12 | Club Dashboard — Events      | /clubs/:slug/dashboard/events          | Yes                      | Member       | Upcoming/past events list                                   |
| S-13 | Event Detail                 | /clubs/:slug/dashboard/events/:eventId | Yes                      | Member       | RSVP, details, attendees; Edit/Cancel for the owning member |
| S-14 | Club Dashboard — Albums      | /clubs/:slug/dashboard/albums          | Yes                      | Member       | Album grid                                                  |
| S-15 | Album Detail                 | /clubs/:slug/dashboard/albums/:albumId | Yes                      | Member       | Media grid + lightbox                                       |
| S-16 | Club Dashboard — Members     | /clubs/:slug/dashboard/members         | Yes                      | Member       | Member list                                                 |
| S-17 | Member Profile (within club) | /clubs/:slug/dashboard/members/:userId | Yes                      | Member       | Profile card + chat CTA                                     |
| S-18 | Club Dashboard — About       | /clubs/:slug/dashboard/about           | Yes                      | Member       | Club info, rules, FAQs                                      |
| S-19 | Club Dashboard — Payments    | /clubs/:slug/dashboard/payments        | Yes                      | Member       | Subscription + history                                      |
| S-20 | My Clubs Dashboard           | /my-clubs                              | Yes                      | Member       | List of joined clubs                                        |
| S-21 | 1:1 DM Inbox                 | /messages                              | Yes                      | Member       | List of DM conversations                                    |
| S-22 | 1:1 DM Thread                | /messages/:userId                      | Yes                      | Member       | Chat thread with one user                                   |
| S-23 | Notification Centre          | /notifications                         | Yes                      | Member       | All notifications list                                      |
| S-24 | User Profile                 | /profile/:userId                       | Yes                      | Member       | Public profile view                                         |
| S-25 | Edit Profile                 | /profile/edit                          | Yes                      | Member       | Edit photo, name, bio, interests                            |
| S-26 | Settings — Account           | /settings                              | Yes                      | Member       | Account info, linked socials                                |
| S-27 | Settings — Notifications     | /settings/notifications                | Yes                      | Member       | Toggle email/push preferences                               |
| S-28 | Settings — Privacy           | /settings/privacy                      | Yes                      | Member       | Visibility, blocked users                                   |
| S-29 | Settings — Payments          | /settings/payments                     | Yes                      | Member       | Saved cards, billing info                                   |
| S-30 | Subscription Management      | /subscriptions                         | Yes                      | Member       | Active paid club subs                                       |
| S-31 | Checkout                     | /checkout/:planId                      | Yes                      | Member       | Payment gateway (mock)                                      |
| S-32 | Payment Success              | /checkout/success                      | Yes                      | Member       | Confirmation + next steps                                   |
| S-33 | Payment Failure              | /checkout/failure                      | Yes                      | Member       | Error + retry                                               |
| S-34 | 404 Not Found                | /*                                     | No                       | Anyone       | Generic not-found                                           |
| S-35 | 401 Unauthorized             | /unauthorized                          | No                       | Anyone       | Access denied                                               |
| S-36 | 500 / Maintenance            | /maintenance                           | No                       | Anyone       | Server error / maintenance                                  |
| S-37 | Public Event Detail          | /clubs/:slug/events/:eventId           | No                       | Guest/Member | Public event info; RSVP/Buy gated                           |

---

# Section 13 — Every Screen Specification

## S-01 · Login

**Purpose:** Authenticate an existing user with email + password or phone + OTP.

**Layout:** Centered card on a gradient or branded background. Max-width 440 px. Vertically centered on viewport.

**Sections:**

1. Logo + "Welcome back" heading
2. Email/Phone input
3. Password input (with show/hide toggle)
4. "Remember me" checkbox + "Forgot password?" link
5. Primary CTA: "Log In"
6. Divider: "or continue with"
7. Social login buttons: Google, Apple, Facebook
8. Footer: "Don't have an account? Sign up"

**Components:** `AuthCard`, `TextInput`, `PasswordInput`, `Checkbox`, `Button`, `SocialLoginButton`, `Logo`

**Interactions:**

- Tab order: email → password → remember-me → submit
- Enter on password field submits form
- Failed login increments error counter; after 5 failures show "Account temporarily locked. Try again in 30 minutes."
- Social login buttons trigger mock OAuth (redirect + callback simulation)

**Validations:**

- Email: required, valid format OR phone: required, valid E.164
- Password: required, min 1 char (login — not signup strength check)

**Error Messages:**

- `Invalid email or password. Please try again.`
- `Account temporarily locked. Try again in 30 minutes.`

**Animations:** Card fades in with `framer-motion` `fadeInUp` (200 ms). Input error shake (200 ms).

**Responsive:** Full-screen centered card on all breakpoints; social buttons stack vertically on < 360 px.

**Loading:** Submit button shows spinner + "Logging in…"; inputs disabled.

**Empty State:** N/A

**Error State:** Inline error beneath the form; toast for network error.

**Permissions:** Redirects to `/home` if already authenticated.

**Accessibility:** All inputs have `aria-label`; error messages bound with `aria-describedby`; focus auto-set to email input on mount; WCAG AA contrast on all text.

**Keyboard Navigation:** Full tab-order; Enter submits; Escape clears errors.

**SEO:** `<title>Log In | Social Circle</title>`, noindex (auth page).

**Performance:** Auth card is in initial bundle (no lazy load); background image uses `loading="lazy"` and is decorative only.

---

## S-02 · Sign Up

**Purpose:** Create a new account.

**Layout:** Same centered card as Login. Slightly taller (email + phone + password + confirm password + terms).

**Sections:**

1. Logo + "Create your account"
2. Full Name input
3. Email input
4. Phone input (optional if email provided, or vice versa)
5. Password input (with strength meter)
6. Confirm Password
7. Terms & Privacy checkbox
8. CTA: "Create Account"
9. Social login divider + buttons
10. "Already have an account? Log in"

**Validations (Zod schema):**

- `fullName`: required, min 2 chars, max 100 chars
- `email`: required if no phone, valid RFC 5322 format
- `phone`: required if no email, E.164 format
- `password`: min 8 chars, ≥1 uppercase, ≥1 number, ≥1 special char
- `confirmPassword`: must match `password`
- `terms`: must be `true`

**Password Strength Meter:** 4 levels: Weak (red) / Fair (orange) / Good (yellow) / Strong (green). Calculated client-side using entropy heuristics.

**Flow:** On success → redirect to `/verify-otp?channel=email&masked=j***@gmail.com`

**Error State:** Inline field errors (Zod); toast "Email already registered" → links to login.

**Accessibility:** Password strength meter includes `aria-live` region announcing current strength.

---

## S-03 · OTP Verification

**Purpose:** Verify phone/email via a 6-digit one-time passcode.

**Layout:** Centered card. Six individual digit input boxes side by side.

**Sections:**

1. Icon (envelope or phone) + "Verify your [email/phone]"
2. Sub-heading: "We sent a 6-digit code to j***@gmail.com. Change"
3. Six OTP input boxes (auto-advance on digit entry)
4. "Verify" button (auto-submits on 6th digit)
5. "Resend code" link (disabled for 60-s countdown; countdown timer displayed)
6. Mock hint in dev: "Your code is 123456"

**Interactions:**

- Backspace in a box moves focus to previous box
- Paste 6 digits fills all boxes instantly
- Auto-submit on last digit
- Wrong OTP → shake animation + red border + error message
- After 3 wrong attempts: "Too many attempts. Please wait 5 minutes."

**Accessibility:** Each digit box has `aria-label="Digit 1"` through `"Digit 6"`. `aria-live` region for errors.

---

## S-04 · Forgot Password

**Purpose:** Initiate a password reset via email or phone OTP.

**Layout:** Centered card, 2-step inline flow (no page change).

**Step 1:** Enter email or phone → "Send OTP"
**Step 2 (same card):** OTP input → "Verify"
**Step 3 (same card):** New password + confirm + "Reset Password"

**Validations:** Step 1 same as Sign Up field rules. Step 3 same password strength rules.

**Flow:** On success → redirect `/login` with success toast "Password reset successfully. Please log in."

---

## S-05 · Social Login Callback

**Purpose:** Handle the OAuth redirect and complete authentication.

**Layout:** Full-screen centered spinner with "Completing sign in…" label.

**Logic (mock):**

1. Read query params (`?provider=google&code=…`)
2. Simulate 1.5 s delay (mock API call)
3. If first-time social login → redirect to `/onboarding/interests` (skip profile step 1 as name + photo come from provider)
4. If returning user → redirect to `/home` or `?next` param

**Error State:** "Sign in failed. Please try again." with a "Back to Login" link.

---

## S-06 · Profile Setup — Step 1 (Photo, Name, Bio)

**Purpose:** Collect the essential profile data immediately after registration.

**Layout:** Centered stepper card. Progress indicator "1 of 2" at top.

**Sections:**

1. Avatar upload circle (click to pick file; drag to upload)
   - Crop modal on upload (square crop, 400×400)
   - Default: coloured initial avatar if no photo
2. Full Name input (pre-filled if social login)
3. Bio textarea (160-char counter)
4. "Next →" button (primary)
5. "Skip for now" text link (only Bio can be skipped; Name is required)

**Validations:**

- `fullName`: required, min 2 chars
- `bio`: optional, max 160 chars
- Photo: optional, max 5 MB, jpg/png/webp

**Accessibility:** Avatar upload has `aria-label="Upload profile photo"`. Char counter has `aria-live="polite"`.

---

## S-07 · Profile Setup — Step 2 (Interests, City)

**Purpose:** Collect interest tags for personalised club recommendations.

**Layout:** Same stepper card. Progress "2 of 2".

**Sections:**

1. "What are you interested in?" heading
2. Interest category chips (multi-select, toggling on/off)
   - Categories (from mock): Sports, Music, Tech, Gaming, Travel, Food, Arts, Photography, Books, Alumni, Professional, NGO, Outdoors, Fitness, Films
   - At least 1 required
3. City / Region input (text autocomplete, mock suggestions)
4. "Finish Setup" button
5. "Skip" text link (goes to Discovery with degraded recommendations)

**Interactions:** Chips animate (scale + colour) on select. Selected count shown: "3 selected".

**On Complete:** Redirect to `/home` with welcome banner: `"Welcome, {name}! Here are clubs you might love."`

---

## S-08 · Home / Discovery Feed (Public Landing Page)

**Purpose:** The app's homepage — public for everyone (like a BookMyShow/Amazon homepage), and the primary discovery surface for club and event recommendations. Personalises when the visitor is logged in; shows real, generic listings otherwise.

**Layout:** Two-column desktop (sidebar + main content area) once authenticated. Full-width single-column marketing + listings layout for guests. Single column on mobile either way.

**Sections (top to bottom):**

1. **Header:** Guest — logo, nav links (Explore, Events, About), "Sign In" + "Join / Create Account" buttons. Member — search bar (links to `/search`), notification bell with badge, avatar menu.
2. **Hero Banner (guest only):** Headline + subheadline + "Explore Clubs" / "Browse Events" CTAs. Replaced by the existing **Welcome Banner** (dismissable, first visit only) once logged in.
3. **Stats Strip (guest only, P2):** Active clubs, members, events hosted — social proof.
4. **Category Filter Strip:** Horizontal scrollable chip row (All, Sports, Music, Tech, …) — usable without login.
5. **Filter & Sort Row:** "Free / Paid" toggle, city filter, sort dropdown (Recommended / Newest / Most Members) — usable without login.
6. **Upcoming Events Strip:** Horizontal scroll of real `<EventCard>` components (date, club, title, venue, time, price) pulled from the mock events API. "View all events →" links to `/search?tab=events`.
7. **Club Grid:** Responsive grid (3 cols desktop, 2 cols tablet, 1 col mobile) of `<ClubCard>` components — personalised ranking if authenticated, trending/generic ranking if guest.
8. **Load More / Infinite Scroll:** "Load 12 more" button or IntersectionObserver trigger.
9. **How It Works (guest only, P2):** Browse → Sign Up → Join/RSVP → Connect, 4-step strip.
10. **Testimonials / FAQ / Newsletter Signup / Footer (guest only, P2):** Marketing sections matching the reference site; hidden once logged in.

**Club Card Component:**

```
┌─────────────────────────────────┐
│ [Cover Image — 16:9]            │
│                     [FREE/PAID] │
├─────────────────────────────────┤
│ [Club Logo 32px] Club Name      │
│ Category Badge  •  📍 City      │
│ Short tagline text              │
│ 👥 142 members                  │
│                    [Join →]     │
└─────────────────────────────────┘
```

**Event Card Component:**

```
┌─────────────────────────────────┐
│ [Cover Image — 16:9]            │
├─────────────────────────────────┤
│ 01 Aug  ·  Club Name            │
│ Event Title                     │
│ 📍 Venue  ·  🕐 6:00 PM          │
│ FREE / ₹499        [RSVP →]     │
└─────────────────────────────────┘
```

**Loading State:** 9 skeleton `<ClubCardSkeleton>` components (and `<EventCardSkeleton>` for the events strip) rendered via Suspense.

**Empty State:** Illustration + "No clubs match your filters yet. Try adjusting your interests or check back soon." + "Clear filters" button.

**Error State:** "Failed to load clubs. Please refresh." with retry button.

**Permissions:** Public — no authentication required to view. The **Join** CTA on a club card and the **RSVP** CTA on an event card both call `useRequireAuth()` (see Part 1 F-39): if the visitor is logged out, clicking either navigates to `/login?next=<current-url>&intent=join|rsvp` instead of performing the action. Personalisation (ranking, Welcome Banner, "My Clubs" shortcuts) is the only part of this screen gated on auth state — it degrades gracefully to a generic/trending view for guests, it never blocks the page.

**Accessibility:** Club/event cards are `<article>` elements. Images have descriptive `alt`. Filter chips use `role="group"` with `aria-label="Filter by category"`.

**Performance:** Virtual list (react-virtual) for > 50 items. Images use `loading="lazy"` and `srcset` for responsive images.

**SEO:** `<title>Discover Clubs & Events | Social Circle</title>`. Meta description summarises the platform. Indexed (see Part 5 §21.5).

---

## S-09 · Search

**Purpose:** Global search across clubs, events, and members.

**Layout:** Full-page search with results split by tab (Clubs / Events / People).

**Sections:**

1. Search input bar (auto-focused on mount, keyboard shortcut: `/` from any page)
2. Tab bar: Clubs | Events | People
3. Filter panel (collapsible, left side on desktop): Category, Free/Paid, City, Date range (for Events)
4. Results grid/list (same `ClubCard`, `EventCard`, `PersonCard` components)
5. Recent Searches (shown when input is empty, stored in localStorage)
6. Search Suggestions (debounced 300 ms, mock API autocomplete)

**Interactions:**

- Debounce: search fires after 300 ms of no input change
- Minimum 2 chars to trigger search
- ESC key clears input and returns focus to previous screen
- Each result card is keyboard-navigable

**Permissions:** Clubs and Events tabs are public — no authentication required. The **People** tab requires an account (privacy): if a logged-out visitor selects the People tab, navigate to `/login?next=/search&intent=search-people` instead of rendering results. Result-level gated actions (Join, RSVP) use the same `useRequireAuth()` pattern as S-08.

**Empty State (no results):** "No results for '{query}'. Try different keywords or browse categories."

**Empty State (no query):** Recent searches list + "Popular clubs" suggestion row.

**Accessibility:** `role="search"` on form. `aria-live="polite"` on result count ("Showing 12 results for 'yoga'").

---

## S-10 · Club Landing Page (Public)

**Purpose:** SEO-friendly branded page showcasing a club to potential members (and existing members).

**Layout:** Full-width single-column editorial layout. Sticky top bar on scroll.

**Sections:**

### Hero

```
┌──────────────────────────────────────────────────────────┐
│              [Cover Banner — full width, 40vh]           │
│  [Club Logo 80px]  Club Name            [Share] [•••]   │
│  Category | City | 🔒 Private / 🌐 Public               │
│  Short tagline                                           │
│  ──────────────────────────────────────────────          │
│  [Join Free]  or  [Buy Membership — ₹499/yr]            │
└──────────────────────────────────────────────────────────┘
```

### About Section

Rich-text content authored via the Admin Dashboard. Max 2 paragraphs visible; "Read more" expands.

### Highlights / Stats Strip

Horizontal chip row: "📅 Weekly meetups" | "👥 500+ members" | "📍 Mumbai" | "🏆 Founded 2021"

### Photo Gallery Preview

Masonry grid of up to 9 preview images. "View all →" opens full album.

### Upcoming Events Strip

Horizontal scroll of upcoming `<EventCard>` components (3 visible). "See all events →"

### Members Preview

Row of avatar circles (up to 12) + "+488 others" label. Member count badge.

### Reviews / Testimonials (optional)

2-3 quote cards with member name + avatar (if populated via the Admin Dashboard).

### FAQs

Accordion component. Up to 10 question/answer pairs.

### Social Share Bar

"Share this club:" + copy link button + WhatsApp / Twitter / LinkedIn icon buttons.

**Sticky Bottom Bar (Mobile only):**
Positioned `fixed bottom-0`: club name + [Join] button. Hidden on scroll up, visible on scroll down.

**Auth logic:**

- Guest: shows Join / Buy buttons
- Logged-in member (not joined): same as guest
- Logged-in member (joined): Join button → "View Club →" deep-link to dashboard

**SEO:**

- `<title>{Club Name} — {Tagline} | Social Circle</title>`
- `<meta name="description">` = first 160 chars of About
- Open Graph: `og:image` = cover banner, `og:title`, `og:description`
- Twitter Card: `summary_large_image`
- JSON-LD: `Organization` schema with name, url, logo, description

---

## S-11 · Club Dashboard — Chat

**Purpose:** The primary engagement screen for club members — real-time group messaging.

**Layout:** Three-panel layout (desktop): Left = channel list, Centre = message thread, Right = member info panel (collapsible).

```
┌──────────────────────┬──────────────────────────────┬────────────────┐
│ CHANNELS             │  # general               🔍  │ Members        │
│ # general      ●     │ ─────────────────────────── │ Online (3)     │
│ # announcements      │ [Avatar] Alice               │ [Avatar] Alice │
│ # event-planning     │ "Hey everyone! Excited for   │ [Avatar] Bob   │
│                      │  the weekend run 🏃"  10:30  │ [Avatar] Carol │
│ DIRECT MESSAGES      │                              │                │
│ 👤 Bob        2      │           [Avatar] Me        │                │
│ 👤 Carol             │  "I'll be there! See you     │                │
│                      │   at 6 AM."       10:32 ✓✓  │                │
│                      │                              │                │
│                      │ ─────────────────────────── │                │
│                      │ [😊][📎][🎤] Type a message │                │
└──────────────────────┴──────────────────────────────┴────────────────┘
```

**Mobile Layout:** Single column. Channel list accessed via left drawer. Member list via right drawer.

**Message Bubble Anatomy:**

- Others: avatar (32 px) + name (bold) + timestamp + message + reaction bar
- Own messages: right-aligned, no avatar, blue background, sent/delivered/read ticks
- Long-press (mobile) / right-click (desktop): context menu (Reply / React / Edit / Delete / Copy / Report)

**Supported Message Types:**

- Text (with emoji, @mentions auto-linked, URLs auto-linked as preview cards)
- Image (inline thumbnail, click to expand)
- Video (inline player with thumbnail)
- Document (file icon + name + size + download button)
- Voice note (waveform + play/pause + duration)
- Poll (options with live percentage bars, vote button)

**Interactions:**

- Typing indicator: "Alice is typing…" appears beneath last message
- Scroll to bottom FAB when user scrolls up (shows unread count)
- Message search: drawer slides in from top, highlights matches in thread
- Pinned message (if set via the Admin Dashboard): read-only sticky bar at top of message area — no in-app pin/unpin control here

**Loading State:** Message list skeleton (alternating left/right bubbles, 8 items).

**Empty State (new channel):** "👋 This is the beginning of #channel-name. Start the conversation!"

**Offline State:** Yellow banner "You're offline. Messages will send when you reconnect." Queued messages show a clock icon instead of ticks.

**Permissions:** All members: read, send, reply, react, edit own message (15-min window), delete own message (for me / for everyone). Chat moderation (deleting others' messages, pin management, "Admins-only" mode) lives in the Admin Dashboard — not available here.

---

## S-12 · Club Dashboard — Events

**Purpose:** List all events and meetings for the club; entry point for RSVP.

**Layout:** Tab within club dashboard. Filter bar + card grid.

**Sections:**

1. Filter tabs: Upcoming | Past | Cancelled
2. Sort: Date (default) | Title
3. Event cards grid (2 cols desktop, 1 col mobile)

**Event Card:**

```
┌──────────────────────────────────┐
│ [Cover Image — 16:9]             │
│ 📅 Sat, 2 Aug 2026 · 6:00 AM    │
│ Event Title                      │
│ 📍 Bandra Bandstand OR 🎥 Zoom   │
│ 👥 24 going · 8 interested       │
│ [FREE] or [₹299]                 │
│ [RSVP →]                         │
└──────────────────────────────────┘
```

**Empty State (Upcoming):** "No upcoming events. Check back soon."

---

## S-13 · Event Detail

**Purpose:** Full event information, RSVP controls, and — for the member who owns this event's club — light edit/cancel control. Event creation happens entirely in the Admin Dashboard; it is not documented here. This is the authenticated, in-dashboard view — see S-37 for the public, pre-login version reached before joining the club.

**Layout:** Single-column editorial. Hero image at top.

**Sections:**

1. Cover image (full-width, max 40vh)
2. Event title + badge (Free/Paid, Upcoming/Past)
3. Date / Time / Timezone row
4. Location (address + embedded map, OR virtual link with "Copy link" button)
5. Description (rich text)
6. RSVP section: "Going / Interested / Not Going" segmented button; current counts
7. Ticket purchase flow (for paid events, inline checkout widget)
8. Add to Calendar: Google | Apple | iCal (.ics download)
9. Attendees section: Avatar stack + "X going, Y interested"; full list (expandable)
10. (Owner of this event's club only) Edit Event | Cancel Event

**RSVP State Machine:**

```
[Not RSVPed] → click "Going" → [Going] (optimistic)
[Going] → click "Not Going" → confirmation dialog → [Not Going]
```

**Paid Event Ticket Flow:**

1. Click "Buy Ticket — ₹299"
2. Mini-checkout widget slides in (Framer Motion slide-up)
3. Shows plan summary + payment methods mock buttons
4. "Pay Now" → mock 2s loading → redirect to `/checkout/success`

**Permissions:** All members: view, RSVP, buy tickets, add to calendar. The member who owns this event's club (`ClubMembership.role === 'owner'`) also sees:

- **Edit Event** — opens a modal covering title, description, cover image, date & time, timezone, location, capacity, and RSVP deadline only (matches `eventEditSchema`, Part 5 §14.2). Ticket pricing/type/quantity, visibility, and recurrence are not editable here.
- **Cancel Event** — confirmation dialog, then cancels the event and notifies attendees.

---

## S-14 · Club Dashboard — Albums

**Purpose:** Media gallery organised by album (per-event or general).

**Layout:** Grid of album cover cards.

**Album Card:** Cover image, album name, date, media count badge.

**Create Album button:** Visible to all members; floats above grid (FAB on mobile).

---

## S-15 · Album Detail

**Purpose:** View all media in a specific album; interact with individual items.

**Layout:** Masonry grid (3 cols desktop, 2 cols tablet, 1 col mobile) of media thumbnails.

**Lightbox:** Clicking any item opens a full-screen modal:

- Left/right arrows (keyboard: ← →)
- ESC to close
- Caption below image
- Like (heart) + comment button in right panel
- Download button (if allowed by club settings)
- Share button (copy link)

**Upload Media Flow:**

1. "Upload Photos / Videos" button opens file picker (or drag-and-drop zone on desktop)
2. Multiple files selected simultaneously
3. Per-file upload progress bar
4. After upload: new items appear in grid with optimistic insertion

**Permissions:** Upload open to all members.

---

## S-16 · Club Dashboard — Members

**Purpose:** Browse and manage club membership.

**Layout:** Search bar + sortable list/grid.

**Member Card (list view):** Avatar, Name, "Member since" date, Online indicator, "Message" button.

**Filters:** All / Online

---

## S-17 · Member Profile (Within Club Context)

**Purpose:** View a member's profile and initiate 1:1 chat.

**Layout:** Modal drawer (slides in from right on desktop; full-screen sheet on mobile).

**Sections:** Avatar, Name, Bio, "Member since" date, Clubs in common, Recent activity in this club, "Send Message" button, "Block" option.

---

## S-18 · Club Dashboard — About

**Purpose:** Static info tab with the club's full description, rules, and FAQs.

**Layout:** Two-column (sidebar with club stats + main content) on desktop; single column mobile.

**Sections:** About (rich text), Mission, Code of Conduct, Highlights chips, Club details (founded, language, city), FAQs accordion.

---

## S-19 · Club Dashboard — Payments

**Purpose:** Member's payment history and subscription management for this specific paid club.

**Layout:** Tab within club dashboard.

**Sections:**

1. Current Plan card: Plan name, price, next renewal date, status badge (Active / Expired / Cancelled)
2. "Upgrade Plan" or "Cancel Subscription" actions
3. Transaction history table: date, description, amount, status, "Download Receipt" link

**Cancel Flow:** Confirmation modal with "Your access continues until {date}" message.

---

## S-20 · My Clubs Dashboard

**Purpose:** Overview of all clubs the user has joined.

**Layout:** Grid or list view toggle. Cards grouped by (optional) "Most Recent Activity".

**Club Entry Card:**

```
[Club Logo] Club Name
Category badge | member count
Unread chat count badge
Last message preview (truncated)
```

**CTA:** Click → opens club dashboard default tab (Chat).

**Empty State:** "You haven't joined any clubs yet. [Discover clubs →]"

---

## S-21 · 1:1 DM Inbox

**Purpose:** All direct message conversations.

**Layout:** Left panel = conversation list; Right panel = selected thread (same layout as Group Chat but 2-panel).

**Conversation List Item:** Avatar, Name, Last message snippet, Timestamp, Unread badge.

**Empty State:** "No conversations yet. Find a club member and start chatting."

---

## S-22 · 1:1 DM Thread

**Purpose:** Private conversation between two members.

**Layout:** Identical to Group Chat (S-11) but without channel list. Header shows contact name + online status.

**Features:** All message types from group chat minus polls. Block/Report from header menu.

---

## S-23 · Notification Centre

**Purpose:** Centralised list of all in-app notifications.

**Layout:** Full-page list, filter tabs.

**Filter Tabs:** All | Club Activity | Events | Payments | System

**Notification Item:**

```
[Icon based on type] Title (bold if unread)
                     Preview text
                     2 hours ago          [→]
```

**Notification Types + Icons:**

- Club joined → 🎉
- New event created → 📅
- Event reminder (24h/1h) → ⏰
- Event RSVP response → ✅
- Payment received → 💳
- Subscription renewal reminder → 🔔
- Chat @mention → 💬

**Mark All Read:** Button in header.

**Click behaviour:** Each notification deep-links to the relevant screen.

**Empty State:** "You're all caught up! 🎉 No new notifications."

---

## S-24 · User Profile

**Purpose:** Public-facing profile page for any member.

**Layout:** Profile hero + tabbed content.

**Hero:** Cover photo (optional), avatar (large), name, bio, interest tags, "Member since" date, Clubs count, "Message" button (if not own profile).

**Tabs:** Clubs (cards of joined clubs) | Activity (recent posts/comments)

---

## S-25 · Edit Profile

**Purpose:** Allow user to update their own profile.

**Layout:** Single-column form within settings-style shell.

**Fields:** Avatar (re-upload/crop), Cover Photo (optional), Full Name, Bio (160 char), Interests (tag chips), City/Region, Website URL (optional), Social links (Twitter, LinkedIn, Instagram — optional).

**Save:** Optimistic update via TanStack Query mutation; toast "Profile updated successfully."

---

## S-26 through S-29 · Settings Screens

### S-26 · Settings — Account

- Email address (with "Change" flow requiring OTP)
- Phone number (with "Change" flow)
- Linked social accounts (Google / Apple / Facebook — connect/disconnect)
- Delete Account (danger zone, confirmation with typed "DELETE")

### S-27 · Settings — Notifications

Toggle grid: each row = notification type; columns = Email / Push / In-App

| Notification       | Email | Push | In-App |
| ------------------ | ----- | ---- | ------ |
| New club activity  | ☐     | ☑    | ☑      |
| Event reminders    | ☑     | ☑    | ☑      |
| Chat @mentions     | ☐     | ☑    | ☑      |
| Payment receipts   | ☑     | ☐    | ☑      |
| Club announcements | ☐     | ☑    | ☑      |

Saved with debounce (500 ms) auto-save; no explicit "Save" button needed.

### S-28 · Settings — Privacy

- Profile visibility: Public / Members only / Private
- Show in discovery: Yes / No
- Allow DMs from: Anyone / Club members only / Nobody
- Blocked users list with "Unblock" action

### S-29 · Settings — Payments

- Saved cards (last 4 digits, expiry, type — all masked; delete button)
- Add new card (mock form)
- Default payment method selector
- Billing address

---

## S-30 · Subscription Management

**Purpose:** Overview of all active paid club subscriptions.

**Layout:** Card list per subscription.

**Subscription Card:**

- Club logo + name
- Plan name + price + billing cycle
- Status badge: Active (green) / Expiring soon (orange) / Expired (red) / Cancelled (grey)
- Next renewal date
- "Manage" → links to club Payments tab (S-19)
- "Cancel" quick action with confirmation

---

## S-31 · Checkout

**Purpose:** Mock payment gateway flow for club membership or event ticket purchase.

**Layout:** Two-column: left = order summary; right = payment form.

**Sections:**

1. Order Summary: club name, plan name, price breakdown (subtotal, platform fee if applicable, total), discount code field
2. Payment Method tabs: UPI | Debit/Credit Card | Net Banking | Wallet
3. Selected method form (UPI: enter UPI ID; Card: number/expiry/CVV mock inputs; others: mock)
4. "Pay ₹{total}" button
5. SSL / secure payment badges

**Interaction:** "Pay" triggers 2-second mock loading animation → redirect to S-32 or S-33.

**Accessibility:** All payment inputs have `autocomplete` attributes set correctly; no real payment data handled.

---

## S-32 · Payment Success

**Purpose:** Confirmation screen after successful payment.

**Layout:** Centered success card with confetti animation (Framer Motion).

**Content:**

- ✅ Large success icon (animated checkmark)
- "Payment Successful!" heading
- Summary: Club name, plan, amount, transaction ID
- "Download Receipt" button (mock PDF)
- "Go to Club →" primary CTA
- "Go to Home" secondary link

---

## S-33 · Payment Failure

**Purpose:** Error screen when payment fails.

**Content:**

- ❌ Error icon
- "Payment Failed" heading
- Error reason (mock: "Your card was declined. Please check your details.")
- "Try Again" → returns to checkout with method pre-selected
- "Choose Different Method" → returns to checkout, method tab reset
- "Contact Support" link

---

## S-34 · 404 Not Found

**Layout:** Centered illustration card.

**Content:**

- Large "404" number with animated Framer Motion glitch effect
- "Page not found"
- "The page you're looking for doesn't exist or has been moved."
- "Go to Home" button + "Go back" link

---

## S-35 · 401 Unauthorized

**Content:**

- Lock icon + "Access Denied"
- "You don't have permission to view this page."
- "Go to Home" button
- Show login button if not authenticated

---

## S-36 · 500 / Maintenance

**Content:**

- Wrench/construction icon
- "We're currently down for maintenance."
- Estimated return time (if configured in env var)
- Auto-refresh every 30 s; shows countdown

---

## S-37 · Public Event Detail

**Purpose:** Guest-safe, SEO-indexed event page reachable without logging in — the event equivalent of S-10's public Club Landing Page. Lets a visitor evaluate a specific event before signing up, matching how BookMyShow/Amazon expose event/product pages pre-login.

**Layout:** Single-column editorial, same visual language as S-10.

**Sections:**

1. Cover image (full-width, max 40vh)
2. Event title + badge (Free/Paid)
3. Date / Time / Timezone row
4. Location (address, OR "Virtual event" label — no map/link exposed pre-auth)
5. Organising club: logo + name, links to `/clubs/:slug`
6. Description (rich text, same content as S-13)
7. Price (Free or amount) + spots-left indicator if capacity is set
8. RSVP / Get Tickets CTA

**Auth logic:**

- Guest → CTA click triggers `useRequireAuth()` (Part 1 F-39): navigates to `/login?next=<event-url>&intent=rsvp` (free) or `intent=buy` (paid).
- Logged-in, not yet RSVP'd/member → same gate applies if the event's club requires membership to RSVP; otherwise RSVP proceeds directly.
- Logged-in and already RSVP'd/attending → CTA becomes "View in Club Dashboard →", deep-links to S-13 (`/clubs/:slug/dashboard/events/:eventId`).

**Not shown here (S-13 only):** attendee list, comments, "Add to Calendar", and the owning member's Edit/Cancel Event controls.

**SEO:**

- `<title>{Event Title} — {Club Name} | Social Circle</title>`
- `<meta name="description">` = first 155 chars of description
- Open Graph + Twitter Card tags (same pattern as S-10)
- JSON-LD: `Event` schema (name, startDate, location, offers, image) — see Part 5 §21.4

---

_End of Part 2. Continue with `spec-part3-architecture.md` for Frontend Architecture, Routing, State Management, Component Library, and UI Design System._
