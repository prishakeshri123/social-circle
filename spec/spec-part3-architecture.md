# Social Circle — Frontend Technical Specification

## Part 3: Frontend Architecture · Routing · State Management · Component Library · UI Design System

> **Document Series:** Part 3 of 6.
> Cross-reference: `spec-part1-foundation.md` (PRD summary), `spec-part2-screens.md` (screen list), `spec-part4-backend-mock.md` (API contracts + data models).
>
> **Scope note:** The Admin Dashboard is out of scope — already built separately. It owns club creation/onboarding, event creation, club settings editing, and all club/member/chat moderation. This repo has no admin routes, folders, or components at all.

---

# Section 6 — Frontend Architecture

## 6.1 Architecture Philosophy

Social Circle uses a **Feature-First Architecture** layered over **Atomic Design** principles. The folder structure mirrors product features (clubs, chat, events) rather than technical layers. This makes it natural for multiple developers to own distinct vertical slices without stepping on each other.

Shared infrastructure (design system, hooks, utilities, auth) is kept in dedicated `shared/` directories.

## 6.2 Folder Structure

```
social-circle/
+-- public/
|   +-- favicon.ico
|   +-- robots.txt
|   +-- manifest.json
|   \-- sw.js                        # Service worker placeholder
|
+-- src/
|   +-- app/                         # App shell - root router, global providers
|   |   +-- App.tsx
|   |   +-- providers.tsx            # QueryClient, ThemeProvider, Toaster wrappers
|   |   \-- router.tsx               # React Router v7 route definitions
|   |
|   +-- features/                    # Feature modules (vertical slices)
|   |   |
|   |   +-- auth/
|   |   |   +-- components/
|   |   |   |   +-- LoginForm.tsx
|   |   |   |   +-- SignUpForm.tsx
|   |   |   |   +-- OtpInput.tsx
|   |   |   |   +-- ForgotPasswordForm.tsx
|   |   |   |   \-- SocialLoginButtons.tsx
|   |   |   +-- hooks/
|   |   |   |   +-- useLogin.ts
|   |   |   |   +-- useSignUp.ts
|   |   |   |   \-- useOtpVerify.ts
|   |   |   +-- pages/
|   |   |   |   +-- LoginPage.tsx
|   |   |   |   +-- SignUpPage.tsx
|   |   |   |   +-- OtpPage.tsx
|   |   |   |   +-- ForgotPasswordPage.tsx
|   |   |   |   \-- SocialCallbackPage.tsx
|   |   |   +-- services/
|   |   |   |   \-- authService.ts
|   |   |   \-- index.ts
|   |   |
|   |   +-- onboarding/
|   |   |   +-- components/
|   |   |   |   +-- ProfileStep1.tsx
|   |   |   |   +-- ProfileStep2.tsx
|   |   |   |   \-- OnboardingProgress.tsx
|   |   |   +-- hooks/useOnboarding.ts
|   |   |   +-- pages/
|   |   |   |   +-- ProfileSetupPage.tsx
|   |   |   |   \-- InterestsPage.tsx
|   |   |   \-- index.ts
|   |   |
|   |   +-- discovery/
|   |   |   +-- components/
|   |   |   |   +-- ClubCard.tsx
|   |   |   |   +-- ClubCardSkeleton.tsx
|   |   |   |   +-- CategoryFilterStrip.tsx
|   |   |   |   \-- WelcomeBanner.tsx
|   |   |   +-- hooks/
|   |   |   |   +-- useClubDiscovery.ts
|   |   |   |   \-- useInfiniteClubs.ts
|   |   |   +-- pages/
|   |   |   |   +-- HomePage.tsx
|   |   |   |   \-- SearchPage.tsx
|   |   |   \-- index.ts
|   |   |
|   |   +-- clubs/
|   |   |   +-- components/
|   |   |   |   +-- landing/
|   |   |   |   |   +-- ClubHero.tsx
|   |   |   |   |   +-- ClubAbout.tsx
|   |   |   |   |   +-- ClubHighlights.tsx
|   |   |   |   |   +-- ClubGalleryPreview.tsx
|   |   |   |   |   +-- ClubEventsStrip.tsx
|   |   |   |   |   +-- ClubMembersPreview.tsx
|   |   |   |   |   +-- ClubFAQs.tsx
|   |   |   |   |   \-- ClubStickyJoinBar.tsx
|   |   |   |   \-- dashboard/
|   |   |   |       +-- ClubDashboardTabs.tsx
|   |   |   |       \-- ClubDashboardHeader.tsx
|   |   |   +-- hooks/
|   |   |   |   +-- useClub.ts
|   |   |   |   +-- useJoinClub.ts
|   |   |   |   \-- useClubMembers.ts
|   |   |   +-- pages/
|   |   |   |   +-- ClubLandingPage.tsx
|   |   |   |   +-- ClubDashboardPage.tsx
|   |   |   |   \-- MyClubsPage.tsx
|   |   |   +-- services/clubService.ts
|   |   |   \-- index.ts
|   |   |
|   |   +-- chat/
|   |   |   +-- components/
|   |   |   |   +-- ChatWindow.tsx
|   |   |   |   +-- MessageBubble.tsx
|   |   |   |   +-- MessageInput.tsx
|   |   |   |   +-- ChannelList.tsx
|   |   |   |   +-- MessageContextMenu.tsx
|   |   |   |   +-- EmojiPicker.tsx
|   |   |   |   +-- PollCreator.tsx
|   |   |   |   +-- PollMessage.tsx
|   |   |   |   +-- VoiceNotePlayer.tsx
|   |   |   |   +-- MediaMessage.tsx
|   |   |   |   +-- PinnedMessageBar.tsx
|   |   |   |   \-- TypingIndicator.tsx
|   |   |   +-- hooks/
|   |   |   |   +-- useChatMessages.ts
|   |   |   |   +-- useSendMessage.ts
|   |   |   |   +-- useChatSocket.ts     # WebSocket hook (scaffolded, disabled in dev)
|   |   |   |   \-- useMessageSearch.ts
|   |   |   +-- pages/
|   |   |   |   +-- GroupChatPage.tsx
|   |   |   |   +-- DMInboxPage.tsx
|   |   |   |   \-- DMThreadPage.tsx
|   |   |   +-- services/chatService.ts
|   |   |   \-- index.ts
|   |   |
|   |   +-- events/
|   |   |   +-- components/
|   |   |   |   +-- EventCard.tsx
|   |   |   |   +-- EventCardSkeleton.tsx
|   |   |   |   +-- RsvpButtons.tsx
|   |   |   |   +-- AddToCalendarButton.tsx
|   |   |   |   +-- AttendeesSection.tsx
|   |   |   |   \-- EditEventModal.tsx   # Owner-only edit; see shared/constants/roles.ts
|   |   |   +-- hooks/
|   |   |   |   +-- useEvent.ts
|   |   |   |   +-- useEvents.ts
|   |   |   |   \-- useRsvp.ts
|   |   |   +-- pages/
|   |   |   |   +-- EventsListPage.tsx
|   |   |   |   \-- EventDetailPage.tsx
|   |   |   +-- services/eventService.ts
|   |   |   \-- index.ts
|   |   |
|   |   +-- albums/
|   |   |   +-- components/
|   |   |   |   +-- AlbumCard.tsx
|   |   |   |   +-- MediaGrid.tsx
|   |   |   |   +-- MediaLightbox.tsx
|   |   |   |   +-- MediaUploadZone.tsx
|   |   |   |   \-- UploadProgressItem.tsx
|   |   |   +-- hooks/
|   |   |   |   +-- useAlbums.ts
|   |   |   |   \-- useMediaUpload.ts
|   |   |   +-- pages/
|   |   |   |   +-- AlbumsPage.tsx
|   |   |   |   \-- AlbumDetailPage.tsx
|   |   |   +-- services/albumService.ts
|   |   |   \-- index.ts
|   |   |
|   |   +-- notifications/
|   |   |   +-- components/
|   |   |   |   +-- NotificationItem.tsx
|   |   |   |   +-- NotificationBell.tsx
|   |   |   |   \-- NotificationFilterTabs.tsx
|   |   |   +-- hooks/useNotifications.ts
|   |   |   +-- pages/NotificationsPage.tsx
|   |   |   +-- services/notificationService.ts
|   |   |   \-- index.ts
|   |   |
|   |   +-- payments/
|   |   |   +-- components/
|   |   |   |   +-- CheckoutSummary.tsx
|   |   |   |   +-- PaymentMethodTabs.tsx
|   |   |   |   +-- UpiPaymentForm.tsx
|   |   |   |   +-- CardPaymentForm.tsx
|   |   |   |   \-- SubscriptionCard.tsx
|   |   |   +-- hooks/
|   |   |   |   +-- useCheckout.ts
|   |   |   |   \-- useSubscriptions.ts
|   |   |   +-- pages/
|   |   |   |   +-- CheckoutPage.tsx
|   |   |   |   +-- PaymentSuccessPage.tsx
|   |   |   |   +-- PaymentFailurePage.tsx
|   |   |   |   \-- SubscriptionsPage.tsx
|   |   |   +-- services/paymentService.ts
|   |   |   \-- index.ts
|   |   |
|   |   +-- profile/
|   |   |   +-- components/
|   |   |   |   +-- ProfileHero.tsx
|   |   |   |   \-- ProfileClubsList.tsx
|   |   |   +-- hooks/useProfile.ts
|   |   |   +-- pages/
|   |   |   |   +-- UserProfilePage.tsx
|   |   |   |   \-- EditProfilePage.tsx
|   |   |   +-- services/profileService.ts
|   |   |   \-- index.ts
|   |   |
|   |   \-- settings/
|   |       +-- components/
|   |       |   +-- NotificationToggleRow.tsx
|   |       |   \-- SavedCardItem.tsx
|   |       +-- pages/
|   |       |   +-- SettingsAccountPage.tsx
|   |       |   +-- SettingsNotificationsPage.tsx
|   |       |   +-- SettingsPrivacyPage.tsx
|   |       |   \-- SettingsPaymentsPage.tsx
|   |       \-- index.ts
|   |
|   |   # Note: admin/ feature folder is NOT included — Admin Dashboard is built separately.
|   |
|   +-- shared/
|   |   +-- components/
|   |   |   +-- ui/                  # Re-exported Shadcn primitives (customised)
|   |   |   |   +-- Button.tsx
|   |   |   |   +-- Input.tsx
|   |   |   |   +-- Textarea.tsx
|   |   |   |   +-- Select.tsx
|   |   |   |   +-- Checkbox.tsx
|   |   |   |   +-- RadioGroup.tsx
|   |   |   |   +-- Switch.tsx
|   |   |   |   +-- Badge.tsx
|   |   |   |   +-- Avatar.tsx
|   |   |   |   +-- Card.tsx
|   |   |   |   +-- Dialog.tsx
|   |   |   |   +-- Sheet.tsx
|   |   |   |   +-- Drawer.tsx
|   |   |   |   +-- DropdownMenu.tsx
|   |   |   |   +-- Tabs.tsx
|   |   |   |   +-- Accordion.tsx
|   |   |   |   +-- Tooltip.tsx
|   |   |   |   +-- Popover.tsx
|   |   |   |   +-- Toast.tsx
|   |   |   |   +-- Skeleton.tsx
|   |   |   |   +-- Progress.tsx
|   |   |   |   +-- Separator.tsx
|   |   |   |   \-- ScrollArea.tsx
|   |   |   +-- layout/
|   |   |   |   +-- AppShell.tsx     # Auth shell (sidebar + topbar + outlet)
|   |   |   |   +-- AuthLayout.tsx   # Centered card layout for auth pages
|   |   |   |   +-- Sidebar.tsx
|   |   |   |   +-- TopBar.tsx
|   |   |   |   +-- BottomTabBar.tsx # Mobile navigation
|   |   |   |   \-- PageContainer.tsx
|   |   |   +-- feedback/
|   |   |   |   +-- ErrorBoundary.tsx
|   |   |   |   +-- ErrorFallback.tsx
|   |   |   |   +-- LoadingSpinner.tsx
|   |   |   |   +-- EmptyState.tsx
|   |   |   |   \-- OfflineBanner.tsx
|   |   |   \-- forms/
|   |   |       +-- FormField.tsx    # RHF + Zod integrated wrapper
|   |   |       +-- ImageUpload.tsx
|   |   |       +-- RichTextEditor.tsx  # TipTap wrapper
|   |   |       +-- TagInput.tsx
|   |   |       +-- ColorPicker.tsx
|   |   |       \-- DateTimePicker.tsx
|   |   |
|   |   +-- hooks/
|   |   |   +-- useAuth.ts           # Reads from Zustand authSlice
|   |   |   +-- useCurrentUser.ts
|   |   |   +-- useDebounce.ts
|   |   |   +-- useIntersectionObserver.ts
|   |   |   +-- useMediaQuery.ts
|   |   |   +-- useLocalStorage.ts
|   |   |   +-- useSessionStorage.ts
|   |   |   +-- useClickOutside.ts
|   |   |   +-- useScrollToBottom.ts
|   |   |   \-- usePrevious.ts
|   |   |
|   |   +-- contexts/
|   |   |   \-- ThemeContext.tsx     # Dark/light mode context
|   |   |
|   |   +-- utils/
|   |   |   +-- cn.ts               # clsx + tailwind-merge helper
|   |   |   +-- formatDate.ts       # date-fns wrappers
|   |   |   +-- formatCurrency.ts
|   |   |   +-- truncate.ts
|   |   |   +-- slugify.ts
|   |   |   +-- generateIcs.ts      # .ics calendar file generator
|   |   |   +-- sanitize.ts         # DOMPurify wrapper for rich text
|   |   |   +-- animations.ts       # Framer Motion variant presets
|   |   |   \-- validators.ts       # Shared Zod schemas
|   |   |
|   |   \-- constants/
|   |       +-- queryKeys.ts        # TanStack Query key factories
|   |       +-- routes.ts           # Typed route constants
|   |       +-- categories.ts       # Club category list
|   |       +-- roles.ts            # isClubOwner ownership helper -- not an RBAC enum
|   |       \-- locales/
|   |           \-- en.ts           # All user-facing strings (i18n-ready)
|   |
|   +-- store/                      # Zustand stores
|   |   +-- authSlice.ts
|   |   +-- uiSlice.ts
|   |   +-- chatSlice.ts
|   |   \-- index.ts
|   |
|   +-- services/                   # HTTP layer
|   |   +-- apiClient.ts            # Axios instance, base URL, auth interceptor
|   |   \-- mockAdapter.ts          # axios-mock-adapter setup
|   |
|   +-- mock/                       # Mock data (see Part 4)
|   |   +-- data/
|   |   \-- handlers/
|   |
|   +-- types/                      # Global TypeScript types
|   |   +-- api.types.ts
|   |   +-- auth.types.ts
|   |   +-- club.types.ts
|   |   +-- event.types.ts
|   |   +-- chat.types.ts
|   |   +-- user.types.ts
|   |   \-- payment.types.ts
|   |
|   +-- assets/
|   |   +-- images/
|   |   +-- icons/                  # Custom SVG icons (beyond Lucide)
|   |   \-- animations/             # Lottie JSON files
|   |
|   \-- styles/
|       +-- globals.css             # Tailwind base + custom CSS variables
|       \-- animations.css          # Keyframe animations
|
+-- index.html
+-- vite.config.ts
+-- tailwind.config.ts
+-- tsconfig.json
+-- tsconfig.app.json
+-- .eslintrc.cjs
+-- .prettierrc
+-- postcss.config.js
\-- package.json
```

## 6.3 Component Architecture

### Atomic Design Levels

| Level     | Location                                                  | Examples                               |
| --------- | --------------------------------------------------------- | -------------------------------------- |
| Atoms     | `shared/components/ui/`                                   | Button, Input, Badge, Avatar, Skeleton |
| Molecules | `shared/components/forms/`, `shared/components/feedback/` | FormField, EmptyState, LoadingSpinner  |
| Organisms | `features/*/components/`                                  | ClubCard, MessageBubble, EventCard     |
| Templates | `shared/components/layout/`                               | AppShell, AuthLayout                   |
| Pages     | `features/*/pages/`                                       | HomePage, ClubDashboardPage            |

### Component Conventions

Every component file follows this structure:

```tsx
// types
interface Props {
  // ...
}

// component
export function ComponentName({ prop1, prop2 }: Props) {
  // hooks
  // derived state
  // handlers
  return (/* JSX */);
}
```

- Named exports only (no default exports — better tree-shaking + import visibility)
- Co-located test: `ComponentName.test.tsx` in same folder
- Co-located story: `ComponentName.stories.tsx` if using Storybook

## 6.4 Error Boundaries

Error boundaries wrap all route-level pages and the chat module independently:

```tsx
// app/router.tsx (simplified)
<ErrorBoundary fallback={<ErrorFallback />}>
  <Suspense fallback={<PageSkeleton />}>
    <Outlet />
  </Suspense>
</ErrorBoundary>
```

Three levels:

1. **Root boundary** — catches catastrophic failures, shows full-page error
2. **Route boundary** — per-page boundary wrapping each lazy-loaded page
3. **Widget boundary** — for chat, notification bell, and payment widgets (independent failure does not break whole page)

## 6.5 Lazy Loading & Code Splitting

All page components are lazy-loaded:

```tsx
const HomePage = lazy(() => import('@/features/discovery/pages/HomePage'));
const ClubDashboardPage = lazy(() => import('@/features/clubs/pages/ClubDashboardPage'));
```

Vite auto-splits on dynamic imports. Manual chunk hints for large features:

```ts
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        charts: ['recharts'],
        editor: ['@tiptap/react', '@tiptap/starter-kit'],
      }
    }
  }
}
```

---

# Section 7 — Routing Specification

## 7.1 Route File (`src/app/router.tsx`)

```tsx
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  // --- Public routes --------------------------------------------------
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/verify-otp', element: <OtpPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/auth/callback', element: <SocialCallbackPage /> },
    ],
  },
  // Public home/discovery feed — no auth needed. HomePage / SearchPage read
  // useAuth() internally to personalise; they are NOT wrapped in AuthGuard.
  // AppShell still renders (with a guest-mode header) so member routes and
  // this page share layout/chrome.
  {
    path: '/home',
    element: (
      <AppShell>
        <HomePage />
      </AppShell>
    ),
  },
  {
    path: '/search',
    element: (
      <AppShell>
        <SearchPage />
      </AppShell>
    ),
  },
  // Public club landing page (no auth needed)
  { path: '/clubs/:slug', element: <ClubLandingPage /> },
  // Public event detail (no auth needed) — S-37, distinct from the
  // authenticated dashboard event view at /clubs/:slug/dashboard/events/:eventId
  { path: '/clubs/:slug/events/:eventId', element: <PublicEventDetailPage /> },
  // Redirect root to home
  { path: '/', element: <Navigate to="/home" replace /> },

  // --- Onboarding routes (auth + incomplete profile) ------------------
  {
    element: (
      <OnboardingGuard>
        <Outlet />
      </OnboardingGuard>
    ),
    children: [
      { path: '/onboarding/profile', element: <ProfileSetupPage /> },
      { path: '/onboarding/interests', element: <InterestsPage /> },
    ],
  },

  // --- Member routes (auth + complete profile) ------------------------
  {
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    children: [
      { path: '/my-clubs', element: <MyClubsPage /> },
      { path: '/notifications', element: <NotificationsPage /> },
      { path: '/messages', element: <DMInboxPage /> },
      { path: '/messages/:userId', element: <DMThreadPage /> },
      { path: '/profile/:userId', element: <UserProfilePage /> },
      { path: '/profile/edit', element: <EditProfilePage /> },
      { path: '/settings', element: <SettingsAccountPage /> },
      { path: '/settings/notifications', element: <SettingsNotificationsPage /> },
      { path: '/settings/privacy', element: <SettingsPrivacyPage /> },
      { path: '/settings/payments', element: <SettingsPaymentsPage /> },
      { path: '/subscriptions', element: <SubscriptionsPage /> },
      { path: '/checkout/:planId', element: <CheckoutPage /> },
      { path: '/checkout/success', element: <PaymentSuccessPage /> },
      { path: '/checkout/failure', element: <PaymentFailurePage /> },

      // Club dashboard (nested tabs)
      {
        path: '/clubs/:slug/dashboard',
        element: <ClubDashboardPage />,
        children: [
          { index: true, element: <Navigate to="chat" replace /> },
          { path: 'chat', element: <GroupChatPage /> },
          { path: 'events', element: <EventsListPage /> },
          // EditEventModal renders inline on EventDetailPage for the owning
          // member (isClubOwner(membership) === true) -- not a separate route.
          { path: 'events/:eventId', element: <EventDetailPage /> },
          { path: 'albums', element: <AlbumsPage /> },
          { path: 'albums/:albumId', element: <AlbumDetailPage /> },
          { path: 'members', element: <MembersPage /> },
          { path: 'members/:userId', element: <MemberProfilePage /> },
          { path: 'about', element: <ClubAboutPage /> },
          { path: 'payments', element: <ClubPaymentsPage /> },
        ],
      },
    ],
  },

  // --- Admin routes — out of scope (Admin Dashboard built separately;   -----
  // --- covers club/event creation, club settings, and all moderation)  -----

  // --- Error routes ---------------------------------------------------
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  { path: '/maintenance', element: <MaintenancePage /> },
  { path: '*', element: <NotFoundPage /> },
]);
```

## 7.2 Route Guards

### `AuthGuard`

```tsx
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return <>{children}</>;
}
```

### `OnboardingGuard`

Redirects to `/home` if profile is already complete. Redirects to `/login` if not authenticated.

There is no role-based route guard in this app (no `RoleGuard`, no `ClubOwnerGuard`) — every authenticated member reaches the same routes. The only place ownership matters is `EventDetailPage`, which derives a boolean inline rather than gating a route:

```tsx
// features/events/pages/EventDetailPage.tsx (excerpt)
import { isClubOwner } from '@/shared/constants/roles';

const { data: membership } = useClubMembership(club.id);
const isOwner = isClubOwner(membership);
// isOwner conditionally renders the Edit Event / Cancel Event buttons —
// no separate route, no redirect if false.
```

### `useRequireAuth` (action gate, not a route guard)

Used inside public pages (S-08 Home, S-09 Search, S-10 Club Landing, S-37 Public Event Detail) to gate individual CTAs — Join, RSVP, Get Tickets/Buy, Message — without gating the whole route.

```tsx
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return function requireAuth(intent: string, action: () => void) {
    if (!isAuthenticated) {
      const next = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?next=${next}&intent=${intent}`);
      return;
    }
    action();
  };
}

// Usage on a ClubCard's Join button:
const requireAuth = useRequireAuth();
const handleJoin = () => requireAuth('join', () => joinClub(club.id));
```

No API call is attempted when unauthenticated — the redirect happens before `action()` runs.

## 7.3 Redirect Rules

| From                                                                                                    | To                                  | Condition                                                |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------- |
| `/`                                                                                                     | `/home`                             | Always                                                   |
| `/login`                                                                                                | `/home`                             | Already authenticated                                    |
| Gated CTA (Join/RSVP/Buy/Message) on `/home`, `/search`, `/clubs/:slug`, `/clubs/:slug/events/:eventId` | `/login?next=<url>&intent=<action>` | Not authenticated, `useRequireAuth` intercepts the click |
| `/clubs/:slug/dashboard/*`, `/my-clubs`, `/messages`, etc.                                              | `/login?next=<url>`                 | Not authenticated (still route-gated via `AuthGuard`)    |
| Post-login                                                                                              | `?next` param or `/home`            | —                                                        |
| Post-onboarding-complete                                                                                | `/home`                             | —                                                        |

---

# Section 8 — State Management

## 8.1 What Belongs Where

| Data Category                  | Store                              | Reason                                                         |
| ------------------------------ | ---------------------------------- | -------------------------------------------------------------- |
| Auth token, current user       | Zustand `authSlice`                | Persisted to localStorage; needed synchronously by `AuthGuard` |
| UI state (sidebar open, theme) | Zustand `uiSlice`                  | Synchronous, global, no async                                  |
| Chat messages (loaded page)    | TanStack Query                     | Server-owned data; invalidated on reconnect                    |
| Clubs list, events, albums     | TanStack Query                     | Server data with stale-while-revalidate                        |
| Notification count (badge)     | TanStack Query + Zustand `uiSlice` | Query fetches count; slice holds live increment from WS        |
| Unread chat messages           | Zustand `chatSlice`                | Updated by WebSocket events; needs real-time mutation          |
| Form state                     | React Hook Form (local)            | Ephemeral; no global sharing needed                            |
| URL filters / search           | URL query params                   | Shareable links; browser back works correctly                  |
| Modal open state               | React `useState` (local)           | Purely local; no sharing                                       |
| Draft text in message input    | React `useState` (local)           | Per-chat-window ephemeral state                                |
| User notification preferences  | TanStack Query + optimistic        | Server-owned; optimistic toggle                                |

## 8.2 Zustand Store Structure

```ts
// store/authSlice.ts
interface AuthSlice {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (partial: Partial<User>) => void;
}

// store/uiSlice.ts
interface UiSlice {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  notificationBadgeCount: number;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: UiSlice['theme']) => void;
  incrementNotificationBadge: () => void;
  clearNotificationBadge: () => void;
}

// store/chatSlice.ts
interface ChatSlice {
  unreadCounts: Record<string, number>; // channelId -> count
  draftMessages: Record<string, string>; // channelId -> draft text
  incrementUnread: (channelId: string) => void;
  clearUnread: (channelId: string) => void;
  setDraft: (channelId: string, text: string) => void;
}
```

## 8.3 TanStack Query Key Factories

```ts
// shared/constants/queryKeys.ts
export const queryKeys = {
  clubs: {
    all: ['clubs'] as const,
    list: (filters: ClubFilters) => ['clubs', 'list', filters] as const,
    detail: (slug: string) => ['clubs', slug] as const,
    members: (slug: string) => ['clubs', slug, 'members'] as const,
  },
  events: {
    byClub: (clubId: string) => ['events', clubId] as const,
    detail: (eventId: string) => ['events', 'detail', eventId] as const,
  },
  chat: {
    messages: (channelId: string, page: number) => ['chat', channelId, page] as const,
  },
  notifications: {
    list: (userId: string) => ['notifications', userId] as const,
    count: (userId: string) => ['notifications', userId, 'count'] as const,
  },
};
```

## 8.4 Cache Strategy

| Query                      | Stale Time       | Cache Time | Notes                             |
| -------------------------- | ---------------- | ---------- | --------------------------------- |
| Club discovery list        | 5 min            | 10 min     | Background refetch on focus       |
| Club detail (landing page) | 10 min           | 30 min     | Public data, changes infrequently |
| Chat messages              | 0 (always fresh) | 5 min      | Refetch on reconnect              |
| Notifications              | 1 min            | 5 min      | Polling every 30 s in dev         |
| User profile               | 5 min            | 15 min     | Only refetch on user edit         |

## 8.5 Optimistic Updates

Applied for:

- RSVP changes (Going / Interested / Not Going)
- Like on media items
- Message reactions
- Notification mark-as-read
- Notification preferences toggles

Pattern used (TanStack Query mutation):

```ts
mutation.mutate(newValue, {
  onMutate: async (newValue) => {
    await queryClient.cancelQueries({ queryKey });
    const previous = queryClient.getQueryData(queryKey);
    queryClient.setQueryData(queryKey, (old) => updateFn(old, newValue));
    return { previous };
  },
  onError: (_err, _newValue, context) => {
    queryClient.setQueryData(queryKey, context?.previous);
    toast.error('Action failed. Please try again.');
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey }),
});
```

## 8.6 Persistence

| Data             | Storage          | Duration                              |
| ---------------- | ---------------- | ------------------------------------- |
| Auth token       | `localStorage`   | Until explicit logout or token expiry |
| Refresh token    | `localStorage`   | Until explicit logout                 |
| Theme preference | `localStorage`   | Forever                               |
| Recent searches  | `localStorage`   | 30 days (cleared on logout)           |
| Message drafts   | `sessionStorage` | Until browser tab closed              |

---

# Section 11 — Component Library

## 11.1 Atom Components

### `Button`

**Purpose:** The primary interaction element across the app.

**Props:**

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'link';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
}
```

**Variants:**

- `primary`: filled brand colour, white text
- `secondary`: light grey fill, dark text
- `ghost`: transparent, hover shows subtle bg
- `destructive`: red fill for delete actions
- `outline`: bordered, transparent fill
- `link`: no border/fill, looks like an anchor

**States:** default, hover, active, focus-visible (ring), disabled (muted, not-allowed cursor), loading (spinner replaces content)

**Accessibility:** `role="button"`, `aria-disabled` on disabled, `aria-busy` on loading, `tabIndex` managed.

---

### `Avatar`

**Props:**

```ts
interface AvatarProps {
  src?: string;
  name: string; // Used for fallback initials
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean; // Shows green dot
  shape: 'circle' | 'square';
}
```

**Fallback:** Generates a coloured circle with 1-2 initials. Colour deterministically derived from name hash.

---

### `Badge`

**Props:**

```ts
interface BadgeProps {
  variant: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size: 'sm' | 'md';
  dot?: boolean; // Show coloured dot prefix
}
```

---

### `Skeleton`

Pulse-animation placeholder. Takes `className` for shape/size.

```tsx
<Skeleton className="h-4 w-32 rounded-md" />
```

---

## 11.2 Molecule Components

### `FormField`

Wraps React Hook Form `Controller` + Zod error display.

**Props:**

```ts
interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  required?: boolean;
  children: (field: ControllerRenderProps<T>) => ReactNode;
}
```

Usage:

```tsx
<FormField control={form.control} name="email" label="Email address" required>
  {(field) => <Input type="email" {...field} />}
</FormField>
```

Renders: label -> input (slot) -> helper text -> error message (from Zod).

---

### `EmptyState`

```ts
interface EmptyStateProps {
  icon?: LucideIcon;
  illustration?: string; // SVG path
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}
```

---

### `DataTable`

General-purpose sortable, filterable data table — used for member lists, transaction history, attendee lists.

**Features:**

- Column definition with header, accessor, cell renderer
- Sortable columns (click header)
- Checkbox multi-select
- Pagination (page selector + page size)
- Global search filter input
- Column visibility toggle
- Row action menu slot
- Loading state: skeleton rows

Built on TanStack Table v8.

---

## 11.3 Organism Components

### `ClubCard`

Displays a club in discovery/search grids. Memoized with `React.memo`.

**Props:**

```ts
interface ClubCardProps {
  club: ClubSummary;
  onJoin?: (clubId: string) => void;
  variant: 'grid' | 'list' | 'compact';
}
```

---

### `MessageBubble`

Renders a single chat message with all metadata and action hooks.

**Props:**

```ts
interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar: boolean; // False when consecutive messages from same sender
  onReply: (msg: ChatMessage) => void;
  onReact: (msg: ChatMessage, emoji: string) => void;
  onDelete: (msgId: string) => void;
}
```

---

### `EventCard`

Displays an event in the events list tab and in the landing page strip.

**Props:**

```ts
interface EventCardProps {
  event: Event;
  onRsvp?: (eventId: string, response: RsvpResponse) => void;
  variant: 'card' | 'strip' | 'detail-header';
}
```

---

# Section 12 — UI Design System

## 12.1 Colour Palette

### Brand Colours (CSS custom properties in `globals.css`)

```css
:root {
  /* Primary - deep indigo */
  --color-primary-50: #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-500: #6366f1; /* main brand */
  --color-primary-600: #4f46e5; /* hover */
  --color-primary-700: #4338ca; /* active */
  --color-primary-900: #1e1b4b;

  /* Accent - vibrant violet */
  --color-accent-500: #8b5cf6;
  --color-accent-600: #7c3aed;

  /* Success */
  --color-success-500: #22c55e;
  --color-success-100: #dcfce7;

  /* Warning */
  --color-warning-500: #f59e0b;
  --color-warning-100: #fef3c7;

  /* Error */
  --color-error-500: #ef4444;
  --color-error-100: #fee2e2;

  /* Neutral */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-700: #374151;
  --color-gray-900: #111827;

  /* Semantic */
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;
}

[data-theme='dark'] {
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-border: #334155;
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;
}
```

## 12.2 Typography

```css
/* Font stack */
--font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

| Scale       | Size | Weight  | Line Height | Usage                        |
| ----------- | ---- | ------- | ----------- | ---------------------------- |
| `text-xs`   | 12px | 400     | 1.5         | Captions, timestamps, badges |
| `text-sm`   | 14px | 400/500 | 1.5         | Secondary text, form labels  |
| `text-base` | 16px | 400     | 1.625       | Body text                    |
| `text-lg`   | 18px | 500     | 1.5         | Card titles, section headers |
| `text-xl`   | 20px | 600     | 1.4         | Page sub-headings            |
| `text-2xl`  | 24px | 700     | 1.3         | Page headings                |
| `text-3xl`  | 30px | 700     | 1.2         | Hero headings                |
| `text-4xl`  | 36px | 800     | 1.1         | Landing hero                 |

## 12.3 Spacing Scale

Tailwind default 4px base unit. Custom additions:

```ts
// tailwind.config.ts
extend: {
  spacing: {
    18: '4.5rem',
    22: '5.5rem',
    sidebar:    '16rem',   // 256px desktop sidebar width
    'sidebar-sm': '4rem'   // 64px collapsed icon sidebar
  }
}
```

## 12.4 Breakpoints

```ts
screens: {
  sm:  '640px',   // Mobile landscape / large phone
  md:  '768px',   // Tablet
  lg:  '1024px',  // Desktop (minimum supported)
  xl:  '1280px',  // Large desktop
  '2xl': '1536px'
}
```

## 12.5 Elevation (Shadows)

```ts
boxShadow: {
  'card':       '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
  'card-hover': '0 4px 6px -1px rgba(0,0,0,0.1)',
  'modal':      '0 20px 25px -5px rgba(0,0,0,0.1)',
  'sidebar':    '4px 0 6px -2px rgba(0,0,0,0.05)',
}
```

## 12.6 Border Radius

```ts
borderRadius: {
  'sm':    '4px',
  DEFAULT: '8px',
  'md':    '8px',
  'lg':    '12px',
  'xl':    '16px',
  '2xl':   '24px',
  'full':  '9999px',
}
```

## 12.7 Animation System

### Framer Motion Variants (shared)

```ts
// shared/utils/animations.ts
export const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.15, ease: 'easeOut' } },
};

export const staggerChildren = {
  visible: { transition: { staggerChildren: 0.05 } },
};
```

### Page Transitions

All page routes wrap content in `<motion.div variants={fadeInUp} initial="hidden" animate="visible">`.

### Reduced Motion

```tsx
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
// Pass empty motionProps if reduced motion preferred
```

## 12.8 Icon System

Using **Lucide Icons** (tree-shakeable SVG). Key icons used:

| Context       | Icon            |
| ------------- | --------------- |
| Home          | `House`         |
| Discover      | `Compass`       |
| My Clubs      | `Users`         |
| Notifications | `Bell`          |
| Messages      | `MessageCircle` |
| Events        | `CalendarDays`  |
| Albums        | `Image`         |
| Payments      | `CreditCard`    |
| Settings      | `Settings`      |
| Search        | `Search`        |
| Create        | `Plus`          |
| Edit          | `Pencil`        |
| Delete        | `Trash2`        |
| Flag/Report   | `Flag`          |
| Block         | `Ban`           |

## 12.9 Toast Notifications

Using Shadcn/ui `Sonner` integration:

```ts
import { toast } from 'sonner';

// Usage patterns:
toast.success('Profile updated successfully.');
toast.error('Failed to load clubs. Please retry.');
toast.warning('Your session will expire in 5 minutes.');
toast.info('New message in #general.');
```

Configuration:

- Position: top-right on desktop, top-center on mobile
- Duration: 4 seconds (success), 6 seconds (error), persistent (warning)
- Max visible: 5 toasts

## 12.10 Dark Mode

Implemented via `data-theme` attribute on `<html>`. ThemeContext reads user preference from `localStorage`. System default via `prefers-color-scheme` media query.

Toggle in Settings > Account and in the top bar (moon/sun icon).

CSS variables (section 12.1) handle all colour switching — no conditional class logic in components.

---

_End of Part 3. Continue with `spec-part4-backend-mock.md` for Mock Backend Architecture, Data Models, API Contract, Authentication, and Notifications._
