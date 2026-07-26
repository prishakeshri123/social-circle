import { Navigate, createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { AppShell } from '@/shared/components/layout/AppShell';
import { ErrorFallback } from '@/shared/components/feedback/ErrorFallback';
import { PlaceholderPage } from '@/shared/components/feedback/PlaceholderPage';
import { AuthGuard, OnboardingGuard } from '@/app/guards';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { SignupPage } from '@/features/auth/pages/SignupPage';
import { OtpVerificationPage } from '@/features/auth/pages/OtpVerificationPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { SocialCallbackPage } from '@/features/auth/pages/SocialCallbackPage';
import { ProfileSetupStep1Page } from '@/features/onboarding/pages/ProfileSetupStep1Page';
import { ProfileSetupStep2Page } from '@/features/onboarding/pages/ProfileSetupStep2Page';
import { HomePage } from '@/features/discovery/pages/HomePage';
import { AboutPage } from '@/features/discovery/pages/AboutPage';
import { ServicesPage } from '@/features/discovery/pages/ServicesPage';
import { ContactPage } from '@/features/discovery/pages/ContactPage';
import { SearchPage } from '@/features/search/pages/SearchPage';
import { ClubLandingPage } from '@/features/clubs/pages/ClubLandingPage';
import { PublicEventDetailPage } from '@/features/events/pages/PublicEventDetailPage';
import { ConversationsHubPage } from '@/features/chat/pages/ConversationsHubPage';
import { ClubDashboardLayout } from '@/features/clubs/components/ClubDashboardLayout';

export const router = createBrowserRouter([
  // --- Public auth routes ---------------------------------------------
  {
    element: <AuthLayout />,
    errorElement: <ErrorFallback />,
    children: [
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.signup, element: <SignupPage /> },
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
      { path: ROUTES.contact, element: <ContactPage /> },
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
      { path: ROUTES.myClubs, element: <ConversationsHubPage defaultFilter="clubs" /> },
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
          { path: 'chat', element: <PlaceholderPage title="Chat" /> },
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
