import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from '@/shared/components/ui/Toast';
import { useAuthStore } from '@/store/authSlice';
import { useClubMembers } from '@/features/clubs/hooks/useClubMembers';
import { useChannels } from '@/features/chat/hooks/useChannels';
import { useMessages } from '@/features/chat/hooks/useMessages';
import { useTypingSimulation } from '@/features/chat/hooks/useTypingSimulation';
import { ConversationThreadPanel } from '@/features/chat/components/ConversationThreadPanel';
import { GroupInfoPanel } from '@/features/chat/components/GroupInfoPanel';
import { MemberProfileDrawer } from '@/features/chat/components/MemberProfileDrawer';
import type { MyClub } from '@/types/club.types';

interface GroupChatViewProps {
  club: MyClub;
  channelId: string;
  channelSubtitle: string;
  category?: string;
  onBack: () => void;
}

export function GroupChatView({
  club,
  channelId,
  channelSubtitle,
  category,
  onBack,
}: GroupChatViewProps) {
  const navigate = useNavigate();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [notificationsMuted, setNotificationsMuted] = useState(false);
  const [pinnedVisible, setPinnedVisible] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pollComposerOpen, setPollComposerOpen] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  const membersQuery = useClubMembers(club.id, club.memberCount);
  const channelsQuery = useChannels(club.id);
  const messagesQuery = useMessages(channelId);

  const members = membersQuery.data?.data ?? [];
  const onlineCount = members.filter((m) => m.isOnline).length;
  const mentionCandidates = members.map((m) => ({ id: m.userId, fullName: m.user.fullName }));
  const otherMemberNames = members
    .filter((m) => m.userId !== currentUserId)
    .map((m) => m.user.fullName.split(' ')[0]);
  const { typingName, trigger: triggerTyping } = useTypingSimulation(channelId, otherMemberNames);

  const channel = channelsQuery.data?.find((c) => c.id === channelId);
  const messages = messagesQuery.data?.data ?? [];
  const pinnedMessage = channel?.pinnedMessageId
    ? (messages.find((m) => m.id === channel.pinnedMessageId) ?? null)
    : null;

  function handleInvite() {
    const url = `${window.location.origin}${ROUTES.clubLanding(club.slug)}`;
    navigator.clipboard?.writeText(url).then(() => toast.success(en.hub.inviteLinkCopied));
  }

  function handleToggleNotifications() {
    setNotificationsMuted((v) => {
      const next = !v;
      toast.success(next ? en.hub.notificationsMuted : en.hub.notificationsUnmuted);
      return next;
    });
  }

  function handleExit() {
    if (!window.confirm(en.hub.exitGroupConfirm)) return;
    toast.success(en.hub.exitGroupSuccess);
    navigate(ROUTES.messages);
  }

  return (
    <div className="flex min-w-0 flex-1 overflow-hidden">
      <ConversationThreadPanel
        channelId={channelId}
        title={club.name}
        subtitle={en.hub.memberCountOnlineLabel(club.memberCount, onlineCount)}
        avatarUrl={club.logoUrl}
        avatarFallback={club.name.charAt(0)}
        category={category}
        isSquareAvatar
        onBack={onBack}
        isGroup
        pinnedMessage={pinnedMessage}
        pinnedVisible={pinnedVisible}
        onDismissPinned={() => setPinnedVisible((v) => !v)}
        notificationsMuted={notificationsMuted}
        onToggleNotifications={handleToggleNotifications}
        onExitGroup={handleExit}
        typingName={typingName}
        onMessageSent={triggerTyping}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        onToggleSearch={() => setSearchOpen((v) => !v)}
        onSearchQueryChange={setSearchQuery}
        pollComposerOpen={pollComposerOpen}
        onPollComposerOpenChange={setPollComposerOpen}
        mentionCandidates={mentionCandidates}
        onOpenProfile={setProfileUserId}
      />
      <GroupInfoPanel
        club={club}
        channelSubtitle={channelSubtitle}
        memberCount={club.memberCount}
        messages={messages}
        pinnedCount={channel?.pinnedMessageId ? 1 : 0}
        notificationsMuted={notificationsMuted}
        onToggleNotifications={handleToggleNotifications}
        onInvite={handleInvite}
        onOpenSearch={() => setSearchOpen(true)}
        onCreatePoll={() => setPollComposerOpen(true)}
        onExit={handleExit}
      />

      <MemberProfileDrawer
        userId={profileUserId}
        onOpenChange={(open) => !open && setProfileUserId(null)}
      />
    </div>
  );
}
