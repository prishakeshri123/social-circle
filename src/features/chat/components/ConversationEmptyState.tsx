import { Lock, MessageCircle, User, Users, Zap } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';

const FEATURES = [
  {
    icon: Lock,
    title: en.hub.featureSecureTitle,
    body: en.hub.featureSecureBody,
    tint: 'bg-primary-600',
  },
  {
    icon: Zap,
    title: en.hub.featureRealtimeTitle,
    body: en.hub.featureRealtimeBody,
    tint: 'bg-info-500',
  },
  {
    icon: Users,
    title: en.hub.featureCollabTitle,
    body: en.hub.featureCollabBody,
    tint: 'bg-success-500',
  },
] as const;

interface ConversationEmptyStateProps {
  onFindMember: () => void;
}

export function ConversationEmptyState({ onFindMember }: ConversationEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-12 text-center">
      <div className="relative mb-8 flex h-28 w-40 items-center justify-center">
        <div className="gradient-bg animate-float-card flex size-20 items-center justify-center rounded-3xl shadow-modal">
          <MessageCircle className="size-9 text-text-inverse" aria-hidden="true" />
        </div>
        <div
          className="animate-float-blob absolute -right-1 top-0 flex size-9 items-center justify-center rounded-full bg-success-500 text-text-inverse shadow-card"
          aria-hidden="true"
        >
          <User className="size-4" />
        </div>
        <div
          className="animate-float-blob-delayed absolute -left-2 bottom-1 flex size-8 items-center justify-center rounded-full bg-warning-500 text-text-inverse shadow-card"
          aria-hidden="true"
        >
          <User className="size-4" />
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
        {en.app.name}
      </p>
      <h2 className="mt-3 max-w-lg text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
        {en.hub.emptyTitle}
      </h2>
      <p className="mt-4 max-w-md text-sm text-text-secondary">{en.hub.emptySubtitle}</p>

      <Button size="lg" className="mt-8 rounded-full px-6" onClick={onFindMember}>
        {en.hub.emptyCta}
      </Button>

      <div className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body, tint }) => (
          <div
            key={title}
            className="flex flex-col items-start gap-2 rounded-xl border border-border bg-surface-raised p-4 text-left shadow-card"
          >
            <span
              className={`flex size-9 items-center justify-center rounded-lg ${tint} text-text-inverse`}
            >
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            <p className="text-xs text-text-secondary">{body}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-text-muted">{en.hub.footerNote}</p>
    </div>
  );
}
