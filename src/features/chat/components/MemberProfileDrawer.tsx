import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/Sheet';
import { toast } from '@/shared/components/ui/Toast';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { LS_BLOCKED_USERS_KEY } from '@/shared/constants/app.constants';
import { formatDate } from '@/shared/utils/formatDate';
import { cn } from '@/shared/utils/cn';
import { useUsersByIds } from '@/shared/hooks/useUsersByIds';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

interface MemberProfileDrawerProps {
  userId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function MemberProfileDrawer({ userId, onOpenChange }: MemberProfileDrawerProps) {
  const navigate = useNavigate();
  const usersById = useUsersByIds(userId ? [userId] : []);
  const [blockedIds, setBlockedIds] = useLocalStorage<string[]>(LS_BLOCKED_USERS_KEY, []);

  const user = userId ? usersById[userId] : undefined;
  const isBlocked = Boolean(userId) && blockedIds.includes(userId!);

  function handleSendMessage() {
    if (!userId) return;
    onOpenChange(false);
    navigate(ROUTES.messageThread(userId));
  }

  function handleToggleBlock() {
    if (!userId) return;
    setBlockedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
    toast.success(isBlocked ? en.actions.unblock : en.actions.block);
  }

  return (
    <Sheet open={Boolean(userId)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        {user && (
          <>
            <SheetHeader className="items-center text-center">
              <Avatar className="size-20">
                <AvatarImage src={user.avatarUrl} alt="" />
                <AvatarFallback className="text-xl">{user.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <SheetTitle>{user.fullName}</SheetTitle>
              {user.bio && <p className="text-sm text-text-secondary">{user.bio}</p>}
              <p className="text-xs text-text-muted">
                {en.members.memberSince(formatDate(new Date(user.joinedAt), 'MMMM yyyy'))}
              </p>
            </SheetHeader>

            <div className="flex flex-col gap-2">
              <Button type="button" onClick={handleSendMessage}>
                <MessageCircle className="size-4" aria-hidden="true" />
                {en.members.sendMessage}
              </Button>
              <Button
                type="button"
                variant="outline"
                className={cn(isBlocked && 'text-error-500')}
                onClick={handleToggleBlock}
              >
                {isBlocked ? en.actions.unblock : en.actions.block}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
