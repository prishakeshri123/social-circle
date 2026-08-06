import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { AppShell } from '@/shared/components/layout/AppShell';
import { ErrorFallback } from '@/shared/components/feedback/ErrorFallback';
import { PlaceholderPage } from '@/shared/components/feedback/PlaceholderPage';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { AuthGuard, OnboardingGuard } from '@/app/guards';

// --- Route-level code splitting -----------------------------------------
// Every page below is fetched only when its route is visited, keeping the
// initial bundle limited to the app shell + whichever route loads first.
const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const SignupPage = lazy(() =>
  import('@/features/auth/pages/SignupPage').then((m) => ({ default: m.SignupPage })),
);
const SignupSuccessPage = lazy(() =>
  import('@/features/auth/pages/SignupSuccessPage').then((m) => ({
    default: m.SignupSuccessPage,
  })),
);
const OtpVerificationPage = lazy(() =>
  import('@/features/auth/pages/OtpVerificationPage').then((m) => ({
    default: m.OtpVerificationPage,
  })),
);
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const SocialCallbackPage = lazy(() =>
  import('@/features/auth/pages/SocialCallbackPage').then((m) => ({
    default: m.SocialCallbackPage,
  })),
);
const ProfileSetupStep1Page = lazy(() =>
  import('@/features/onboarding/pages/ProfileSetupStep1Page').then((m) => ({
    default: m.ProfileSetupStep1Page,
  })),
);
const ProfileSetupStep2Page = lazy(() =>
  import('@/features/onboarding/pages/ProfileSetupStep2Page').then((m) => ({
    default: m.ProfileSetupStep2Page,
  })),
);
const HomePage = lazy(() =>
  import('@/features/discovery/pages/HomePage').then((m) => ({ default: m.HomePage })),
);
const AboutPage = lazy(() =>
  import('@/features/discovery/pages/AboutPage').then((m) => ({ default: m.AboutPage })),
);
const ServicesPage = lazy(() =>
  import('@/features/discovery/pages/ServicesPage').then((m) => ({ default: m.ServicesPage })),
);
const HowItWorksPage = lazy(() =>
  import('@/features/discovery/pages/HowItWorksPage').then((m) => ({
    default: m.HowItWorksPage,
  })),
);
const ContactPage = lazy(() =>
  import('@/features/discovery/pages/ContactPage').then((m) => ({ default: m.ContactPage })),
);
const TermsPage = lazy(() =>
  import('@/features/discovery/pages/TermsPage').then((m) => ({ default: m.TermsPage })),
);
const PrivacyPolicyPage = lazy(() =>
  import('@/features/discovery/pages/PrivacyPolicyPage').then((m) => ({
    default: m.PrivacyPolicyPage,
  })),
);
const RefundPolicyPage = lazy(() =>
  import('@/features/discovery/pages/RefundPolicyPage').then((m) => ({
    default: m.RefundPolicyPage,
  })),
);
const CookiePolicyPage = lazy(() =>
  import('@/features/discovery/pages/CookiePolicyPage').then((m) => ({
    default: m.CookiePolicyPage,
  })),
);
const SearchPage = lazy(() =>
  import('@/features/search/pages/SearchPage').then((m) => ({ default: m.SearchPage })),
);
const ClubsPage = lazy(() =>
  import('@/features/discovery/pages/ClubsPage').then((m) => ({ default: m.ClubsPage })),
);
const EventsPage = lazy(() =>
  import('@/features/discovery/pages/EventsPage').then((m) => ({ default: m.EventsPage })),
);
const ClubLandingPage = lazy(() =>
  import('@/features/clubs/pages/ClubLandingPage').then((m) => ({ default: m.ClubLandingPage })),
);
const PublicEventDetailPage = lazy(() =>
  import('@/features/events/pages/PublicEventDetailPage').then((m) => ({
    default: m.PublicEventDetailPage,
  })),
);
const ConversationsHubPage = lazy(() =>
  import('@/features/chat/pages/ConversationsHubPage').then((m) => ({
    default: m.ConversationsHubPage,
  })),
);
const ClubDashboardChatPage = lazy(() =>
  import('@/features/chat/pages/ClubDashboardChatPage').then((m) => ({
    default: m.ClubDashboardChatPage,
  })),
);
const ClubDashboardLayout = lazy(() =>
  import('@/features/clubs/components/ClubDashboardLayout').then((m) => ({
    default: m.ClubDashboardLayout,
  })),
);
const MyClubsPage = lazy(() =>
  import('@/features/clubs/pages/MyClubsPage').then((m) => ({ default: m.MyClubsPage })),
);
const MyEventsPage = lazy(() =>
  import('@/features/events/pages/MyEventsPage').then((m) => ({ default: m.MyEventsPage })),
);

// Wraps a lazily-loaded page element in its own Suspense boundary so
// navigating to it shows a spinner instead of blocking on the whole tree.
function suspended(element: ReactNode) {
  return <Suspense fallback={<LoadingSpinner className="min-h-[50vh]" />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  // --- Login/Signup: bespoke full-page split layout, no shared AuthLayout shell ---
  { path: ROUTES.login, element: suspended(<LoginPage />), errorElement: <ErrorFallback /> },
  { path: ROUTES.signup, element: suspended(<SignupPage />), errorElement: <ErrorFallback /> },
  {
    path: ROUTES.signupSuccess,
    element: suspended(<SignupSuccessPage />),
    errorElement: <ErrorFallback />,
  },

  // --- Public auth routes ---------------------------------------------
  {
    element: <AuthLayout />,
    errorElement: <ErrorFallback />,
    children: [
      { path: ROUTES.verifyOtp, element: <OtpVerificationPage /> },
      { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
      { path: ROUTES.authCallback, element: <SocialCallbackPage /> },
    ],
  },

  // --- Public browsing routes (no login wall — AppShell adapts to guest/member) ---
  {
    element: <AppShell />,
    errorElement: <ErrorFallback />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.about, element: <AboutPage /> },
      { path: ROUTES.services, element: <ServicesPage /> },
      { path: ROUTES.howItWorks, element: <HowItWorksPage /> },
      { path: ROUTES.contact, element: <ContactPage /> },
      { path: ROUTES.terms, element: <TermsPage /> },
      { path: ROUTES.privacyPolicy, element: <PrivacyPolicyPage /> },
      { path: ROUTES.refundPolicy, element: <RefundPolicyPage /> },
      { path: ROUTES.cookiePolicy, element: <CookiePolicyPage /> },
      { path: ROUTES.clubs, element: <ClubsPage /> },
      { path: ROUTES.events, element: <EventsPage /> },
      { path: ROUTES.search, element: <SearchPage /> },
      { path: ROUTES.clubLanding(':slug'), element: <ClubLandingPage /> },
      { path: ROUTES.eventDetail(':slug', ':eventId'), element: <PublicEventDetailPage /> },
    ],
  },

  // --- Onboarding routes (auth + incomplete profile) ------------------
  {
    element: (
      <OnboardingGuard>
        <AuthLayout />
      </OnboardingGuard>
    ),
    errorElement: <ErrorFallback />,
    children: [
      { path: ROUTES.onboardingProfile, element: <ProfileSetupStep1Page /> },
      { path: ROUTES.onboardingInterests, element: <ProfileSetupStep2Page /> },
    ],
  },

  // --- Member routes (auth + complete profile) ------------------------
  {
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    errorElement: <ErrorFallback />,
    children: [
      { path: ROUTES.myClubs, element: <MyClubsPage /> },
      { path: ROUTES.myEvents, element: <MyEventsPage /> },
      { path: ROUTES.albums, element: <PlaceholderPage title="Albums" /> },
      { path: ROUTES.members, element: <PlaceholderPage title="Members" /> },
      { path: ROUTES.invitations, element: <PlaceholderPage title="Invitations" /> },
      { path: ROUTES.savedClubs, element: <PlaceholderPage title="Saved Clubs" /> },
      { path: ROUTES.notifications, element: <PlaceholderPage title="Notifications" /> },
      { path: ROUTES.messages, element: <ConversationsHubPage defaultFilter="all" /> },
      {
        path: ROUTES.messageThread(':userId'),
        element: <ConversationsHubPage defaultFilter="chats" />,
      },
      { path: ROUTES.profile(':userId'), element: <PlaceholderPage title="Profile" /> },
      { path: ROUTES.profileEdit, element: <PlaceholderPage title="Edit Profile" /> },
      { path: ROUTES.settings, element: <PlaceholderPage title="Settings" /> },
      { path: ROUTES.settingsNotifs, element: <PlaceholderPage title="Notification Settings" /> },
      { path: ROUTES.settingsPrivacy, element: <PlaceholderPage title="Privacy Settings" /> },
      { path: ROUTES.settingsPayments, element: <PlaceholderPage title="Payment Settings" /> },
      { path: ROUTES.subscriptions, element: <PlaceholderPage title="Subscriptions" /> },
      { path: ROUTES.checkout(':planId'), element: <PlaceholderPage title="Checkout" /> },
      { path: ROUTES.checkoutSuccess, element: <PlaceholderPage title="Payment Success" /> },
      { path: ROUTES.checkoutFailure, element: <PlaceholderPage title="Payment Failure" /> },

      // Club dashboard (nested tabs). Club creation/settings and event
      // creation happen in the separate Admin Dashboard -- not routed here.
      {
        path: ROUTES.clubDashboard(':slug'),
        element: <ClubDashboardLayout />,
        children: [
          { index: true, element: <Navigate to="chat" replace /> },
          { path: 'chat', element: <ClubDashboardChatPage /> },
          { path: 'events', element: <PlaceholderPage title="Events" /> },
          { path: 'events/:eventId', element: <PlaceholderPage title="Event Detail" /> },
          { path: 'albums', element: <PlaceholderPage title="Albums" /> },
          { path: 'albums/:albumId', element: <PlaceholderPage title="Album Detail" /> },
          { path: 'members', element: <PlaceholderPage title="Members" /> },
          { path: 'members/:userId', element: <PlaceholderPage title="Member Profile" /> },
          { path: 'about', element: <PlaceholderPage title="About" /> },
          { path: 'payments', element: <PlaceholderPage title="Club Payments" /> },
        ],
      },
    ],
  },

  // --- Error routes ----------------------------------------------------
  { path: ROUTES.unauthorized, element: <PlaceholderPage title="Unauthorized" /> },
  { path: ROUTES.maintenance, element: <PlaceholderPage title="Maintenance" /> },
  { path: '*', element: <PlaceholderPage title="Not Found" /> },
]);
