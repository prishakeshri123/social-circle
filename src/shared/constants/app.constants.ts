// ── Pagination ────────────────────────────────────────────
export const PAGE_SIZE_DEFAULT = 12;
export const PAGE_SIZE_TABLE = 20;
export const PAGE_SIZE_CHAT = 50;
export const PAGE_SIZE_ALBUM = 24;
export const PAGE_SIZE_NOTIFICATIONS = 20;

// ── Conversations hub ────────────────────────────────────
export const CONVERSATION_PREVIEW_MAX_CHARS = 60;
export const CONVERSATION_LIST_BADGE_MAX = 9;

// ── File upload limits ────────────────────────────────────
export const MAX_AVATAR_SIZE_MB = 5;
export const MAX_VIDEO_SIZE_MB = 50;
export const MAX_DOC_SIZE_MB = 20;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'] as const;

// ── Character limits ──────────────────────────────────────
export const MAX_BIO_LENGTH = 160;
export const MAX_CONTACT_SUBJECT_LENGTH = 120;
export const MIN_CONTACT_MESSAGE_LENGTH = 20;
export const OTP_LENGTH = 6;
export const OTP_DEV_VALUE = '123456';

// ── Timing (ms) ───────────────────────────────────────────
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

// ── Token / auth ──────────────────────────────────────────
export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

// ── Local storage keys ────────────────────────────────────
export const LS_RECENT_SEARCHES_KEY = 'sc_recent_searches';
export const LS_HOME_WELCOME_DISMISSED_KEY = 'sc_home_welcome_dismissed';
export const MAX_RECENT_SEARCHES = 10;

// ── Discovery / Search ─────────────────────────────────────
export const CLUB_SORT_OPTIONS = ['recommended', 'newest', 'most_members'] as const;
export const GALLERY_PREVIEW_COUNT = 9;
export const MEMBERS_PREVIEW_COUNT = 12;
export const SEARCH_MIN_CHARS = 2;
export const POPULAR_CLUBS_STRIP_LIMIT = 8;
export const NEW_CLUB_THRESHOLD_DAYS = 30;

// ── Onboarding ─────────────────────────────────────────────
export const ONBOARDING_TOTAL_STEPS = 2;

// ── Avatar crop ────────────────────────────────────────────
export const AVATAR_CROP_OUTPUT_PX = 400;
export const AVATAR_CROP_VIEWPORT_PX = 280;
export const AVATAR_CROP_MIN_SCALE = 1;
export const AVATAR_CROP_MAX_SCALE = 3;
export const AVATAR_CROP_SCALE_STEP = 0.1;

// ── Social login (mock) ────────────────────────────────────
export const SOCIAL_LOGIN_MOCK_DELAY_MS = 1500;

// ── Club status display ───────────────────────────────────
// Clubs are created/onboarded via the Admin Dashboard, so they always
// arrive into this app's data already-live.
export const CLUB_STATUS_LABELS = {
  live: 'Live',
  suspended: 'Suspended',
  archived: 'Archived',
} as const;

// ── Event status display ──────────────────────────────────
export const EVENT_STATUS_LABELS = {
  draft: 'Draft',
  published: 'Upcoming',
  cancelled: 'Cancelled',
  concluded: 'Past',
} as const;

// ── Billing cycle display ─────────────────────────────────
export const BILLING_CYCLE_LABELS = {
  one_time: 'One-time',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
} as const;

// ── Layout ─────────────────────────────────────────────────
export const HEADER_HEIGHT_PX = 64;
export const TRANSPARENT_HEADER_SCROLL_THRESHOLD_PX = 40;

// ── Route hash scrolling (e.g. footer link -> #faqs on another page) ──
export const SCROLL_TO_HASH_RETRY_MS = 10;
export const SCROLL_TO_HASH_TIMEOUT_MS = 1500;

// ── Horizontal scroll carousels (events strip, popular clubs strip) ──────
export const CAROUSEL_SCROLL_EPSILON_PX = 4;
export const CAROUSEL_SCROLL_ANIMATION_MS = 400;

// ── Breakpoints (px) -- mirrors tailwind.config.ts ──────
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
} as const;

// ── Chat ───────────────────────────────────────────────────
export const MAX_MESSAGE_LENGTH = 2000;
export const MIN_POLL_OPTIONS = 2;
export const MAX_POLL_OPTIONS = 10;
export const TYPING_INDICATOR_MIN_MS = 1200;
export const TYPING_INDICATOR_MAX_MS = 2500;
export const AUTO_REPLY_CHANCE = 0.35;
export const SCROLL_TO_BOTTOM_THRESHOLD_PX = 200;

// ── Albums ─────────────────────────────────────────────────
export const MAX_CAPTION_LENGTH = 280;
export const MAX_UPLOAD_FILES_PER_BATCH = 10;

// ── Mock credentials (dev only) ───────────────────────────
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
