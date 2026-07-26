# Social Circle Frontend Technical Specification

## Part 6: Project Structure Â· Dev Standards Â· Development Phases Â· Sprint Planning Â· Backend Integration Â· Risks Â· Final Checklist

> **Document Series:** Part 6 of 6 (final part).
> Scope: Member-facing frontend only. Club/event onboarding, and all club/member/chat moderation tooling, are handled by the separately-built Admin Dashboard (out of scope for this project).

---

# Section 26 Complete Project Structure

```
social-circle/
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ favicon.ico
â”‚   â”œâ”€â”€ robots.txt
â”‚   â”œâ”€â”€ manifest.json
â”‚   â””â”€â”€ sw.js                          # Service worker placeholder (push notifications)
â”‚
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ App.tsx
â”‚   â”‚   â”œâ”€â”€ providers.tsx
â”‚   â”‚   â””â”€â”€ router.tsx
â”‚   â”‚
â”‚   â”œâ”€â”€ features/
â”‚   â”‚   â”œâ”€â”€ auth/
â”‚   â”‚   â”œâ”€â”€ onboarding/
â”‚   â”‚   â”œâ”€â”€ discovery/
â”‚   â”‚   â”œâ”€â”€ clubs/
â”‚   â”‚   â”œâ”€â”€ chat/
â”‚   â”‚   â”œâ”€â”€ events/
â”‚   â”‚   â”œâ”€â”€ albums/
â”‚   â”‚   â”œâ”€â”€ notifications/
â”‚   â”‚   â”œâ”€â”€ payments/
â”‚   â”‚   â”œâ”€â”€ profile/
â”‚   â”‚   â””â”€â”€ settings/
â”‚   â”‚
â”‚   â”œâ”€â”€ shared/
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â”œâ”€â”€ ui/
â”‚   â”‚   â”‚   â”œâ”€â”€ layout/
â”‚   â”‚   â”‚   â”œâ”€â”€ feedback/
â”‚   â”‚   â”‚   â””â”€â”€ forms/
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ contexts/
â”‚   â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â””â”€â”€ constants/
â”‚   â”‚
â”‚   â”œâ”€â”€ store/
â”‚   â”‚   â”œâ”€â”€ authSlice.ts
â”‚   â”‚   â”œâ”€â”€ uiSlice.ts
â”‚   â”‚   â”œâ”€â”€ chatSlice.ts
â”‚   â”‚   â””â”€â”€ index.ts
â”‚   â”‚
â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”œâ”€â”€ apiClient.ts
â”‚   â”‚   â””â”€â”€ mockAdapter.ts
â”‚   â”‚
â”‚   â”œâ”€â”€ mock/
â”‚   â”‚   â”œâ”€â”€ data/
â”‚   â”‚   â”‚   â”œâ”€â”€ users.json
â”‚   â”‚   â”‚   â”œâ”€â”€ clubs.json
â”‚   â”‚   â”‚   â”œâ”€â”€ events.json
â”‚   â”‚   â”‚   â”œâ”€â”€ albums.json
â”‚   â”‚   â”‚   â”œâ”€â”€ messages.json
â”‚   â”‚   â”‚   â”œâ”€â”€ notifications.json
â”‚   â”‚   â”‚   â”œâ”€â”€ transactions.json
â”‚   â”‚   â”‚   â””â”€â”€ categories.json
â”‚   â”‚   â”œâ”€â”€ handlers/
â”‚   â”‚   â”‚   â”œâ”€â”€ authHandlers.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ clubHandlers.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ eventHandlers.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ chatHandlers.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ albumHandlers.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ notificationHandlers.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ paymentHandlers.ts
â”‚   â”‚   â”‚   â””â”€â”€ profileHandlers.ts
â”‚   â”‚   â””â”€â”€ index.ts
â”‚   â”‚
â”‚   â”œâ”€â”€ types/
â”‚   â”‚   â”œâ”€â”€ api.types.ts
â”‚   â”‚   â”œâ”€â”€ auth.types.ts
â”‚   â”‚   â”œâ”€â”€ club.types.ts
â”‚   â”‚   â”œâ”€â”€ event.types.ts
â”‚   â”‚   â”œâ”€â”€ chat.types.ts
â”‚   â”‚   â”œâ”€â”€ user.types.ts
â”‚   â”‚   â””â”€â”€ payment.types.ts
â”‚   â”‚
â”‚   â”œâ”€â”€ assets/
â”‚   â”‚   â”œâ”€â”€ images/
â”‚   â”‚   â”œâ”€â”€ icons/
â”‚   â”‚   â””â”€â”€ animations/
â”‚   â”‚
â”‚   â””â”€â”€ styles/
â”‚       â”œâ”€â”€ globals.css
â”‚       â””â”€â”€ animations.css
â”‚
â”œâ”€â”€ index.html
â”œâ”€â”€ vite.config.ts
â”œâ”€â”€ tailwind.config.ts
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ tsconfig.app.json
â”œâ”€â”€ .eslintrc.cjs
â”œâ”€â”€ .prettierrc
â”œâ”€â”€ .gitignore
â”œâ”€â”€ postcss.config.js
â””â”€â”€ package.json
```

---

# Section 27 Development Standards

## 27.1 Naming Conventions

| Item                  | Convention                                              | Example                               |
| --------------------- | ------------------------------------------------------- | ------------------------------------- |
| Components            | PascalCase                                              | `ClubCard.tsx`, `MessageBubble.tsx`   |
| Hooks                 | camelCase + `use` prefix                                | `useClubMembers.ts`, `useDebounce.ts` |
| Utility functions     | camelCase                                               | `formatCurrency.ts`, `slugify.ts`     |
| Zustand slices        | camelCase + `Slice` suffix                              | `authSlice.ts`, `chatSlice.ts`        |
| TypeScript interfaces | PascalCase                                              | `ClubMembership`, `ChatMessage`       |
| TypeScript types      | PascalCase                                              | `ClubStatus`, `MessageType`           |
| CSS class names       | Tailwind only (no custom classes outside `globals.css`) |                                       |
| Files (non-component) | camelCase                                               | `apiClient.ts`, `queryKeys.ts`        |
| Directories           | kebab-case                                              | `club-dashboard/`, `shared/`          |
| Constants             | SCREAMING_SNAKE_CASE                                    | `MAX_FILE_SIZE_MB`, `OTP_LENGTH`      |
| Mock data IDs         | prefixed nanoid                                         | `usr_abc123`, `clu_xyz789`, `evt_001` |

## 27.2 Component Rules

- **Named exports only** no default exports for components (enables better tree-shaking and grep-ability)
- **One component per file** exception: tiny sub-components used only by the parent may be co-located
- **No inline styles** all styling via Tailwind; extract repeated patterns to a utility class
- **Props destructured in signature** not via `props.x`
- **Types defined above the component** in the same file; shared types go in `types/`
- **No business logic in JSX** extract to handlers or derived constants
- **Accessibility first** every interactive element has an accessible label

## 27.3 Hook Rules

- Hooks are called at the top level of the component/hook body (React rules)
- Custom hooks prefixed with `use`
- Hooks that wrap TanStack Query live in `features/*/hooks/`
- Hooks that are purely utilities live in `shared/hooks/`
- No direct `localStorage` / `sessionStorage` access outside `useLocalStorage` / `useSessionStorage` hooks

## 27.4 TypeScript Rules

- `strict: true` in `tsconfig.json`
- No `any` use `unknown` + type narrowing if necessary; `eslint-disable` comments forbidden for `@typescript-eslint/no-explicit-any`
- No non-null assertion (`!`) without a comment explaining why it's safe
- API response types always reference types from `types/` never inline
- Zod schemas live alongside the form they validate; shared Zod schemas in `shared/utils/validators.ts`

## 27.5 Git Commit Convention

Format: `<type>(<scope>): <description>`

| Type       | When to use                            |
| ---------- | -------------------------------------- |
| `feat`     | New feature                            |
| `fix`      | Bug fix                                |
| `style`    | UI/styling changes (no logic change)   |
| `refactor` | Code refactoring (no behaviour change) |
| `test`     | Adding or fixing tests                 |
| `docs`     | Documentation                          |
| `chore`    | Build config, deps, tooling            |
| `perf`     | Performance improvements               |

Examples:

```
feat(chat): add emoji reaction picker to message bubbles
fix(auth): clear refresh token on logout to prevent stale sessions
style(club-card): adjust badge positioning on mobile viewport
feat(events): add .ics calendar export for event detail page
```

## 27.6 Branch Strategy

```
main              <- production-ready code
  \-- develop     <- integration branch (all features merge here first)
        â”œâ”€â”€ feature/auth-otp-flow
        â”œâ”€â”€ feature/event-detail-owner-edit
        â”œâ”€â”€ feature/chat-poll-creation
        â”œâ”€â”€ fix/rsvp-optimistic-rollback
        â””â”€â”€ chore/update-tanstack-query-v5
```

- Feature branches cut from `develop`
- No direct commits to `main` or `develop`
- `main` updated only via PR from `develop` after QA sign-off

## 27.7 Pull Request Rules

Every PR must include:

- [ ] Description: what changed and why
- [ ] Screenshots / screen recording for UI changes
- [ ] Self-review completed (no debug `console.log`, no commented-out code)
- [ ] TypeScript errors: zero (`tsc --noEmit` passes)
- [ ] ESLint: zero errors (`eslint src/` passes)
- [ ] Unit tests pass if affected
- [ ] Accessibility: tested with keyboard navigation
- [ ] Mobile: tested at 375 px viewport (Chrome DevTools)

## 27.8 Code Review Checklist

Reviewer checks:

- [ ] Correct use of TanStack Query vs Zustand (see Part 3 Â§8.1)
- [ ] No prop drilling beyond 2 levels (use Zustand or Context)
- [ ] Error and empty states handled for all async data
- [ ] Loading skeletons instead of spinners for page-level data
- [ ] Optimistic updates applied to user-initiated mutations
- [ ] No hardcoded strings (use `locales/en.ts` constants)
- [ ] Images have alt text; interactive elements have aria-labels
- [ ] No `useEffect` that could be replaced by `useMemo` or derived state

---

# Section 28 Development Phases

## Phase 1 Project Setup, Foundation & Constants

**Objectives:** Establish the project skeleton AND define every constant, design token, label, and configuration value in one place before any feature work begins. Every subsequent phase imports from these files -- no magic values anywhere in the codebase.

**Estimated Hours:** 24 h

**Tasks:**

| Task                              | Subtask                                                                                                                                                                                                                           | Hours |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| Vite + React 19 + TypeScript init | `npm create vite@latest`, strict `tsconfig.json`                                                                                                                                                                                  | 1     |
| Tailwind CSS setup                | Install, `tailwind.config.ts` with full design token extension (see Â§P1-A)                                                                                                                                                       | 2     |
| Shadcn UI init                    | `npx shadcn-ui@latest init`, install Button, Input, Badge, Dialog, Sheet, Tabs, Accordion, Avatar, Skeleton, Toast, Select, Checkbox, RadioGroup, Switch, Tooltip, Popover, Progress, ScrollArea, Separator, Drawer, DropdownMenu | 2     |
| ESLint + Prettier                 | `.eslintrc.cjs`, `.prettierrc`, husky + lint-staged pre-commit hook                                                                                                                                                               | 1     |
| Folder structure                  | Create all directories from Â§26                                                                                                                                                                                                  | 0.5   |
| **Design token constants**        | `globals.css` CSS variables + `tailwind.config.ts` tokens (see Â§P1-A)                                                                                                                                                            | 2     |
| **UI / label constants**          | All label, placeholder, button text, tooltip, and empty-state strings in `locales/en.ts` (see Â§P1-B)                                                                                                                             | 2     |
| **App-wide config constants**     | Routes, roles, categories, pagination, file limits, timing in `constants/` (see Â§P1-C)                                                                                                                                           | 2     |
| **Zod validation schemas**        | Shared validators for email, phone, password, URL, file, OTP in `shared/utils/validators.ts` (see Â§P1-D)                                                                                                                         | 1.5   |
| Zustand store setup               | Store slices: `authSlice`, `uiSlice`, `chatSlice`                                                                                                                                                                                 | 2     |
| TanStack Query setup              | `QueryClient` config, `providers.tsx`, `queryKeys.ts`                                                                                                                                                                             | 1     |
| React Router v7 setup             | `router.tsx`, `AuthLayout`, `AppShell` shell, all route guards                                                                                                                                                                    | 2     |
| Axios + mock adapter              | `apiClient.ts` with interceptors, `mockAdapter.ts` wired to all handlers                                                                                                                                                          | 2     |
| Shared utilities                  | `cn.ts`, `formatDate.ts`, `formatCurrency.ts`, `sanitize.ts`, `slugify.ts`, `generateIcs.ts`, `animations.ts`                                                                                                                     | 1     |

**Risks:** Version compatibility between React 19 and Radix UI. Pin `@radix-ui/*` to tested versions.

**Dependencies:** None -- first phase.

**Definition of Done:**

- App starts with `npm run dev` with zero console errors
- Navigating to `/login` renders a blank `AuthLayout` page
- All constant files exist and TypeScript resolves all imports
- ESLint and TypeScript pass with zero errors
- No hardcoded string, colour, number, or route path anywhere outside the constants files

---

### P1-A -- Design Token Constants

Two files define every visual token. Nothing is hardcoded in component files.

**`src/styles/globals.css`**

```css
:root {
  /* â”€â”€ Brand colours â”€â”€ */
  --color-primary-50: #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;
  --color-primary-900: #1e1b4b;

  --color-accent-500: #8b5cf6;
  --color-accent-600: #7c3aed;

  /* â”€â”€ Semantic status â”€â”€ */
  --color-success-100: #dcfce7;
  --color-success-500: #22c55e;
  --color-warning-100: #fef3c7;
  --color-warning-500: #f59e0b;
  --color-error-100: #fee2e2;
  --color-error-500: #ef4444;
  --color-info-100: #dbeafe;
  --color-info-500: #3b82f6;

  /* â”€â”€ Neutrals â”€â”€ */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-700: #374151;
  --color-gray-900: #111827;

  /* â”€â”€ Semantic surfaces (light mode) â”€â”€ */
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-surface-raised: #ffffff;
  --color-border: #e5e7eb;
  --color-border-strong: #d1d5db;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;
  --color-text-inverse: #ffffff;

  /* â”€â”€ Typography â”€â”€ */
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* â”€â”€ Radius â”€â”€ */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* â”€â”€ Z-index layers â”€â”€ */
  --z-base: 0;
  --z-raised: 10;
  --z-overlay: 100;
  --z-modal: 200;
  --z-toast: 300;
  --z-tooltip: 400;

  /* â”€â”€ Animation durations â”€â”€ */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-page: 250ms;

  /* â”€â”€ Sidebar widths â”€â”€ */
  --sidebar-width: 16rem;
  --sidebar-width-sm: 4rem;
}

[data-theme='dark'] {
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-surface-raised: #334155;
  --color-border: #334155;
  --color-border-strong: #475569;
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;
  --color-text-inverse: #0f172a;
}
```

**`tailwind.config.ts`** (the `extend` block -- references the CSS variables above):

```ts
extend: {
  colors: {
    primary: {
      50: 'var(--color-primary-50)',
      100: 'var(--color-primary-100)',
      500: 'var(--color-primary-500)',
      600: 'var(--color-primary-600)',
      700: 'var(--color-primary-700)',
      900: 'var(--color-primary-900)',
    },
    accent:  { 500: 'var(--color-accent-500)',  600: 'var(--color-accent-600)' },
    success: { 100: 'var(--color-success-100)', 500: 'var(--color-success-500)' },
    warning: { 100: 'var(--color-warning-100)', 500: 'var(--color-warning-500)' },
    error:   { 100: 'var(--color-error-100)',   500: 'var(--color-error-500)'   },
    info:    { 100: 'var(--color-info-100)',     500: 'var(--color-info-500)'    },
    surface: 'var(--color-surface)',
    border:  'var(--color-border)',
  },
  fontFamily: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  },
  fontSize: {
    'xs':   ['12px', { lineHeight: '1.5' }],
    'sm':   ['14px', { lineHeight: '1.5' }],
    'base': ['16px', { lineHeight: '1.625' }],
    'lg':   ['18px', { lineHeight: '1.5' }],
    'xl':   ['20px', { lineHeight: '1.4' }],
    '2xl':  ['24px', { lineHeight: '1.3' }],
    '3xl':  ['30px', { lineHeight: '1.2' }],
    '4xl':  ['36px', { lineHeight: '1.1' }],
  },
  spacing: {
    '18': '4.5rem',
    '22': '5.5rem',
    'sidebar':    'var(--sidebar-width)',
    'sidebar-sm': 'var(--sidebar-width-sm)',
  },
  borderRadius: {
    'sm':    'var(--radius-sm)',
    DEFAULT: 'var(--radius-md)',
    'md':    'var(--radius-md)',
    'lg':    'var(--radius-lg)',
    'xl':    'var(--radius-xl)',
    '2xl':   'var(--radius-2xl)',
    'full':  'var(--radius-full)',
  },
  boxShadow: {
    'card':       '0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)',
    'card-hover': '0 4px 6px -1px rgba(0,0,0,0.10)',
    'modal':      '0 20px 25px -5px rgba(0,0,0,0.10)',
    'sidebar':    '4px 0 6px -2px rgba(0,0,0,0.05)',
  },
  transitionDuration: {
    'fast':   'var(--duration-fast)',
    'normal': 'var(--duration-normal)',
    'slow':   'var(--duration-slow)',
  },
  zIndex: {
    'raised':  'var(--z-raised)',
    'overlay': 'var(--z-overlay)',
    'modal':   'var(--z-modal)',
    'toast':   'var(--z-toast)',
    'tooltip': 'var(--z-tooltip)',
  },
  screens: {
    'sm':  '640px',
    'md':  '768px',
    'lg':  '1024px',
    'xl':  '1280px',
    '2xl': '1536px',
  },
}
```

---

### P1-B -- UI Label Constants (`src/shared/constants/locales/en.ts`)

Every user-facing string lives here. No string literals anywhere else in the codebase.

```ts
export const en = {
  // â”€â”€ Common actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  actions: {
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    submit: 'Submit',
    retry: 'Try again',
    back: 'Back',
    next: 'Next',
    skip: 'Skip for now',
    done: 'Done',
    close: 'Close',
    upload: 'Upload',
    remove: 'Remove',
    add: 'Add',
    send: 'Send',
    search: 'Search',
    filter: 'Filter',
    clearFilters: 'Clear filters',
    loadMore: 'Load more',
    copyLink: 'Copy link',
    download: 'Download',
    share: 'Share',
    report: 'Report',
    block: 'Block',
    unblock: 'Unblock',
    markAllRead: 'Mark all as read',
    viewAll: 'View all',
    goHome: 'Go to Home',
    goBack: 'Go back',
    learnMore: 'Learn more',
  },

  // â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  auth: {
    loginTitle: 'Welcome back',
    loginCta: 'Log In',
    loginLoading: 'Logging in...',
    signupTitle: 'Create your account',
    signupCta: 'Create Account',
    signupLoading: 'Creating account...',
    noAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    signUpLink: 'Sign up',
    loginLink: 'Log in',
    forgotPassword: 'Forgot password?',
    rememberMe: 'Remember me',
    orContinueWith: 'or continue with',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    continueWithFacebook: 'Continue with Facebook',
    otpTitle: 'Verify your',
    otpSubtitle: 'We sent a 6-digit code to',
    otpChange: 'Change',
    otpResend: 'Resend code',
    otpResendIn: 'Resend in',
    otpVerifyCta: 'Verify',
    otpDevHint: 'Dev hint: your code is 123456',
    forgotTitle: 'Reset your password',
    forgotCta: 'Send OTP',
    resetTitle: 'Create new password',
    resetCta: 'Reset Password',
    logoutConfirm: 'Are you sure you want to log out?',
    logoutSuccess: 'You have been logged out successfully.',
    sessionExpired: 'Your session has expired. Please log in again.',
    completeSignIn: 'Completing sign in...',
    signInFailed: 'Sign in failed. Please try again.',
  },

  // â”€â”€ Forms: labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  labels: {
    fullName: 'Full name',
    email: 'Email address',
    phone: 'Phone number',
    password: 'Password',
    confirmPassword: 'Confirm password',
    bio: 'Bio',
    city: 'City / Region',
    website: 'Website URL',
    eventTitle: 'Event title',
    description: 'Description',
    coverImage: 'Cover image',
    eventDate: 'Date',
    eventTime: 'Time',
    timezone: 'Timezone',
    locationType: 'Location type',
    physicalAddress: 'Physical address',
    virtualLink: 'Virtual meeting link',
    capacity: 'Capacity',
    rsvpDeadline: 'RSVP deadline',
    albumTitle: 'Album title',
    caption: 'Caption',
    upiId: 'UPI ID',
    cardNumber: 'Card number',
    cardExpiry: 'Expiry (MM/YY)',
    cardCvv: 'CVV',
    cardName: 'Name on card',
    discountCode: 'Discount code',
  },

  // â”€â”€ Forms: placeholders â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  placeholders: {
    fullName: 'e.g. Priya Sharma',
    email: 'you@example.com',
    phone: '+91 98765 43210',
    password: 'At least 8 characters',
    bio: 'Tell people a little about yourself...',
    city: 'e.g. Mumbai',
    website: 'https://yourwebsite.com',
    search: 'Search clubs, events, people...',
    eventTitle: 'e.g. Saturday Morning Run',
    physicalAddress: 'Full address including city and PIN',
    virtualLink: 'https://meet.google.com/...',
    albumTitle: 'e.g. August Hike Photos',
    caption: 'Add a caption...',
    upiId: 'yourname@upi',
    message: 'Type a message...',
    discountCode: 'Enter code',
  },

  // â”€â”€ Forms: validation error messages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  errors: {
    required: 'This field is required.',
    emailInvalid: 'Please enter a valid email address.',
    phoneInvalid: 'Please enter a valid phone number.',
    passwordMin: 'Password must be at least 8 characters.',
    passwordWeak: 'Password must include 1 uppercase, 1 number, and 1 special character.',
    passwordMatch: 'Passwords do not match.',
    nameTooShort: 'Name must be at least 2 characters.',
    nameTooLong: 'Name must be at most 100 characters.',
    bioTooLong: 'Bio must be 160 characters or less.',
    urlInvalid: 'Please enter a valid URL.',
    fileTooLarge: (max: string) => `File is too large. Maximum size is ${max}.`,
    fileTypeInvalid: 'Invalid file type. Please use JPG, PNG, or WebP.',
    videoFileTooLarge: 'Video file is too large. Maximum size is 50 MB.',
    otpInvalid: 'The code you entered is incorrect.',
    otpExpired: 'This code has expired. Please request a new one.',
    otpMaxAttempts: 'Too many attempts. Please wait 5 minutes and try again.',
    dateMustBeFuture: 'Event date must be in the future.',
    endBeforeStart: 'End time must be after start time.',
    atLeastOneInterest: 'Please select at least one interest.',
    termsRequired: 'You must accept the terms to continue.',
    emailExists: 'An account with this email already exists. Try logging in.',
    invalidCredentials: 'Invalid email or password. Please try again.',
    accountLocked: 'Account temporarily locked. Please try again in 30 minutes.',
    sessionExpired: 'Your session has expired. Please log in again.',
    networkError: 'Something went wrong. Please check your connection and retry.',
    serverError: 'A server error occurred. Please try again.',
    notFound: 'The page you are looking for does not exist.',
    unauthorized: 'You do not have permission to view this page.',
  },

  // â”€â”€ Forms: success messages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  success: {
    profileSaved: 'Profile updated successfully.',
    passwordReset: 'Password reset successfully. Please log in.',
    eventUpdated: 'Event updated successfully.',
    eventCancelled: 'Event cancelled. Members have been notified.',
    albumCreated: 'Album created.',
    mediaUploaded: 'Photos uploaded successfully.',
    messageSent: 'Message sent.',
    rsvpSaved: 'Your RSVP has been saved.',
    paymentSuccess: 'Payment successful!',
    subscriptionCancelled: 'Subscription cancelled. You have access until',
    linkCopied: 'Link copied to clipboard.',
    settingsSaved: 'Settings saved.',
  },

  // â”€â”€ Empty states â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  empty: {
    noClubs: 'No clubs found. Try adjusting your filters.',
    noClubsJoined: "You haven't joined any clubs yet.",
    noClubsJoinedCta: 'Discover clubs',
    noEvents: 'No upcoming events. Check back soon.',
    noAlbums: 'No albums yet.',
    noMedia: 'No photos or videos in this album.',
    noMessages: 'No conversations yet.',
    noMessagesCta: 'Find a club member and start chatting.',
    noNotifications: "You're all caught up! No new notifications.",
    noResults: (query: string) => `No results for "${query}". Try different keywords.`,
    noSubscriptions: 'You have no active subscriptions.',
    noMembers: 'No members found.',
    searchPrompt: 'Start typing to search clubs, events and people.',
  },

  // â”€â”€ Navigation labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  nav: {
    home: 'Home',
    discover: 'Discover',
    myClubs: 'My Clubs',
    notifications: 'Notifications',
    messages: 'Messages',
    profile: 'Profile',
    editProfile: 'Edit Profile',
    settings: 'Settings',
    subscriptions: 'My Subscriptions',
    helpCentre: 'Help Centre',
    logout: 'Log Out',
  },

  // â”€â”€ Club dashboard tab labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  tabs: {
    chat: 'Chat',
    events: 'Events',
    albums: 'Albums',
    members: 'Members',
    about: 'About',
    payments: 'Payments',
  },

  // â”€â”€ Settings section labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  settings: {
    account: 'Account',
    notifications: 'Notifications',
    privacy: 'Privacy',
    payments: 'Payments & Billing',
  },

  // â”€â”€ Payment / checkout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  payment: {
    checkoutTitle: 'Complete your purchase',
    orderSummary: 'Order summary',
    paymentMethod: 'Payment method',
    upi: 'UPI',
    card: 'Debit / Credit Card',
    netBanking: 'Net Banking',
    wallet: 'Wallet',
    payCta: (amount: string) => `Pay ${amount}`,
    payLoading: 'Processing payment...',
    successTitle: 'Payment Successful!',
    successBody: 'You now have full access to the club.',
    failureTitle: 'Payment Failed',
    failureBody: 'Your payment could not be processed.',
    tryAgain: 'Try Again',
    chooseDifferent: 'Choose Different Method',
    downloadReceipt: 'Download Receipt',
    cancelSub: 'Cancel Subscription',
    cancelConfirm: 'Your access will continue until',
    freeLabel: 'FREE',
    paidLabel: 'PAID',
  },
} as const;

export type Translations = typeof en;
```

---

### P1-C -- App-Wide Config Constants (`src/shared/constants/`)

**`routes.ts`** -- every URL path in one place:

```ts
export const ROUTES = {
  home: '/home',
  search: '/search',
  myClubs: '/my-clubs',
  notifications: '/notifications',
  messages: '/messages',
  messageThread: (userId: string) => `/messages/${userId}`,
  profile: (userId: string) => `/profile/${userId}`,
  profileEdit: '/profile/edit',
  settings: '/settings',
  settingsNotifs: '/settings/notifications',
  settingsPrivacy: '/settings/privacy',
  settingsPayments: '/settings/payments',
  subscriptions: '/subscriptions',
  checkout: (planId: string) => `/checkout/${planId}`,
  checkoutSuccess: '/checkout/success',
  checkoutFailure: '/checkout/failure',
  login: '/login',
  signup: '/signup',
  verifyOtp: '/verify-otp',
  forgotPassword: '/forgot-password',
  authCallback: '/auth/callback',
  onboardingProfile: '/onboarding/profile',
  onboardingInterests: '/onboarding/interests',
  clubLanding: (slug: string) => `/clubs/${slug}`,
  clubDashboard: (slug: string) => `/clubs/${slug}/dashboard`,
  clubChat: (slug: string) => `/clubs/${slug}/dashboard/chat`,
  clubEvents: (slug: string) => `/clubs/${slug}/dashboard/events`,
  clubEventDetail: (slug: string, eventId: string) => `/clubs/${slug}/dashboard/events/${eventId}`,
  clubAlbums: (slug: string) => `/clubs/${slug}/dashboard/albums`,
  clubAlbumDetail: (slug: string, albumId: string) => `/clubs/${slug}/dashboard/albums/${albumId}`,
  clubMembers: (slug: string) => `/clubs/${slug}/dashboard/members`,
  clubMemberProfile: (slug: string, userId: string) => `/clubs/${slug}/dashboard/members/${userId}`,
  clubAbout: (slug: string) => `/clubs/${slug}/dashboard/about`,
  clubPayments: (slug: string) => `/clubs/${slug}/dashboard/payments`,
  notFound: '/404',
  unauthorized: '/unauthorized',
  maintenance: '/maintenance',
} as const;
```

**`roles.ts`** -- not an RBAC system; this app has one audience (members). The only thing this file does is decide whether the current member owns a given club, to show/hide the Edit/Cancel Event actions on Event Detail:

```ts
import type { ClubMembership } from '@/types/club.types';

export function isClubOwner(membership: Pick<ClubMembership, 'role'> | null | undefined): boolean {
  return membership?.role === 'owner';
}
```

**`categories.ts`** -- club category list (single source for discovery chips + search filters):

```ts
export const CATEGORIES = [
  { slug: 'sports', label: 'Sports', icon: 'Dumbbell' },
  { slug: 'music', label: 'Music', icon: 'Music' },
  { slug: 'tech', label: 'Tech', icon: 'Cpu' },
  { slug: 'gaming', label: 'Gaming', icon: 'Gamepad2' },
  { slug: 'travel', label: 'Travel', icon: 'Plane' },
  { slug: 'food', label: 'Food & Dining', icon: 'UtensilsCrossed' },
  { slug: 'arts', label: 'Arts & Crafts', icon: 'Palette' },
  { slug: 'photography', label: 'Photography', icon: 'Camera' },
  { slug: 'books', label: 'Books', icon: 'BookOpen' },
  { slug: 'alumni', label: 'Alumni', icon: 'GraduationCap' },
  { slug: 'professional', label: 'Professional', icon: 'Briefcase' },
  { slug: 'ngo', label: 'NGO / Cause', icon: 'Heart' },
  { slug: 'outdoors', label: 'Outdoors', icon: 'Mountain' },
  { slug: 'fitness', label: 'Fitness', icon: 'Activity' },
  { slug: 'films', label: 'Films', icon: 'Film' },
  { slug: 'social', label: 'Social', icon: 'Users' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];
```

**`app.constants.ts`** -- all numeric/timing/limit constants:

```ts
// â”€â”€ Pagination â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const PAGE_SIZE_DEFAULT = 12;
export const PAGE_SIZE_TABLE = 20;
export const PAGE_SIZE_CHAT = 50;
export const PAGE_SIZE_ALBUM = 24;
export const PAGE_SIZE_NOTIFICATIONS = 20;

// â”€â”€ File upload limits â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const MAX_AVATAR_SIZE_MB = 5;
export const MAX_VIDEO_SIZE_MB = 50;
export const MAX_DOC_SIZE_MB = 20;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'] as const;

// â”€â”€ Character limits â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const MAX_BIO_LENGTH = 160;
export const OTP_LENGTH = 6;
export const OTP_DEV_VALUE = '123456';

// â”€â”€ Timing (ms) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const OTP_RESEND_COOLDOWN_S = 60;
export const OTP_MAX_ATTEMPTS = 3;
export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_LOCK_MINUTES = 30;
export const AUTOSAVE_DEBOUNCE_MS = 30_000;
export const SEARCH_DEBOUNCE_MS = 300;
export const SETTINGS_DEBOUNCE_MS = 500;
export const MESSAGE_EDIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const NOTIFICATION_POLL_MS = 30_000;
export const MOCK_API_DELAY_MS = 400;

// â”€â”€ Token / auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

// â”€â”€ Local storage keys â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const LS_THEME_KEY = 'sc_theme';
export const LS_RECENT_SEARCHES_KEY = 'sc_recent_searches';
export const MAX_RECENT_SEARCHES = 10;

// â”€â”€ Club status display â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Clubs always arrive already-live -- they're created via the Admin Dashboard.
export const CLUB_STATUS_LABELS = {
  live: 'Live',
  suspended: 'Suspended',
  archived: 'Archived',
} as const;

// â”€â”€ Event status display â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const EVENT_STATUS_LABELS = {
  draft: 'Draft',
  published: 'Upcoming',
  cancelled: 'Cancelled',
  concluded: 'Past',
} as const;

// â”€â”€ Billing cycle display â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const BILLING_CYCLE_LABELS = {
  one_time: 'One-time',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
} as const;

// â”€â”€ Breakpoints (px) -- mirrors tailwind.config.ts â”€â”€â”€â”€â”€â”€
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
} as const;

// â”€â”€ Mock credentials (dev only) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const MOCK_USERS = {
  member: {
    email: 'member@example.com',
    password: 'Member@123',
  },
  owner: {
    email: 'owner@example.com',
    password: 'Owner@123',
    // Owns one seeded club -- use to test the conditional Edit/Cancel
    // Event UI on Event Detail (isClubOwner(membership) === true).
  },
} as const;
```

---

### P1-D -- Shared Zod Validators (`src/shared/utils/validators.ts`)

Reusable Zod schemas imported by every form -- no inline regex or validation logic in feature files:

```ts
import { z } from 'zod';
import {
  MAX_BIO_LENGTH,
  OTP_LENGTH,
  MAX_AVATAR_SIZE_MB,
  ALLOWED_IMAGE_TYPES,
} from '@/shared/constants/app.constants';
import { en } from '@/shared/constants/locales/en';

const e = en.errors;

// â”€â”€ Primitives â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const emailSchema = z.string().min(1, e.required).email(e.emailInvalid);

export const phoneSchema = z
  .string()
  .min(1, e.required)
  .regex(/^\+?[1-9]\d{9,14}$/, e.phoneInvalid);

export const passwordSchema = z
  .string()
  .min(8, e.passwordMin)
  .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/, e.passwordWeak);

export const urlSchema = z.string().url(e.urlInvalid).optional().or(z.literal(''));

export const otpSchema = z.string().length(OTP_LENGTH, e.otpInvalid).regex(/^\d+$/, e.otpInvalid);

// â”€â”€ Auth forms â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, e.required),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    fullName: z.string().min(2, e.nameTooShort).max(100, e.nameTooLong),
    email: emailSchema,
    phone: phoneSchema.optional(),
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: e.termsRequired }) }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: e.passwordMatch,
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  target: z.union([emailSchema, phoneSchema]),
});

export const resetPasswordSchema = z
  .object({
    otp: otpSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: e.passwordMatch,
    path: ['confirmPassword'],
  });

// â”€â”€ Profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const profileSchema = z.object({
  fullName: z.string().min(2, e.nameTooShort).max(100, e.nameTooLong),
  bio: z.string().max(MAX_BIO_LENGTH, e.bioTooLong).optional(),
  city: z.string().max(80).optional(),
  websiteUrl: urlSchema,
  interests: z.array(z.string()).min(1, e.atLeastOneInterest),
});

// â”€â”€ Events â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Event creation happens entirely in the Admin Dashboard. This schema
// covers only the fields the owning member can edit from Event Detail
// (see Part 2 S-13, Part 4 PATCH /api/events/:eventId). Ticket
// pricing/type/quantity, visibility, and recurrence are not editable here.
export const eventEditSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(20),
  coverImage: urlSchema,
  startAt: z.string().refine((d) => new Date(d) > new Date(), e.dateMustBeFuture),
  endAt: z.string().optional(),
  timezone: z.string(),
  locationType: z.enum(['physical', 'virtual']),
  physicalAddress: z.string().min(5).optional(),
  virtualLink: urlSchema,
  capacity: z.number().int().positive().optional(),
  rsvpDeadline: z.string().optional(),
});
```

---

## Phase 2 Authentication & Onboarding

**Objectives:** Complete auth flow (login, signup, OTP, social login, forgot password) and the 2-step profile setup wizard.

**Estimated Hours:** 24 h

**Tasks:**

| Task                                                             | Hours |
| ---------------------------------------------------------------- | ----- |
| Login screen (S-01) with form validation                         | 3     |
| Sign Up screen (S-02) with Zod schema + password strength meter  | 4     |
| OTP screen (S-03) with digit input + auto-advance + resend timer | 3     |
| Forgot password flow (S-04) 3-step inline card                   | 2     |
| Social login callback mock (S-05)                                | 1     |
| Mock auth service + handlers (login, signup, OTP, refresh)       | 3     |
| Zustand `authSlice` setAuth, clearAuth, updateUser               | 1     |
| Axios interceptors inject token + refresh on 401                 | 2     |
| Profile Setup Step 1 (S-06) avatar upload + crop + name + bio    | 3     |
| Profile Setup Step 2 (S-07) interest chip multi-select + city    | 2     |

**Risks:** `react-image-crop` integration complexity.

**Dependencies:** Phase 1 (project setup, guards).

**Definition of Done:**

- Can register -> verify OTP -> complete profile -> land on `/home`
- Can log in as `member@example.com` / `Member@123`
- Refreshing page keeps user logged in (token persisted)
- Logging out clears state and redirects to `/login`

---

## Phase 3 Discovery, Club Landing Page & Public Event Detail

**Objectives:** A fully public homepage/discovery feed and event browsing (no login wall, real club + event listings, marketing sections like the reference site), a public club landing page, and a public event detail page. Club creation happens entirely in the separate Admin Dashboard and is not built here. Joining a club, RSVPing/buying an event ticket, and messaging remain gated to logged-in users via the `useRequireAuth()` action gate — never a route-level redirect on these pages.

**Estimated Hours:** 36 h

**Tasks:**

| Task                                                                                                    | Hours |
| ------------------------------------------------------------------------------------------------------- | ----- |
| Home / Discovery Feed (S-08) `ClubCard`, category chips, filters, infinite scroll, skeletons            | 8     |
| Home page marketing sections: hero, stats strip, how-it-works, testimonials, FAQ, newsletter, footer    | 6     |
| Club + event mock data (10 seeded clubs in `clubs.json`, seeded events in `events.json`)                | 2     |
| `useRequireAuth()` action-gating hook + wiring into ClubCard/EventCard CTAs (Join, RSVP, Buy)           | 4     |
| Search page (S-09) debounced search, tabs (Clubs/Events public, People gated), filters, recent searches | 6     |
| Club Landing Page (S-10) all sections (hero, about, gallery preview, events strip, FAQs, share)         | 10    |
| Club Landing Page SEO react-helmet-async meta tags + JSON-LD                                            | 2     |
| Public Event Detail page (S-37), reusing layout pieces from S-13, `Event` JSON-LD schema                | 4     |

**Risks:** Image lazy-loading/performance on the discovery grid across browsers.

**Dependencies:** Phase 2 (auth guards must work; `useRequireAuth()` builds on the existing `?next=` redirect convention).

**Definition of Done:**

- Guest user can browse the public home feed (clubs **and** events), open a public event detail page, and view a club landing page — all without logging in
- Attempting to Join a club, RSVP/Buy an event ticket, or Message someone while logged out redirects to `/login?next=<url>&intent=<action>` and returns the user to that same URL after signing in
- Club landing page and public event detail page both pass Lighthouse SEO audit score > 90

---

## Phase 4 Club Dashboard (Chat, Events, Albums, Members)

**Objectives:** The full club internal dashboard all 6 tabs functional.

**Estimated Hours:** 56 h

**Tasks:**

| Task                                                                                                                                       | Hours |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| Club Dashboard shell (S-11 frame) ClubDashboardHeader, tabs layout, breadcrumb                                                             | 4     |
| **Chat tab (S-11)** channel list, message thread, message bubbles, reply-to, reactions, @mention, pinned bar (read-only), typing indicator | 16    |
| Chat media sharing image/video/doc/voice inline rendering                                                                                  | 6     |
| Chat polls (create + vote + live results)                                                                                                  | 4     |
| 1:1 DM Inbox (S-21) + DM Thread (S-22)                                                                                                     | 5     |
| **Events tab (S-12)** list, filter (upcoming/past), EventCard component                                                                    | 3     |
| Event Detail page (S-13) RSVP, paid ticket widget, add-to-calendar, attendees, owner-only Edit/Cancel Event modal                          | 6     |
| **Albums tab (S-14)** album grid, album creation                                                                                           | 2     |
| Album Detail (S-15) masonry grid, lightbox, upload zone, progress, like/comment                                                            | 5     |
| **Members tab (S-16)** list, search                                                                                                        | 2     |
| Member Profile drawer (S-17)                                                                                                               | 1     |
| **About tab (S-18)** static info render                                                                                                    | 1     |
| **Payments tab (S-19)** current plan, transaction history, cancel flow                                                                     | 2     |

**Risks:** Chat virtual list performance with 100+ messages; lightbox keyboard navigation.

**Dependencies:** Phase 3 (club data and landing page).

**Definition of Done:**

- Member can join a club and use all 6 tabs
- Member can RSVP to an event; the member who owns that event's club can edit or cancel it
- Owner can upload album photos; lightbox opens with keyboard nav
- Chat renders 50+ mock messages without jank (60 fps scroll)

---

## Phase 5 User Panel, Payments & Notifications

**Objectives:** My Clubs dashboard, full payment checkout flow, notification centre, profile, and settings.

**Estimated Hours:** 32 h

**Tasks:**

| Task                                                                       | Hours |
| -------------------------------------------------------------------------- | ----- |
| My Clubs dashboard (S-20) club cards with unread badge                     | 2     |
| Notification Centre (S-23) list, filter tabs, mark-read, deep links        | 4     |
| Notification bell polling (TanStack Query 30-s interval)                   | 1     |
| User Profile (S-24) hero, tabs (clubs / activity)                          | 2     |
| Edit Profile (S-25) form, avatar crop, interests re-select                 | 3     |
| Settings Account (S-26) email/phone change OTP flows, social link/unlink   | 3     |
| Settings Notifications (S-27) toggle grid, debounced auto-save             | 2     |
| Settings Privacy (S-28) visibility toggles, blocked users                  | 2     |
| Settings Payments (S-29) saved cards mock, add card form                   | 2     |
| Subscription Management (S-30) active subscriptions list, cancel flow      | 2     |
| Checkout page (S-31) order summary, payment method tabs, pay button mock   | 4     |
| Payment Success (S-32) + Payment Failure (S-33) confetti animation + retry | 2     |
| Error screens 404, 401, 500/Maintenance (S-34, S-35, S-36)                 | 2     |
| OfflineBanner component                                                    | 1     |

**Risks:** Payment checkout mock UX must feel realistic without using a real SDK.

**Dependencies:** Phase 4 (club dashboard must exist for subscription -> club link).

**Definition of Done:**

- Can complete full checkout flow (plan -> checkout -> success -> club access)
- All notification types render with correct icons and deep links
- Profile edit saves optimistically with rollback on failure
- All 3 error screens render correctly at their respective routes

---

## Phase 6 Polish, Performance & QA

**Objectives:** Accessibility audit, performance optimisation, responsive testing, and pre-production cleanup.

**Estimated Hours:** 24 h

**Tasks:**

| Task                                                                       | Hours |
| -------------------------------------------------------------------------- | ----- |
| Framer Motion page transitions on all routes                               | 2     |
| Skeleton loaders verified on every data-fetching screen                    | 2     |
| Dark mode verify all design tokens work; test all screens                  | 3     |
| Keyboard navigation audit (all interactive elements reachable + focusable) | 3     |
| Axe accessibility scan fix all WCAG AA violations                          | 3     |
| Mobile responsive test all screens at 375 px, 768 px, 1024 px, 1440 px     | 4     |
| Lighthouse audit LCP < 2.5 s, CLS < 0.1, FID < 100 ms                      | 2     |
| Bundle analysis (`vite-bundle-visualizer`) ensure budgets met              | 1     |
| Remove all `console.log` and TODO comments                                 | 1     |
| Final mock data review ensure all screens have realistic seeded data       | 2     |
| ESLint + TypeScript CI check (`tsc --noEmit`)                              | 1     |

**Definition of Done:**

- Lighthouse scores: Performance >= 85, Accessibility >= 95, Best Practices >= 90, SEO >= 90
- Zero TypeScript errors, zero ESLint errors
- All screens tested on Chrome, Firefox, Safari (latest)
- All screens tested on mobile 375 px + tablet 768 px

---

# Section 29 Sprint Planning

**Sprint duration:** 2 weeks. **Team assumption:** 2 frontend developers.

| Sprint   | Phase(s)                           | Key Deliverables                                                                                | Est. Hours |
| -------- | ---------------------------------- | ----------------------------------------------------------------------------------------------- | ---------- |
| Sprint 1 | Phase 1 + Phase 2                  | Project setup, ALL constants/tokens, design system, auth screens, onboarding                    | 48 h       |
| Sprint 2 | Phase 3 (part 1)                   | Discovery feed, search, club landing page, public event detail                                  | 34 h       |
| Sprint 3 | Phase 3 (part 2) + Phase 4 (start) | Club dashboard shell + chat tab                                                                 | 34 h       |
| Sprint 4 | Phase 4 (continue)                 | Events tab (incl. owner edit/cancel), albums tab, members tab, about tab, payments tab, 1:1 DMs | 36 h       |
| Sprint 5 | Phase 5                            | My Clubs, notifications, profile, settings, checkout, payment flows, error screens              | 40 h       |
| Sprint 6 | Phase 6                            | Accessibility audit, performance, dark mode, responsive QA, final cleanup                       | 30 h       |

**Total estimated hours:** ~205 h (2 developers Ã— 6 sprints Ã— 2 weeks Ã— ~17 h/week)

---

### Sprint 1 -- Project Foundation, Constants & Auth

**Goal:** Working app shell with ALL constants/tokens locked down plus complete auth and onboarding. Zero hardcoded values after this sprint.

**Stories:**

1. Vite + React 19 + TypeScript project setup with ESLint, Prettier, husky + lint-staged
2. Tailwind CSS full design token extension -- tailwind.config.ts + globals.css CSS variables (P1-A)
3. Shadcn UI initialization -- install all required component primitives
4. Create locales/en.ts -- every label, placeholder, error, success, empty state, nav, tab string (P1-B)
5. Create routes.ts -- every URL path as typed constants (P1-C)
6. Create roles.ts -- `isClubOwner` ownership helper (no RBAC enum) (P1-C)
7. Create categories.ts -- full club category list with slug, label, icon (P1-C)
8. Create app.constants.ts -- pagination, file limits, char limits, timing, localStorage keys, mock credentials (P1-C)
9. Create shared/utils/validators.ts -- all shared Zod schemas: login, signup, profile, event edit (P1-D)
10. Shared utilities: cn.ts, formatDate.ts, formatCurrency.ts, sanitize.ts, slugify.ts, animations.ts
11. Zustand stores: authSlice, uiSlice, chatSlice
12. TanStack Query: QueryClient config, providers.tsx wrapper, queryKeys.ts
13. React Router v7: router.tsx + route guards (AuthGuard, OnboardingGuard only -- no role-based route guards)
14. Axios client: token interceptors + mock adapter wired to all handlers
15. Login screen (S-01) -- all strings from en.auth, form from loginSchema
16. Sign Up screen (S-02) -- signupSchema, password strength meter
17. OTP screen (S-03) -- OTP_LENGTH and OTP_RESEND_COOLDOWN_S from app.constants.ts
18. Forgot Password flow (S-04)
19. Social Login callback mock (S-05)
20. Profile Setup Step 1 (S-06) -- avatar upload + crop + name + bio
21. Profile Setup Step 2 (S-07) -- interest chips from CATEGORIES constant + city

**Definition of Done:**

- User can complete full signup -> OTP -> profile -> home flow
- en.ts, routes.ts, roles.ts, categories.ts, app.constants.ts, validators.ts all exist and every import resolves
- Zero hardcoded strings, colours, sizes, or magic numbers in any feature file
- TypeScript (tsc --noEmit) and ESLint pass with zero errors

---

### Sprint 2 Discovery & Club Public Pages

**Goal:** Guests and members can discover and explore clubs.

**Stories:**

1. Home / Discovery Feed with club card grid, category filters, infinite scroll
2. Global Search page with tabs (Clubs/Events/People) and debounced input
3. Club Landing Page all sections (hero, about, highlights, gallery, events, FAQs)
4. SEO meta tags + OG + JSON-LD on club landing page
5. Public Event Detail page, reusing layout pieces from the dashboard Event Detail view

**Definition of Done:** Guest can browse discovery feed, view a club landing page and a public event detail page, and click Join/RSVP (redirected to signup while logged out).

---

### Sprint 3 Club Dashboard Shell + Chat

**Goal:** Club dashboard shell and a fully functional chat tab.

**Stories:**

1. Club Dashboard shell (header, tabs, nested routing)
2. Group Chat channel list, message thread, send message, message bubbles
3. Chat: reply-to, emoji reactions, @mentions
4. Chat: pinned message bar (read-only), typing indicator, scroll-to-bottom FAB

**Definition of Done:** Members can open the club chat, send messages, react, and reply.

---

### Sprint 4 Club Dashboard (Events, Albums, Members)

**Goal:** All remaining club dashboard tabs functional.

**Stories:**

1. Events tab list with upcoming/past filter, EventCard component
2. Event Detail RSVP, add to calendar, attendees, paid ticket widget, owner-only Edit/Cancel Event modal (`eventEditSchema`)
3. Chat: media sharing (image/video/doc upload + inline render), voice note player
4. Chat: polls (create + vote + live results)
5. 1:1 DM Inbox + DM Thread
6. Albums tab grid + create album
7. Album Detail masonry, lightbox (keyboard nav), upload progress, like/comment
8. Members tab list, search
9. About + Payments tabs (static render + subscription card)

**Definition of Done:** All 6 club dashboard tabs are functional. Member can RSVP; the member who owns an event's club can edit or cancel it. Owner can upload album photos; lightbox navigable by keyboard.

---

### Sprint 5 User Panel, Payments & Notifications

**Goal:** Complete member experience outside the club dashboard.

**Stories:**

1. My Clubs dashboard
2. Notification Centre + bell polling
3. User Profile public view
4. Edit Profile (avatar, interests, social links)
5. Settings Account (email/phone change, social links)
6. Settings Notifications (toggle grid with auto-save)
7. Settings Privacy + Payments (saved cards mock)
8. Subscription Management page
9. Checkout page order summary + payment method tabs
10. Payment Success + Failure screens
11. Error pages 404, 401, 500/Maintenance

**Definition of Done:** User can navigate to every settings screen, update their profile, manage subscriptions, and complete the mock checkout flow.

---

### Sprint 6 QA, Performance & Polish

**Goal:** Production-quality polish, accessibility, and performance.

**Stories:**

1. Framer Motion page transitions on all routes
2. Verify skeleton loaders on every loading state
3. Dark mode test all screens, fix any token gaps
4. Keyboard navigation audit + fixes
5. Axe automated accessibility scan + fix all violations
6. Mobile responsive QA (375/768/1024/1440 px)
7. Lighthouse performance run + fixes (target LCP < 2.5 s)
8. Bundle size analysis + code splitting verification
9. Final mock data seed ensure all screens have realistic data
10. ESLint + TypeScript CI pass zero errors

---

# Section 31 Future Backend Integration

## 31.1 Mock Removal Strategy

The mock layer is designed for zero-friction removal. The only file that wires up mocks is `src/services/mockAdapter.ts`. To switch to a real API:

```ts
// Before (development):
if (import.meta.env.DEV) {
  registerAllMockHandlers(mock);
}

// After (production or staging with real API):
// Simply don't register mock handlers.
// The Axios instance hits the real API base URL from VITE_API_URL.
```

No component or hook code changes. No TanStack Query changes.

## 31.2 API Abstraction (Service Layer)

Each feature module has a `service.ts` that wraps Axios calls:

```ts
// features/clubs/services/clubService.ts
export const clubService = {
  getAll: (filters: ClubFilters) =>
    apiClient.get<PaginatedResponse<Club>>('/clubs', { params: filters }).then((r) => r.data),
  getBySlug: (slug: string) => apiClient.get<Club>(`/clubs/${slug}`).then((r) => r.data),
  // ...
};
```

To replace the mock: keep the same function signatures; change only the implementation (e.g., swap base URL, add headers, handle different response shapes).

## 31.3 TanStack Query Migration

TanStack Query hooks (`useQuery`, `useMutation`) are already calling the service layer they do not know about mocks. When the real API is live:

1. Update `apiClient.ts` base URL to the production API
2. Remove `mockAdapter.ts` import from `providers.tsx`
3. Adjust stale times if real API is faster/slower
4. Replace optimistic update rollback error messages with real API error codes

## 31.4 Environment Configuration

```bash
# .env.development
VITE_API_URL=http://localhost:5173/api   # intercepted by mock adapter
VITE_USE_MOCK=true
VITE_MOCK_DELAY_MS=400

# .env.staging
VITE_API_URL=https://api-staging.socialcircle.app/v1
VITE_USE_MOCK=false

# .env.production
VITE_API_URL=https://api.socialcircle.app/v1
VITE_USE_MOCK=false
```

```ts
// mockAdapter.ts
if (import.meta.env.VITE_USE_MOCK === 'true') {
  registerAllMockHandlers(mock);
}
```

## 31.5 WebSocket (Chat) Integration

The chat module has a `useChatSocket.ts` hook that is scaffolded but disabled:

```ts
// features/chat/hooks/useChatSocket.ts
export function useChatSocket(channelId: string) {
  // In development: use 30-s polling via TanStack Query refetchInterval
  // In production: uncomment the Socket.io connection below:
  //
  // const socket = io(import.meta.env.VITE_WS_URL, {
  //   auth: { token: useAuthStore.getState().token },
  // });
  // socket.on('new_message', (msg: ChatMessage) => { ... });
}
```

---

# Section 32 Risks

## 32.1 Technical Risks

| Risk                                          | Probability | Impact | Mitigation                                                                           |
| --------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------------------ |
| TipTap bundle size too large                  | Medium      | Medium | Lazy import; evaluate Quill as lighter alternative if > 80 KB                        |
| Socket.io WebSocket mock fidelity gap         | High        | High   | Mock emits realistic latency (200-500 ms); test with actual message volumes early    |
| `react-image-crop` browser compatibility      | Low         | Medium | Test on Safari early; have a fallback (no-crop upload with aspect ratio enforcement) |
| TanStack Query v5 breaking changes            | Low         | High   | Pin version; read migration guide before upgrading                                   |
| Framer Motion animations blocking main thread | Medium      | Low    | Use `transform` and `opacity` only; test on low-end Android Chrome                   |
| Deep link auth redirect edge cases            | Medium      | High   | Extensive testing of `?next=` param with encoded special characters                  |

## 32.2 UX Risks

| Risk                                       | Probability | Impact | Mitigation                                                              |
| ------------------------------------------ | ----------- | ------ | ----------------------------------------------------------------------- |
| Chat feels laggy with 100+ messages        | Medium      | High   | Virtual list from Sprint 3; benchmark early                             |
| Mobile payment checkout too cramped        | Medium      | High   | Dedicated mobile layout for checkout; test at 375 px                    |
| Discovery feed recommendations too generic | High        | Low    | Mock data reflects user's selected interests; improve with real backend |

## 32.3 Performance Risks

| Risk                                   | Mitigation                                                |
| -------------------------------------- | --------------------------------------------------------- |
| Initial bundle > 150 KB                | Route-level code splitting; Vite bundle visualizer in CI  |
| Club landing page LCP > 2.5 s          | Hero image `fetchPriority="high"`; preload banner URL     |
| Album detail with 200+ images too slow | Virtual grid + lazy load images outside viewport          |
| Chat scroll perf with media messages   | Virtualize; cap image heights in thread; lazy load images |

## 32.4 Security Risks

| Risk                                                                                        | Mitigation                                                                                                 |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| XSS via rich text club/event descriptions authored in the Admin Dashboard and rendered here | DOMPurify on all `dangerouslySetInnerHTML` usage, regardless of authoring source                           |
| Token leakage via `console.log`                                                             | `esbuild.drop: ['console']` in production Vite config                                                      |
| Insecure direct object reference (IDOR) via mock IDs                                        | `isClubOwner` ownership check enforced before PATCH/DELETE on `/events/:eventId`; backend must enforce too |

## 32.5 Delivery Risks

| Risk                                     | Mitigation                                                                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Chat feature scope creep                 | Strict MVP: text + image + polls only in Sprint 3; voice/video deferred                                                                |
| Sprint 4 (club dashboard) scope creep    | Scope is reduced now that event creation and moderation tooling live in the Admin Dashboard; re-assess splitting only if team < 2 devs |
| Design system not locked before Sprint 2 | Finalise all Tailwind tokens + Shadcn customisations by end of Sprint 1                                                                |

---

# Section 33 Final Development Checklist

## Code Quality

- [ ] `tsc --noEmit` passes with zero errors
- [ ] `eslint src/` passes with zero errors
- [ ] `prettier --check src/` passes
- [ ] No `console.log`, `debugger`, or commented-out code blocks
- [ ] No `any` TypeScript escape hatches
- [ ] All TODOs resolved or filed as GitHub issues

## Functionality

- [ ] All 37 screens from the Screen Inventory (S-01 through S-37) are implemented
- [ ] All 6 club dashboard tabs functional
- [ ] RSVP flow (free and paid events) works end-to-end
- [ ] The member who owns an event's club can edit/cancel that event; no one else sees those controls
- [ ] Full payment mock checkout -> success / failure flows work
- [ ] Logout clears all state (auth, query cache, localStorage tokens)
- [ ] Deep links work (navigating directly to `/clubs/slug/dashboard/chat` from browser)
- [ ] Auth redirect: unauthenticated user sent to login, returned to original URL after login

## Mock Data

- [ ] At least 10 seeded clubs across multiple categories in `clubs.json`
- [ ] At least 3 seeded events per club in `events.json`
- [ ] At least 50 seeded chat messages in `messages.json`
- [ ] At least 2 albums with 12+ media items per album in `albums.json`
- [ ] At least 20 seeded users with varied interests in `users.json`
- [ ] Paid and free clubs both represented in seed data
- [ ] At least one seeded club has an `owner` test-account membership, for testing the conditional Edit/Cancel Event UI

## Accessibility

- [ ] All interactive elements reachable by Tab key
- [ ] All interactive elements show visible focus ring
- [ ] Skip-to-main-content link works
- [ ] Screen reader tested on NVDA + Chrome
- [ ] All images have `alt` attributes
- [ ] Form errors announced via `aria-live`
- [ ] No keyboard traps outside modals (Radix handles this)
- [ ] Axe DevTools browser scan: zero critical violations

## Responsive Design

- [ ] All screens tested at 375 px (iPhone SE)
- [ ] All screens tested at 768 px (iPad)
- [ ] All screens tested at 1024 px (laptop)
- [ ] All screens tested at 1440 px (desktop)
- [ ] Bottom tab bar visible on mobile, sidebar on desktop
- [ ] Chat 3-panel layout collapses to single column on mobile
- [ ] No horizontal scroll on any screen at any breakpoint

## Performance

- [ ] Lighthouse Performance >= 85 (club landing page)
- [ ] Lighthouse Accessibility >= 95
- [ ] Lighthouse SEO >= 90 (club landing page)
- [ ] LCP < 2.5 s on simulated 4G
- [ ] CLS < 0.1 (no layout shifts)
- [ ] Initial JS bundle < 150 KB (gzip)
- [ ] All page components are lazy-loaded
- [ ] Images use `loading="lazy"` and responsive `srcset`

## Security

- [ ] DOMPurify applied to all `dangerouslySetInnerHTML` usage
- [ ] All external links have `rel="noopener noreferrer"`
- [ ] `console.log` stripped from production build (`esbuild.drop`)
- [ ] Auth token not logged anywhere
- [ ] File upload MIME type validated client-side

## SEO (Public Pages)

- [ ] `<title>` unique on every public page
- [ ] `<meta name="description">` on club landing pages
- [ ] Open Graph tags on club landing pages
- [ ] JSON-LD structured data on club landing pages
- [ ] Auth/member pages marked `noindex`
- [ ] `robots.txt` deployed and correct
- [ ] `sitemap.xml` lists all live club slugs

## Browser Compatibility

- [ ] Chrome 120+ full functionality
- [ ] Firefox 120+ full functionality
- [ ] Safari 17+ full functionality (special attention to `gap` in flex, date inputs)
- [ ] Edge 120+ full functionality
- [ ] No IE support (acceptable)

---

_End of Part 6 Final part of the Social Circle Frontend Technical Specification._
_The complete specification spans 6 files: spec-part1-foundation.md through spec-part6-delivery.md._
