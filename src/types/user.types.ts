export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  username: string;
  avatarUrl?: string;
  coverPhotoUrl?: string;
  bio?: string;
  city?: string;
  interests: string[];
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
  joinedAt: string;
  lastActiveAt: string;
  clubsJoined: number;
  linkedProviders: ('google' | 'apple' | 'facebook')[];
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  eventReminders: boolean;
  chatMentions: boolean;
  clubUpdates: boolean;
  paymentAlerts: boolean;
}

export type ProfileVisibility = 'public' | 'members_only' | 'private';
export type DmPermission = 'anyone' | 'club_members' | 'nobody';

export interface PrivacySettings {
  profileVisibility: ProfileVisibility;
  showInDiscovery: boolean;
  allowDmsFrom: DmPermission;
}

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
