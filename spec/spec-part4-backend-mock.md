# Social Circle -- Frontend Technical Specification

## Part 4: Mock Backend / Data Models / API Contract / Authentication / Notifications

> **Document Series:** Part 4 of 6.
> Cross-reference: `spec-part3-architecture.md` (service layer, Axios setup), `spec-part5-quality.md` (form validation schemas).

---

# Section 9 -- Mock Backend Architecture

## 9.1 Strategy

All API calls during development use **axios-mock-adapter** to intercept Axios requests and return local mock data. This approach means:

- Zero changes to service files when switching to a real API (only the `mockAdapter.ts` file is removed)
- Network tab in DevTools shows the requests (visible to devs)
- Mock delay can be configured (default: 400 ms) to simulate network latency

## 9.2 Mock Folder Structure

```
src/mock/
+-- data/
|   +-- users.json
|   +-- clubs.json
|   +-- events.json
|   +-- albums.json
|   +-- messages.json
|   +-- notifications.json
|   +-- transactions.json
|   \-- categories.json
|
+-- handlers/
|   +-- authHandlers.ts
|   +-- clubHandlers.ts
|   +-- eventHandlers.ts
|   +-- chatHandlers.ts
|   +-- albumHandlers.ts
|   +-- notificationHandlers.ts
|   +-- paymentHandlers.ts
|   \-- profileHandlers.ts
|
\-- index.ts              # Registers all handlers on the Axios mock adapter
```

## 9.3 Mock Adapter Setup

```ts
// src/services/mockAdapter.ts
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './apiClient';
import { registerAuthHandlers } from '@/mock/handlers/authHandlers';
// ... other handler imports

const mock = new MockAdapter(apiClient, {
  delayResponse: 400,
  onNoMatch: 'throwException', // Catch unregistered routes in dev
});

if (import.meta.env.DEV) {
  registerAuthHandlers(mock);
  registerClubHandlers(mock);
  // ... register all handlers
}

export { mock };
```

## 9.4 Pagination Convention

All list endpoints support:

```
GET /api/clubs?page=1&limit=12&sort=createdAt&order=desc&category=sports&type=free
```

Response wrapper:

```json
{
  "data": [],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 12,
    "totalPages": 13,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

Mock handler pattern:

```ts
mock.onGet(/\/api\/clubs/).reply((config) => {
  const url = new URL(config.url!, 'http://localhost');
  const page = parseInt(url.searchParams.get('page') ?? '1');
  const limit = parseInt(url.searchParams.get('limit') ?? '12');
  const category = url.searchParams.get('category');

  let results = clubs.filter((c) => !category || c.category === category);
  const total = results.length;
  const paginated = results.slice((page - 1) * limit, page * limit);

  return [
    200,
    {
      data: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    },
  ];
});
```

## 9.5 Sorting & Filtering

All mock handlers support these query params where relevant:

| Param      | Type             | Example           |
| ---------- | ---------------- | ----------------- |
| `page`     | number           | `page=2`          |
| `limit`    | number           | `limit=20`        |
| `sort`     | string           | `sort=createdAt`  |
| `order`    | `asc` or `desc`  | `order=desc`      |
| `search`   | string           | `search=yoga`     |
| `status`   | string           | `status=live`     |
| `category` | string           | `category=sports` |
| `type`     | `free` or `paid` | `type=paid`       |
| `from`     | ISO date         | `from=2026-01-01` |
| `to`       | ISO date         | `to=2026-12-31`   |

---

# Section 10 -- Data Models

## 10.1 User

```ts
// types/user.types.ts
export interface User {
  id: string; // "usr_abc123"
  email: string;
  phone?: string;
  fullName: string;
  username: string; // Auto-generated slug
  avatarUrl?: string;
  coverPhotoUrl?: string;
  bio?: string;
  city?: string;
  interests: string[]; // Category slugs
  websiteUrl?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  status: 'active' | 'suspended' | 'banned';
  emailVerified: boolean;
  phoneVerified: boolean;
  profileComplete: boolean;
  joinedAt: string; // ISO 8601
  lastActiveAt: string;
  clubsJoined: number;
  linkedProviders: ('google' | 'apple' | 'facebook')[];
}

// There is no global role on User -- this app has one audience (members).
// The only place ownership matters is per-club, via ClubMembership.role
// (see §10.3), used solely to show/hide the Edit/Cancel Event actions.

// Validation Rules:
// - id: prefixed with "usr_" + nanoid
// - email: RFC 5322, unique
// - phone: E.164 format, unique if provided
// - fullName: 2-100 chars, no special chars except hyphen/apostrophe
// - username: 3-30 chars, alphanumeric + underscore, unique
// - bio: max 160 chars
// - interests: array of valid category slugs, min 1 after onboarding
```

**Example mock data (`users.json` excerpt):**

```json
{
  "id": "usr_h7k2p9",
  "email": "alice@example.com",
  "fullName": "Alice Sharma",
  "username": "alice_sharma",
  "avatarUrl": "https://picsum.photos/seed/alice/200",
  "bio": "Runner, bookworm, and weekend chef.",
  "city": "Mumbai",
  "interests": ["sports", "books", "food"],
  "status": "active",
  "emailVerified": true,
  "phoneVerified": false,
  "profileComplete": true,
  "joinedAt": "2026-01-15T09:30:00Z",
  "lastActiveAt": "2026-07-24T18:42:00Z",
  "clubsJoined": 4,
  "linkedProviders": ["google"]
}
```

---

## 10.2 Club

```ts
export interface Club {
  id: string; // "clu_xyz789"
  slug: string; // URL-friendly, unique
  name: string;
  tagline?: string;
  category: string; // Category slug
  tags: string[];
  city?: string;
  language: string; // e.g., "en"
  privacy: 'public' | 'private' | 'invite_only';
  status: ClubStatus;
  type: 'free' | 'paid';
  ownerId: string; // User.id
  memberCount: number;
  logoUrl?: string;
  bannerUrl?: string;
  brandColor?: string; // Hex
  galleryImages: string[]; // Up to 8 image URLs
  introVideoUrl?: string;
  about?: string; // Rich text HTML (sanitised)
  mission?: string;
  codeOfConduct?: string;
  highlights: string[]; // Chip texts
  faqs: { question: string; answer: string }[];
  pricingPlans?: PricingPlan[];
  membershipApproval: 'auto' | 'manual';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Clubs are always created/onboarded via the Admin Dashboard before they
// reach this app's mock data, so they arrive already-live.
export type ClubStatus = 'live' | 'suspended' | 'archived';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string; // "INR"
  billingCycle: 'one_time' | 'monthly' | 'quarterly' | 'yearly';
  trialDays?: number;
  description?: string;
}

// Relationships:
// Club -> User (owner):        Club.ownerId -> User.id
// Club -> Event[]:             via eventService.getByClub(clubId)
// Club -> Album[]:             via albumService.getByClub(clubId)
// Club -> ChatChannel[]:       via chatService.getChannelsByClub(clubId)
// Club -> ClubMember[]:        via clubService.getMembers(clubId)
```

---

## 10.3 ClubMembership

```ts
export interface ClubMembership {
  id: string;
  clubId: string;
  userId: string;
  role: 'owner' | 'member'; // Only used to show/hide Edit/Cancel Event actions
  status: 'active' | 'pending_approval' | 'suspended' | 'cancelled'; // pending_approval is read-only here -- approved elsewhere (Admin Dashboard or club owner tooling), not actionable from this app
  joinedAt: string;
  subscriptionId?: string; // Only for paid clubs
  expiresAt?: string; // Only for paid clubs
}
```

---

## 10.4 Event

```ts
export interface Event {
  id: string; // "evt_..."
  clubId: string;
  creatorId: string;
  type: 'event' | 'meeting';
  title: string;
  description: string; // Rich text HTML
  coverImageUrl?: string;
  startAt: string; // ISO 8601 with TZ
  endAt?: string;
  timezone: string; // IANA timezone e.g., "Asia/Kolkata"
  recurrence: 'one_time' | 'weekly' | 'monthly';
  locationType: 'physical' | 'virtual';
  physicalAddress?: string;
  mapLat?: number;
  mapLng?: number;
  virtualLink?: string;
  capacity?: number; // null = unlimited
  rsvpDeadline?: string;
  ticketType: 'free' | 'paid';
  ticketPrice?: number;
  ticketQuantity?: number;
  ticketsSold?: number;
  visibility: 'all_members' | 'invite_only' | 'public';
  status: 'draft' | 'published' | 'cancelled' | 'concluded';
  rsvpCounts: { going: number; interested: number; not_going: number };
  currentUserRsvp?: 'going' | 'interested' | 'not_going' | null;
  albumId?: string; // Auto-created album after conclusion
  createdAt: string;
  updatedAt: string;
}
```

---

## 10.5 ChatChannel & ChatMessage

```ts
export interface ChatChannel {
  id: string; // "ch_..."
  clubId: string;
  name: string; // "general", "announcements"
  type: 'group' | 'announcement' | 'direct';
  pinnedMessageId?: string; // Read-only here -- set via the Admin Dashboard
  createdAt: string;
}

export type MessageType = 'text' | 'image' | 'video' | 'document' | 'voice' | 'poll' | 'system';

export interface ChatMessage {
  id: string; // "msg_..."
  channelId: string;
  senderId: string;
  type: MessageType;
  text?: string;
  mediaUrl?: string;
  mediaType?: string; // MIME type
  mediaSize?: number; // Bytes
  mediaThumbnailUrl?: string;
  poll?: {
    question: string;
    options: { id: string; text: string; voteCount: number }[];
    allowMultiple: boolean;
    closed: boolean;
    userVotedOptionIds?: string[];
  };
  replyTo?: {
    id: string;
    senderId: string;
    senderName: string;
    previewText: string;
  };
  reactions: Record<string, string[]>; // emoji -> userId[]
  edited: boolean;
  editedAt?: string;
  deleted: boolean; // Soft delete
  deliveredTo: string[]; // userIds
  readBy: string[]; // userIds
  sentAt: string;
}
```

---

## 10.6 Album & MediaItem

```ts
export interface Album {
  id: string;
  clubId: string;
  eventId?: string; // If auto-created from event
  title: string;
  description?: string;
  coverUrl?: string;
  mediaCount: number;
  visibility: 'members_only' | 'public';
  allowMemberUploads: boolean;
  createdById: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  albumId: string;
  uploadedById: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  caption?: string;
  width?: number;
  height?: number;
  durationSeconds?: number; // For video
  likeCount: number;
  commentCount: number;
  currentUserLiked: boolean;
  uploadedAt: string;
}
```

---

## 10.7 Notification

```ts
export type NotificationType =
  | 'club_joined'
  | 'event_created'
  | 'event_reminder_24h'
  | 'event_reminder_1h'
  | 'event_rsvp'
  | 'event_cancelled'
  | 'event_updated'
  | 'chat_mention'
  | 'payment_success'
  | 'payment_failed'
  | 'subscription_renewal'
  | 'subscription_expiry'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  imageUrl?: string;
  deepLink?: string;
  read: boolean;
  createdAt: string;
}
```

---

## 10.8 Transaction & Subscription

```ts
export type TransactionType = 'club_joining_fee' | 'club_subscription' | 'event_ticket';
export type TransactionStatus =
  'success' | 'failed' | 'pending' | 'refunded' | 'partially_refunded';

export interface Transaction {
  id: string; // "txn_..."
  userId: string;
  clubId: string;
  eventId?: string; // Only for event ticket transactions
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  gateway: 'razorpay' | 'stripe' | 'payu' | 'mock';
  gatewayTransactionId?: string;
  planId?: string;
  description: string;
  invoiceUrl?: string;
  refundReason?: string;
  refundedAt?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  clubId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string;
  createdAt: string;
}
```

---

# Section 15 -- API Contract (Mock)

## 15.1 Base URL

```
Development: http://localhost:5173/api   (intercepted by axios-mock-adapter)
Production:  https://api.socialcircle.app/v1
```

## 15.2 Auth Endpoints

### POST /api/auth/signup

**Request:**

```json
{ "fullName": "Alice Sharma", "email": "alice@example.com", "password": "Secure@123" }
```

**Response 201:**

```json
{
  "message": "OTP sent to alice@example.com",
  "channel": "email",
  "maskedTarget": "a***@example.com"
}
```

**Error 409:** `{ "code": "EMAIL_EXISTS", "message": "An account with this email already exists." }`

---

### POST /api/auth/verify-otp

**Request:** `{ "target": "alice@example.com", "otp": "123456", "purpose": "signup" }`
**Response 200:** `{ "accessToken": "...", "refreshToken": "...", "user": { ... } }`
**Error 400:** `{ "code": "INVALID_OTP", "message": "The OTP you entered is incorrect." }`
**Error 429:** `{ "code": "OTP_MAX_ATTEMPTS", "message": "Too many attempts. Try again in 5 minutes." }`

---

### POST /api/auth/login

**Request:** `{ "email": "alice@example.com", "password": "Secure@123" }`
**Response 200:** `{ "accessToken": "...", "refreshToken": "...", "user": { ... } }`
**Error 401:** `{ "code": "INVALID_CREDENTIALS", "message": "Invalid email or password." }`

---

### POST /api/auth/refresh

**Request:** `{ "refreshToken": "..." }`
**Response 200:** `{ "accessToken": "...", "refreshToken": "..." }`
**Error 401:** `{ "code": "TOKEN_EXPIRED", "message": "Session expired. Please log in again." }`

---

### POST /api/auth/logout

**Request:** `{}` (auth header required)
**Response 204:** no content

---

### POST /api/auth/forgot-password

**Request:** `{ "target": "alice@example.com" }`
**Response 200:** `{ "message": "OTP sent.", "maskedTarget": "a***@example.com" }`

---

### POST /api/auth/reset-password

**Request:** `{ "target": "alice@example.com", "otp": "123456", "newPassword": "NewSecure@456" }`
**Response 200:** `{ "message": "Password reset successfully." }`

---

## 15.3 User / Profile Endpoints

### GET /api/users/me

**Response 200:** `{ "data": { ...User } }`

### PATCH /api/users/me

**Request:** partial User fields (fullName, bio, city, interests, avatarUrl, etc.)
**Response 200:** `{ "data": { ...updated User } }`

### GET /api/users/:userId

**Response 200:** `{ "data": { ...User (public fields only) } }`

### GET /api/users/me/notification-preferences

**Response 200:** `{ "data": { ...NotificationPreferences } }`

### PATCH /api/users/me/notification-preferences

**Request:** `{ "email": { "eventReminders": true, "chatMentions": false }, "push": { ... } }`
**Response 200:** `{ "data": { ...updated prefs } }`

---

## 15.4 Club Endpoints

### GET /api/clubs

**Query:** `page`, `limit`, `sort`, `order`, `category`, `type`, `search`, `city`
**Response 200:** paginated list of `ClubSummary`

### GET /api/clubs/:slug

**Response 200:** `{ "data": { ...Club (full) } }`
**Error 404:** `{ "code": "CLUB_NOT_FOUND" }`

### GET /api/clubs/:id/members

**Query:** `page`, `limit`, `role`, `status`, `search`
**Response 200:** paginated list of `ClubMembership` with embedded `User`

### POST /api/clubs/:id/join

**Request:** `{}` (free clubs) or `{ "planId": "plan_..." }` (paid -- redirects to checkout)
**Response 200 (free):** `{ "data": { ...ClubMembership } }`
**Response 402 (paid):** `{ "data": { "checkoutUrl": "/checkout/plan_..." } }`

### DELETE /api/clubs/:id/leave

**Response 204**

---

## 15.5 Event Endpoints

### GET /api/clubs/:clubId/events

**Query:** `page`, `limit`, `status` (upcoming/past/cancelled)
**Response 200:** paginated `Event[]`

### GET /api/events/:eventId

**Response 200:** `{ "data": { ...Event } }`

### PATCH /api/events/:eventId

Updates the event's owner-editable fields only (see Part 5 `eventEditSchema`). Callable only by the member who owns the event's club (`ClubMembership.role === 'owner'`); events are created entirely via the Admin Dashboard.
**Response 200:** `{ "data": { ...Event } }`

### DELETE /api/events/:eventId

Cancels the event. Owner-only (member who owns the event's club). Auto-notifies attendees.
**Response 204**

### POST /api/events/:eventId/rsvp

**Request:** `{ "response": "going" | "interested" | "not_going" }`
**Response 200:** `{ "data": { "rsvpCounts": { ... }, "currentUserRsvp": "going" } }`

### GET /api/events/:eventId/attendees

**Response 200:** paginated attendee list with RSVP status

---

## 15.6 Chat Endpoints

### GET /api/clubs/:clubId/channels

**Response 200:** `{ "data": ChatChannel[] }` (channels are seeded via mock data; channel creation happens in the Admin Dashboard)

### GET /api/channels/:channelId/messages

**Query:** `before` (cursor, ISO timestamp), `limit` (default 50)
**Response 200:**

```json
{ "data": [], "cursor": "2026-07-24T10:00:00Z", "hasMore": true }
```

### POST /api/channels/:channelId/messages

Send a message.
**Request:**

```json
{ "type": "text", "text": "Hello everyone!" }
```

For media: `multipart/form-data` with `file` field + JSON metadata.
**Response 201:** `{ "data": { ...ChatMessage } }`

### PATCH /api/messages/:messageId

Edit own message (within 15 min window).
**Request:** `{ "text": "corrected text" }`
**Response 200:** `{ "data": { ...ChatMessage, "edited": true } }`

### DELETE /api/messages/:messageId

**Request:** `{ "scope": "for_me" | "for_everyone" }`
**Response 204**

### POST /api/messages/:messageId/reactions

**Request:** `{ "emoji": "thumbs_up" }`
**Response 200:** `{ "data": { "reactions": { "thumbs_up": ["usr_..."] } } }`

---

## 15.7 Album Endpoints

### GET /api/clubs/:clubId/albums

**Response 200:** paginated `Album[]`

### POST /api/clubs/:clubId/albums

**Request:** `{ "title": "...", "description": "...", "visibility": "members_only" }`
**Response 201:** `{ "data": Album }`

### GET /api/albums/:albumId/media

**Query:** `page`, `limit`
**Response 200:** paginated `MediaItem[]`

### POST /api/albums/:albumId/media

Upload media (multipart/form-data).
**Response 201:** `{ "data": MediaItem[] }`

### POST /api/media/:mediaId/like

Toggle like.
**Response 200:** `{ "data": { "likeCount": 42, "liked": true } }`

### DELETE /api/media/:mediaId

**Response 204**

---

## 15.8 Payment Endpoints

### POST /api/payments/checkout

Initiate checkout.
**Request:** `{ "planId": "plan_...", "paymentMethod": "card" }`
**Response 200 (mock):** `{ "data": { "checkoutId": "chk_...", "status": "pending" } }`

### POST /api/payments/confirm

Mock payment confirmation.
**Request:** `{ "checkoutId": "chk_..." }`
**Response 200:**

```json
{
  "data": {
    "transaction": { "id": "txn_001", "status": "success" },
    "subscription": { "id": "sub_001", "status": "active" },
    "membership": { "id": "mem_001", "status": "active" }
  }
}
```

### GET /api/users/me/subscriptions

**Response 200:** `{ "data": Subscription[] }`

### DELETE /api/subscriptions/:subscriptionId

Cancel subscription.
**Response 200:** `{ "data": { "cancelAtPeriodEnd": true, "accessUntil": "2026-08-14" } }`

### GET /api/users/me/transactions

**Query:** `page`, `limit`, `type`, `status`, `from`, `to`
**Response 200:** paginated `Transaction[]`

---

## 15.9 Notification Endpoints

### GET /api/notifications

**Query:** `page`, `limit`, `type`, `read`
**Response 200:** paginated `Notification[]`

### GET /api/notifications/count

**Response 200:** `{ "data": { "unread": 7 } }`

### POST /api/notifications/mark-read

**Request:** `{ "ids": ["notif_..."] }` or `{ "all": true }`
**Response 204**

---

> **Note:** Club creation, event creation, and all club/member/chat moderation are handled by the separately-built Admin Dashboard (not just its API endpoints) -- this mock API only serves the read/view/RSVP/edit-own-event surface described above.

## 15.10 Standard Error Response

```ts
interface ApiError {
  code: string; // Machine-readable code e.g., "INVALID_OTP"
  message: string; // Human-readable message shown in UI
  field?: string; // Field name for field-level errors
  details?: unknown; // Extended debug info (only in dev)
}
```

HTTP Status codes used:

| Code | Meaning                                                         |
| ---- | --------------------------------------------------------------- |
| 200  | OK                                                              |
| 201  | Created                                                         |
| 204  | No Content                                                      |
| 400  | Bad Request (validation)                                        |
| 401  | Unauthorised (no/invalid token)                                 |
| 402  | Payment Required                                                |
| 403  | Forbidden (e.g. PATCH/DELETE `/events/:eventId` by a non-owner) |
| 404  | Not Found                                                       |
| 409  | Conflict (duplicate)                                            |
| 429  | Too Many Requests                                               |
| 500  | Server Error                                                    |

---

# Section 16 -- Authentication

## 16.1 Mock JWT Simulation

```ts
// services/apiClient.ts
const apiClient = axios.create({ baseURL: '/api' });

// Request interceptor: inject token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401 -> refresh token
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await apiClient.post('/auth/refresh', { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(error.config);
        } catch {
          // Refresh failed -- force logout
          useAuthStore.getState().clearAuth();
          window.location.replace('/login?sessionExpired=true');
        }
      }
    }
    return Promise.reject(error);
  },
);
```

## 16.2 Mock Token Structure

```ts
// Mock JWT payload (not verified, just decoded for display)
interface MockJwtPayload {
  sub: string; // User ID
  email: string;
  iat: number;
  exp: number; // Mock: 15 minutes from login
}
```

In dev mode, the mock adapter auto-issues tokens when login/signup succeeds:

```ts
// mock/handlers/authHandlers.ts
const MOCK_ACCESS_TOKEN = 'mock.access.token.usr_h7k2p9';
const MOCK_REFRESH_TOKEN = 'mock.refresh.token.usr_h7k2p9';
```

## 16.3 Mock User Accounts (Dev Credentials)

| Account             | Email              | Password   | Notes                                                                                    |
| ------------------- | ------------------ | ---------- | ---------------------------------------------------------------------------------------- |
| Member              | member@example.com | Member@123 | Standard member                                                                          |
| Member (club owner) | owner@example.com  | Owner@123  | Owns one seeded club -- use to test the conditional Edit/Cancel Event UI on Event Detail |

## 16.4 Protected Route Flow

```
[User navigates to a protected route]
        |
        v
[AuthGuard checks Zustand authSlice.isAuthenticated]
        |
        +-- false --> redirect /login?next=<original-url>
        |
        \-- true  --> render the page
```

There is no role-based branch here -- every authenticated member reaches the same routes. Ownership (e.g. whether to show Edit/Cancel Event) is resolved inline on the page itself via `isClubOwner(membership)` (Part 3 §7.2), sourced from the `ClubMembership.role` field the API returns -- never by redirecting to `/unauthorized`.

## 16.4a Gated Action Flow (public pages)

Home (S-08), Search (S-09), Club Landing (S-10), and Public Event Detail (S-37) are not route-gated — a logged-out visitor can load and view them. Individual CTAs on those pages (Join, RSVP, Get Tickets/Buy, Message) are gated at the action level instead, via `useRequireAuth()` (Part 3 §7.2):

```
[User clicks a gated CTA: Join / RSVP / Buy / Message]
        |
        v
[useRequireAuth checks Zustand authSlice.isAuthenticated]
        |
        +-- false --> redirect /login?next=<current-url>&intent=<action>
        |             (no mock API call is made)
        |
        \-- true  --> call the mutating mock endpoint directly
                       (POST /clubs/:id/join, POST /events/:id/rsvp, etc.)
```

GET endpoints that back these public pages (`GET /clubs`, `GET /clubs/:slug`, `GET /events`, `GET /events/:id`) must be callable **without** an `Authorization` header in the mock adapter — they return data regardless of auth state (optionally personalising ranking when a token is present). Only mutating endpoints (join, RSVP, checkout, message) require a token and should return a mock 401 if called without one — this is a defense-in-depth backstop; the client-side gate above is expected to prevent the call from ever being attempted while logged out.

## 16.5 Social Login Mock Flow

```ts
// SocialCallbackPage.tsx
useEffect(() => {
  const provider = searchParams.get('provider');
  // Mock: simulate 1.5s OAuth processing
  setTimeout(() => {
    const mockUser = getMockSocialUser(provider);
    setAuth(mockUser, MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN);
    const next = searchParams.get('next') ?? '/home';
    navigate(mockUser.profileComplete ? next : '/onboarding/interests');
  }, 1500);
}, []);
```

---

# Section 17 -- Notifications

## 17.1 In-App Notification Centre

The notification centre (S-23) is a full-page list accessible via the `/notifications` route and from the bell icon.

**Polling strategy (mock):** TanStack Query polls `/api/notifications/count` every 30 seconds. When unread count > 0, the badge appears on the bell icon.

```ts
// features/notifications/hooks/useNotifications.ts
const { data: countData } = useQuery({
  queryKey: queryKeys.notifications.count(user.id),
  queryFn: () => notificationService.getUnreadCount(),
  refetchInterval: 30_000,
  staleTime: 0,
});

useEffect(() => {
  if (countData?.unread) {
    uiStore.setNotificationBadgeCount(countData.unread);
  }
}, [countData]);
```

## 17.2 Push Notification Scaffolding

The Browser Push API is scaffolded but inactive in dev:

```ts
// shared/hooks/usePushNotifications.ts
export function usePushNotifications() {
  const subscribe = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
    // In production: get subscription + POST to /api/push/subscribe
    // In dev: log subscription object to console
  };
  return { subscribe };
}
```

A Service Worker file (`public/sw.js`) is included as a placeholder for production push handling.

## 17.3 Toast Notifications (Real-time Feedback)

Triggered by:

- Successful mutations (join club, send message, RSVP, payment)
- Failed mutations (network error, validation)
- System events (new message in active club -- only if chat window not visible)

## 17.4 Email Notification Mock

In development, all email sends are logged to the browser console:

```
[EMAIL MOCK] To: alice@example.com
Subject: Welcome to Social Circle!
Template: welcome
Variables: { name: "Alice Sharma" }
```

**Transactional email types:**

| Trigger                                       | Template Key                    |
| --------------------------------------------- | ------------------------------- |
| Registration                                  | `welcome`                       |
| OTP                                           | `otp`                           |
| Password reset                                | `password_reset`                |
| Payment receipt                               | `payment_receipt`               |
| Subscription renewal reminder (7 days before) | `subscription_renewal_reminder` |
| Subscription expired                          | `subscription_expired`          |
| Event reminder (24 h)                         | `event_reminder_24h`            |
| Event reminder (1 h)                          | `event_reminder_1h`             |
| Event cancelled                               | `event_cancelled`               |

## 17.5 Notification Preferences

Stored per-user. UI in Settings > Notifications (S-27).

```ts
interface NotificationPreferences {
  email: {
    clubActivity: boolean;
    eventReminders: boolean;
    chatMentions: boolean;
    paymentReceipts: boolean;
    clubAnnouncements: boolean;
    weeklyDigest: boolean;
  };
  push: {
    clubActivity: boolean;
    eventReminders: boolean;
    chatMentions: boolean;
    paymentReceipts: boolean;
    clubAnnouncements: boolean;
  };
  inApp: {
    all: boolean; // Master toggle
  };
}
```

---

_End of Part 4. Continue with `spec-part5-quality.md` for Forms, Search, Performance, Accessibility, SEO, Security, and Error Handling._
