import type MockAdapter from 'axios-mock-adapter';
import { registerAuthHandlers } from '@/mock/handlers/authHandlers';
import { registerProfileHandlers } from '@/mock/handlers/profileHandlers';
import { registerClubHandlers } from '@/mock/handlers/clubHandlers';
import { registerEventHandlers } from '@/mock/handlers/eventHandlers';
import { registerChatHandlers } from '@/mock/handlers/chatHandlers';
import { registerAlbumHandlers } from '@/mock/handlers/albumHandlers';
import { registerPaymentHandlers } from '@/mock/handlers/paymentHandlers';
import { registerNotificationHandlers } from '@/mock/handlers/notificationHandlers';
import { registerInvitationHandlers } from '@/mock/handlers/invitationHandlers';
import { registerSavedClubHandlers } from '@/mock/handlers/savedClubHandlers';
import { registerSettingsHandlers } from '@/mock/handlers/settingsHandlers';

export function registerMockHandlers(mock: MockAdapter): void {
  registerAuthHandlers(mock);
  registerProfileHandlers(mock);
  registerClubHandlers(mock);
  registerEventHandlers(mock);
  registerChatHandlers(mock);
  registerAlbumHandlers(mock);
  registerPaymentHandlers(mock);
  registerNotificationHandlers(mock);
  registerInvitationHandlers(mock);
  registerSavedClubHandlers(mock);
  registerSettingsHandlers(mock);
}
