import {
  AlarmClock,
  AlertCircle,
  AlertTriangle,
  Bell,
  CalendarPlus,
  CheckCircle2,
  Clock,
  CreditCard,
  MessageCircle,
  RefreshCcw,
  RefreshCw,
  Users,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import type { NotificationType } from '@/types/user.types';

export type NotificationCategory = 'club_activity' | 'events' | 'payments' | 'system';

export type NotificationTone = 'default' | 'success' | 'warning' | 'error' | 'info';

interface NotificationTypeMeta {
  icon: LucideIcon;
  category: NotificationCategory;
  tone: NotificationTone;
}

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeMeta> = {
  club_joined: { icon: Users, category: 'club_activity', tone: 'default' },
  chat_mention: { icon: MessageCircle, category: 'club_activity', tone: 'info' },
  event_created: { icon: CalendarPlus, category: 'events', tone: 'info' },
  event_reminder_24h: { icon: Clock, category: 'events', tone: 'default' },
  event_reminder_1h: { icon: AlarmClock, category: 'events', tone: 'warning' },
  event_rsvp: { icon: CheckCircle2, category: 'events', tone: 'success' },
  event_cancelled: { icon: XCircle, category: 'events', tone: 'error' },
  event_updated: { icon: RefreshCw, category: 'events', tone: 'default' },
  payment_success: { icon: CreditCard, category: 'payments', tone: 'success' },
  payment_failed: { icon: AlertCircle, category: 'payments', tone: 'error' },
  subscription_renewal: { icon: RefreshCcw, category: 'payments', tone: 'default' },
  subscription_expiry: { icon: AlertTriangle, category: 'payments', tone: 'warning' },
  system: { icon: Bell, category: 'system', tone: 'default' },
};

export const NOTIFICATION_TONE_CLASSES: Record<NotificationTone, string> = {
  default: 'bg-primary-50 text-primary-700',
  success: 'bg-success-100 text-success-500',
  warning: 'bg-warning-100 text-warning-500',
  error: 'bg-error-100 text-error-500',
  info: 'bg-info-100 text-info-500',
};
