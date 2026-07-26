# Social Circle — Frontend Technical Specification

## Part 5: Forms · Search · Performance · Accessibility · SEO · Security · Error Handling

> **Document Series:** Part 5 of 6.
> Cross-reference: `spec-part3-architecture.md` (component library), `spec-part4-backend-mock.md` (API error codes).

---

# Section 14 — Forms

## 14.1 Form Technology Stack

Every form uses **React Hook Form** for state management and **Zod** for schema-driven validation.

```ts
// Pattern used in every form
const schema = z.object({/* ... */});
type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {/* ... */},
  mode: 'onTouched', // Validate on blur, re-validate on change after first touch
});
```

## 14.2 Form Inventory

### Login Form

| Field        | Type         | Validation                   |
| ------------ | ------------ | ---------------------------- |
| `email`      | text / email | required, valid email format |
| `password`   | password     | required, min 1 char         |
| `rememberMe` | checkbox     | optional                     |

**Error Messages:**

- `email`: "Please enter a valid email address."
- `password`: "Password is required."
- Server 401: "Invalid email or password. Please try again."

**Keyboard Behaviour:** Tab order: email → password → remember-me → submit. Enter in password field submits.

**Auto-complete:** `autocomplete="email"`, `autocomplete="current-password"`

---

### Sign Up Form

| Field             | Type     | Zod Rule                 | Error Message                                                                             |
| ----------------- | -------- | ------------------------ | ----------------------------------------------------------------------------------------- |
| `fullName`        | text     | min(2).max(100)          | "Name must be at least 2 characters."                                                     |
| `email`           | email    | email()                  | "Please enter a valid email address."                                                     |
| `phone`           | text     | optional, E.164          | "Please enter a valid phone number."                                                      |
| `password`        | password | min(8) + regex           | "Password must be at least 8 characters with 1 uppercase, 1 number, 1 special character." |
| `confirmPassword` | password | .refine matches password | "Passwords do not match."                                                                 |
| `terms`           | checkbox | literal(true)            | "You must accept the terms to continue."                                                  |

**Real-time validation:** Password strength meter updates on every keystroke (no debounce needed — pure computation). All other fields validate on blur.

---

### OTP Form

6 individual `<input type="text" maxLength={1}>` fields.

**Behaviour:**

- Auto-advance focus to next field on digit entry
- Backspace: clear current field, move focus back
- Paste: distribute digits across all 6 fields
- Auto-submit on 6th digit entry

**Zod:** `.length(6).regex(/^\d{6}$/, "OTP must be 6 digits.")`

---

### Edit Event Form

Club creation and event creation both happen in the separately-built Admin Dashboard and have no forms in this app. The only event-authoring surface here is the light edit modal available to the member who owns an event's club (see Part 2 S-13, Part 4 `PATCH /api/events/:eventId`).

| Field             | Zod Rule                                                           |
| ----------------- | ------------------------------------------------------------------ |
| `title`           | min(3).max(120)                                                    |
| `description`     | min(20) (HTML stripped for length check)                           |
| `coverImage`      | url().optional()                                                   |
| `startAt`         | date().refine(d => d > new Date(), "Event must be in the future.") |
| `endAt`           | date().optional().refine end > start                               |
| `timezone`        | string() (IANA)                                                    |
| `locationType`    | enum(['physical', 'virtual'])                                      |
| `physicalAddress` | min(5).optional() — required if locationType === 'physical'        |
| `virtualLink`     | url().optional() — required if locationType === 'virtual'          |
| `capacity`        | int().positive().optional()                                        |
| `rsvpDeadline`    | date().optional()                                                  |

Ticket pricing/type/quantity, visibility, and recurrence are not editable from this app — they're set once at creation time via the Admin Dashboard.

---

### Profile Edit Form

| Field                 | Zod Rule                           |
| --------------------- | ---------------------------------- |
| `fullName`            | min(2).max(100)                    |
| `bio`                 | max(160).optional()                |
| `city`                | max(80).optional()                 |
| `websiteUrl`          | url().optional().or(z.literal('')) |
| `socialLinks.twitter` | url().optional()                   |
| `interests`           | array().min(1)                     |

---

## 14.3 Auto-Save Strategy

Used in: Settings (notification preferences).

```ts
const { watch, handleSubmit } = useForm({/* ... */});

useEffect(() => {
  const subscription = watch((data) => {
    debouncedSave(data); // 500ms debounce
  });
  return () => subscription.unsubscribe();
}, [watch]);
```

Save state indicator:

- "Saving…" (during save mutation)
- "Saved." (after success)
- "Save failed — retrying…" (on error)

---

## 14.4 Keyboard Behaviour Summary

| Form             | Special Key Handling                                      |
| ---------------- | --------------------------------------------------------- |
| All forms        | Tab moves between fields; Enter submits (except textarea) |
| OTP              | Digit auto-advances; Backspace retreats; Paste fills all  |
| Tag input        | Enter/comma adds a tag; Backspace removes last tag        |
| RichTextEditor   | Cmd/Ctrl+B = bold; Cmd/Ctrl+I = italic; Cmd/Ctrl+K = link |
| Date/Time picker | Arrow keys navigate calendar; Enter selects               |
| Search           | / key from any page focuses search bar; Esc clears        |

---

## 14.5 Accessibility in Forms

- Every input has a `<label>` (or `aria-label` for icon-only inputs)
- Error messages bound with `aria-describedby`
- `aria-required="true"` on required fields
- `aria-invalid="true"` on fields with errors
- `aria-live="polite"` on dynamic error containers
- Form submission errors announced to screen readers via `role="alert"`
- Focus is moved to the first error field after failed validation

---

# Section 18 — Search

## 18.1 Global Search Architecture

Search is accessible via:

- `/search` route (full-page)
- Command bar keyboard shortcut: `Cmd+K` / `Ctrl+K` (opens `<CommandPalette>` modal)
- `/` keyboard shortcut (focuses search bar in top nav)

## 18.2 Debounce

```ts
// shared/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Usage in SearchPage
const debouncedQuery = useDebounce(query, 300);
```

Minimum query length: 2 characters (below this, suggestions are not fetched).

## 18.3 Search Suggestions

Autocomplete dropdown appears within 300 ms of debounce.

Mock suggestions:

- Club name prefix matches
- Recent searches (from localStorage)
- Top categories matching the query

```ts
interface SearchSuggestion {
  type: 'club' | 'event' | 'person' | 'category' | 'recent';
  id: string;
  label: string;
  subtitle?: string;
  imageUrl?: string;
}
```

## 18.4 Recent Searches

Stored in `localStorage` key `sc_recent_searches`:

- Array of last 10 search queries (strings)
- FIFO — newest at top
- Cleared on logout
- Individual item deletable via "×" button

## 18.5 Empty Search State

- No query entered: recent searches + "Popular clubs" row
- Query entered, 0 results: "No results for '{query}'. Try different keywords or browse [categories]."
- Network error: "Search is unavailable. Please try again." with retry button.

## 18.6 Search Filters

On the `/search` page, filters appear in a collapsible left panel (desktop) or a bottom sheet (mobile):

| Filter     | Type              | Options                           |
| ---------- | ----------------- | --------------------------------- |
| Tab        | Tabs              | Clubs / Events / People           |
| Category   | Checkboxes        | All categories list               |
| Type       | Toggle            | Free / Paid                       |
| City       | Autocomplete text |                                   |
| Date Range | Date pickers      | From / To (Events tab only)       |
| Sort       | Select            | Relevance / Newest / Most Members |

Active filters shown as dismissable chips above results.

---

# Section 19 — Performance Optimization

## 19.1 Code Splitting

All page components are lazy-loaded (see Part 3 Section 6.5). Additionally:

- The Rich Text Editor (TipTap) is dynamically imported only where rich text is rendered or edited (club/event descriptions, the Edit Event modal)
- This app has no admin pages and does not bundle Recharts -- charting lives entirely in the separate Admin Dashboard
- The emoji picker is dynamically imported when first opened

```ts
const RichTextEditor = lazy(() => import('@/shared/components/forms/RichTextEditor'));
const EmojiPicker = lazy(() => import('@/features/chat/components/EmojiPicker'));
```

## 19.2 React Memoization

| Component          | Optimization | Reason                                                   |
| ------------------ | ------------ | -------------------------------------------------------- |
| `ClubCard`         | `React.memo` | Re-renders frequently in large discovery grids           |
| `MessageBubble`    | `React.memo` | Chat lists 50–100+ messages; deep re-render is expensive |
| `NotificationItem` | `React.memo` | Notification list can grow long                          |
| `EventCard`        | `React.memo` | Listed in grids                                          |
| `KpiCard`          | `React.memo` | Dashboard renders 5 at once                              |

`useMemo` usage:

```ts
// ClubCard — derived display data
const memberCountLabel = useMemo(() => formatMemberCount(club.memberCount), [club.memberCount]);

// SearchPage — filtered results
const filteredResults = useMemo(() => applyFilters(results, filters), [results, filters]);
```

`useCallback` usage:

```ts
// Event handlers passed to memoized children
const handleRsvp = useCallback(
  (response: RsvpResponse) => {
    /* ... */
  },
  [eventId],
);
```

## 19.3 Virtual Lists

Chat message list and large member/club lists use **TanStack Virtual** (formerly react-virtual):

```tsx
// GroupChatPage.tsx
const { virtualItems, totalSize } = useVirtualizer({
  count: messages.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 60,
  overscan: 10,
});
```

Applied when list length exceeds 100 items.

## 19.4 Image Optimization

- All images use `loading="lazy"` for off-screen images
- `srcset` / `sizes` for responsive images
- Placeholder: low-quality blurred placeholder (LQIP) using a 16×16 blurred base64 thumbnail from the mock data URL
- WebP format preferred (Unsplash/picsum mocks serve WebP by default)
- Club banner images use `fetchPriority="high"` when in the viewport hero

```tsx
<img
  src={club.bannerUrl}
  srcSet={`${club.bannerUrl}&w=640 640w, ${club.bannerUrl}&w=1280 1280w`}
  sizes="(max-width: 768px) 100vw, 1280px"
  loading="lazy"
  alt={`${club.name} cover`}
  className="w-full h-full object-cover"
/>
```

## 19.5 TanStack Query Prefetching

```ts
// Club landing page: prefetch dashboard data on hover over "Join" button
const queryClient = useQueryClient();

const handleJoinHover = () => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.clubs.detail(slug),
    queryFn: () => clubService.getBySlug(slug),
    staleTime: 10_000,
  });
};
```

## 19.6 Bundle Budget

| Chunk                        | Max Size (gzip) |
| ---------------------------- | --------------- |
| Initial (vendor + app shell) | 150 KB          |
| Per route chunk              | 30 KB           |
| Editor chunk                 | 80 KB           |
| Emoji picker chunk           | 40 KB           |

Enforced via `vite.config.ts` `build.chunkSizeWarningLimit`.

## 19.7 Pagination Strategy

| List              | Strategy                                       | Page Size |
| ----------------- | ---------------------------------------------- | --------- |
| Discovery feed    | Infinite scroll (IntersectionObserver)         | 12        |
| Chat messages     | Bidirectional cursor (load older on scroll up) | 50        |
| Notification list | Load more button                               | 20        |
| Album media       | Infinite scroll                                | 24        |
| Event attendees   | Load more                                      | 30        |

## 19.8 Critical CSS & FCP

- Tailwind's JIT compiles only used CSS classes → minimal CSS bundle
- Critical above-the-fold CSS is inlined (Vite plugin: `vite-plugin-critical`)
- LCP target: < 2.5 s on 4G (club landing page hero image)
- FID target: < 100 ms (form interactions)
- CLS target: < 0.1 (skeleton loaders prevent layout shift)

---

# Section 20 — Accessibility

## 20.1 WCAG 2.1 AA Compliance Checklist

| Criterion                     | Level | Implementation                                                                                   |
| ----------------------------- | ----- | ------------------------------------------------------------------------------------------------ |
| 1.1.1 Non-text content        | A     | All `<img>` have descriptive `alt` attributes; decorative images use `alt=""`                    |
| 1.3.1 Info and relationships  | A     | Semantic HTML (`<nav>`, `<main>`, `<aside>`, `<article>`, `<section>`); no `div`-only structures |
| 1.3.3 Sensory characteristics | A     | Instructions don't rely solely on colour ("Error" not just shown in red — includes text + icon)  |
| 1.4.1 Use of colour           | A     | Colour is never the only way to convey information                                               |
| 1.4.3 Contrast (Minimum)      | AA    | All text 4.5:1 contrast ratio; large text 3:1 — verified with Radix UI built-ins                 |
| 1.4.4 Resize text             | AA    | No fixed pixel font sizes; all em/rem                                                            |
| 1.4.10 Reflow                 | AA    | Single-column layout at 320px width                                                              |
| 1.4.11 Non-text contrast      | AA    | Interactive components have 3:1 contrast on focus indicators                                     |
| 2.1.1 Keyboard                | A     | All interactive elements reachable by keyboard                                                   |
| 2.1.2 No keyboard trap        | A     | Focus trap in modals only (with Escape to close); no trap outside modals                         |
| 2.4.1 Bypass blocks           | A     | Skip to main content link at top of page                                                         |
| 2.4.3 Focus order             | A     | DOM order = visual order; no CSS-only reordering                                                 |
| 2.4.4 Link purpose            | A     | All links have descriptive text (no bare "click here")                                           |
| 2.4.7 Focus visible           | AA    | `focus-visible` ring on all interactive elements; using Tailwind `focus-visible:ring-2`          |
| 3.1.1 Language of page        | A     | `<html lang="en">`                                                                               |
| 3.3.1 Error identification    | A     | Form errors: labelled + text description of the error                                            |
| 3.3.2 Labels or instructions  | A     | All form fields have visible labels                                                              |
| 4.1.2 Name, role, value       | A     | ARIA roles on all custom components                                                              |
| 4.1.3 Status messages         | AA    | `aria-live` regions for dynamic status updates                                                   |

## 20.2 Skip Links

```html
<!-- In AppShell.tsx, first element in DOM -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-2 focus:rounded"
>
  Skip to main content
</a>
```

## 20.3 Focus Management

| Scenario              | Focus Behaviour                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------- |
| Modal opens           | Focus moves to first focusable element inside modal (Radix Dialog handles this)             |
| Modal closes          | Focus returns to the trigger element                                                        |
| Toast appears         | No focus movement (toast is `aria-live`, screen reader reads it)                            |
| Page navigation       | Focus moves to `<h1>` of new page (via `useEffect(() => ref.current?.focus(), [pathname])`) |
| Form validation fails | Focus moves to first field with an error                                                    |
| Dropdown opens        | Focus moves to first option                                                                 |

## 20.4 ARIA Usage

```tsx
// Example: Club card in discovery grid
<article
  aria-label={`${club.name} — ${club.category} club in ${club.city}`}
  role="article"
>
  {/* ... */}
  <button aria-label={`Join ${club.name}`} onClick={onJoin}>Join</button>
</article>

// Example: Notification badge
<button aria-label={`Notifications, ${count} unread`}>
  <BellIcon aria-hidden="true" />
  {count > 0 && <span aria-hidden="true" className="badge">{count}</span>}
</button>

// Example: Chat message list
<ul role="list" aria-label="Messages in #general">
  {messages.map(msg => (
    <li key={msg.id} aria-label={`${msg.senderName} at ${formatTime(msg.sentAt)}: ${msg.text}`}>
      <MessageBubble message={msg} />
    </li>
  ))}
</ul>
```

## 20.5 Screen Reader Support

- Testing targets: NVDA + Chrome (Windows), VoiceOver + Safari (macOS/iOS)
- Chat: `aria-live="polite"` on message list container for new message announcements
- Typing indicator: `aria-live="polite"` — announces "Alice is typing"
- File upload progress: `role="progressbar"` with `aria-valuenow`

---

# Section 21 — SEO

## 21.1 Meta Tags

Using `react-helmet-async` for all dynamic meta tag management.

```tsx
// ClubLandingPage.tsx
<Helmet>
  <title>
    {club.name} — {club.tagline ?? 'Join our community'} | Social Circle
  </title>
  <meta name="description" content={stripHtml(club.about).slice(0, 155)} />
  <link rel="canonical" href={`https://socialcircle.app/clubs/${club.slug}`} />
</Helmet>
```

## 21.2 Open Graph

```tsx
<meta property="og:type" content="website" />
<meta property="og:title" content={`${club.name} | Social Circle`} />
<meta property="og:description" content={stripHtml(club.about).slice(0, 155)} />
<meta property="og:image" content={club.bannerUrl ?? DEFAULT_OG_IMAGE} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content={`https://socialcircle.app/clubs/${club.slug}`} />
<meta property="og:site_name" content="Social Circle" />
```

## 21.3 Twitter Card

```tsx
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={`${club.name} | Social Circle`} />
<meta name="twitter:description" content={stripHtml(club.about).slice(0, 155)} />
<meta name="twitter:image" content={club.bannerUrl ?? DEFAULT_OG_IMAGE} />
```

## 21.4 JSON-LD Structured Data

```tsx
// ClubLandingPage.tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: club.name,
  description: stripHtml(club.about),
  url: `https://socialcircle.app/clubs/${club.slug}`,
  logo: club.logoUrl,
  image: club.bannerUrl,
  foundingDate: club.createdAt?.slice(0, 10),
};

<Helmet>
  <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
</Helmet>;
```

Event pages use `Event` schema type.

## 21.5 Pages Strategy

| Route                          | Indexed | Notes                                                   |
| ------------------------------ | ------- | ------------------------------------------------------- |
| `/clubs/:slug`                 | Yes     | Primary SEO surface                                     |
| `/clubs/:slug/events/:eventId` | Yes     | Public event detail (S-37); `Event` JSON-LD schema      |
| `/clubs/:slug/dashboard/*`     | No      | Auth-required; noindex                                  |
| `/home`, `/search`             | Yes     | Discovery surface — public; personalises when logged in |
| `/login`, `/signup`            | No      | noindex                                                 |

## 21.6 robots.txt

```
User-agent: *
Allow: /
Allow: /clubs/
Disallow: /clubs/*/dashboard/
Disallow: /checkout/
Disallow: /messages/
Disallow: /settings/
Sitemap: https://socialcircle.app/sitemap.xml
```

## 21.7 Sitemap Strategy

Dynamic sitemap at `/sitemap.xml` generated from:

- All live clubs (`/clubs/:slug`)
- All published events (once deep-linked publicly)
- Static pages: `/`, `/login`, `/signup`

In development, mock a static `public/sitemap.xml` with 5 sample club URLs.

---

# Section 22 — Security

## 22.1 XSS Prevention

- All user-generated rich text (club About, event descriptions) is sanitised with **DOMPurify** before rendering
- No use of `dangerouslySetInnerHTML` without DOMPurify wrapping:

```ts
// shared/utils/sanitize.ts
import DOMPurify from 'dompurify';

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}
```

- Link attributes: `rel="noopener noreferrer"` on all external links (enforced in TipTap link extension config)

## 22.2 CSRF

Since this is a cookie-less SPA (auth via Authorization header, not cookies), CSRF attacks are not applicable. If cookies are introduced in production, CSRF tokens must be added.

## 22.3 Token Storage

- `accessToken` and `refreshToken` stored in `localStorage`
- **Risk awareness:** `localStorage` is accessible to XSS. Mitigated by strict DOMPurify on all user content.
- Production recommendation: move to `httpOnly` cookies (requires backend changes)

```ts
// Tokens cleared on logout
const clearAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  // Also clear Zustand state
};
```

## 22.4 Input Validation

- All inputs validated client-side with Zod before submission
- Server-side validation mirrors the Zod schemas (documented for backend team)
- File uploads: MIME type validated client-side + server-side; max file sizes enforced

## 22.5 Content Security Policy

Vite injects a CSP meta tag in dev. For production, CSP header is configured at the CDN/server level:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM}';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://picsum.photos https://images.unsplash.com https://*.socialcircle.app;
  connect-src 'self' https://api.socialcircle.app wss://ws.socialcircle.app;
  font-src 'self' https://fonts.gstatic.com;
  frame-src 'none';
  object-src 'none';
```

## 22.6 Sensitive Data Handling

- Payment card numbers: never stored or transmitted by the frontend (handled entirely by payment gateway SDK)
- OTP: never stored in state or localStorage — only held in form state during the verification flow, then discarded
- Passwords: never logged, never stored anywhere
- `console.log` statements are stripped from production builds (Vite: `esbuild.drop: ['console']` in production)

## 22.7 Rate Limiting (Frontend)

Implemented as a UX safeguard on top of API-level rate limits:

| Action         | Client-side Throttle                                                           |
| -------------- | ------------------------------------------------------------------------------ |
| Login attempts | Button disabled for 1 s after each attempt; locked for 30 min after 5 failures |
| OTP resend     | Countdown timer 60 s                                                           |
| Message send   | 500 ms throttle (no spam)                                                      |
| Search query   | 300 ms debounce                                                                |

---

# Section 23 — Error Handling

## 23.1 Error Hierarchy

```
Level 1: React ErrorBoundary (root) — catches JS runtime errors, shows full-page fallback
Level 2: Route ErrorBoundary — catches per-page errors, shows page-level fallback with "Try again"
Level 3: Widget ErrorBoundary — wraps chat, notification bell; independent failure
Level 4: TanStack Query onError — shows toast for API mutation failures
Level 5: Inline form errors — Zod validation + server 400 errors
```

## 23.2 ErrorBoundary Component

```tsx
// shared/components/feedback/ErrorBoundary.tsx
interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ fallback: ReactNode; children: ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production: send to error tracking (e.g., Sentry)
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
```

## 23.3 API Error Handling (Axios Interceptor)

```ts
apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiError>) => {
    const code = error.response?.data?.code;
    const status = error.response?.status;

    if (status === 503) {
      window.location.replace('/maintenance');
      return;
    }

    if (status === 401 && code !== 'INVALID_CREDENTIALS') {
      // Token expired, handled by refresh interceptor (see Part 4)
      return;
    }

    // Let component-level handlers deal with the rest
    return Promise.reject(error);
  },
);
```

## 23.4 Offline Detection

```tsx
// shared/components/feedback/OfflineBanner.tsx
export function OfflineBanner() {
  const isOnline = useOnlineStatus(); // wraps window.addEventListener('online'/'offline')

  if (isOnline) return null;
  return (
    <div role="alert" className="offline-banner">
      <WifiOff className="h-4 w-4" />
      You're offline. Some features may not be available.
    </div>
  );
}
```

Positioned below the top bar, collapses when back online (with a brief "Back online!" green flash).

## 23.5 Retry Strategy

TanStack Query retries failed requests:

- Mutations: 0 retries (show error immediately)
- Queries: 2 retries with exponential backoff (1 s, 2 s)
- Network errors: infinite retry with `retryDelay: 'exponential'` and user-visible retry button

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

## 23.6 404 & Unauthorised

See S-34 and S-35 in Part 2. Both pages include:

- `<Helmet><meta name="robots" content="noindex" /></Helmet>` — don't index error pages
- Return to home CTA
- Log event to analytics (404s indicate broken links)

## 23.7 Error State UI Patterns

Every data-fetching component handles three states:

```tsx
function ClubsList() {
  const { data, isLoading, isError, refetch } = useQuery(/* ... */);

  if (isLoading) return <ClubsListSkeleton />;

  if (isError)
    return (
      <EmptyState
        icon={AlertCircle}
        title="Failed to load clubs"
        description="Something went wrong. Please try again."
        action={{ label: 'Try again', onClick: () => refetch() }}
      />
    );

  if (!data?.length)
    return (
      <EmptyState
        icon={Compass}
        title="No clubs found"
        description="Try adjusting your filters or check back later."
        action={{ label: 'Clear filters', onClick: clearFilters }}
      />
    );

  return (
    <div>
      {data.map((c) => (
        <ClubCard key={c.id} club={c} />
      ))}
    </div>
  );
}
```

---

_End of Part 5. Continue with `spec-part6-delivery.md` for Project Structure, Dev Standards, Development Phases, Sprint Planning, Backend Integration Strategy, Risks, and Final Production Checklist._
