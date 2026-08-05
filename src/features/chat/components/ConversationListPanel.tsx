import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/DropdownMenu';
import { Input } from '@/shared/components/ui/Input';
import { ScrollArea } from '@/shared/components/ui/ScrollArea';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { en } from '@/shared/constants/locales/en';
import { cn } from '@/shared/utils/cn';
import type { HubFilter, HubItem, HubSortMode } from '@/features/chat/utils/hubItems';
import { ConversationListItem } from '@/features/chat/components/ConversationListItem';

const FILTERS: { value: HubFilter; label: string }[] = [
  { value: 'all', label: en.hub.filterAll },
  { value: 'chats', label: en.hub.filterChats },
  { value: 'groups', label: en.hub.filterGroups },
  { value: 'clubs', label: en.hub.filterClubs },
];

interface ConversationListPanelProps {
  className?: string;
  items: HubItem[];
  isLoading: boolean;
  filter: HubFilter;
  onFilterChange: (filter: HubFilter) => void;
  unreadConversationCount: number;
  sortMode: HubSortMode;
  onSortModeChange: (mode: HubSortMode) => void;
  search: string;
  onSearchChange: (value: string) => void;
  selectedKey: string | null;
  onSelectItem: (item: HubItem) => void;
  onFindMember: () => void;
  emptyMessage: string;
}

export function ConversationListPanel({
  className,
  items,
  isLoading,
  filter,
  onFilterChange,
  unreadConversationCount,
  sortMode,
  onSortModeChange,
  search,
  onSearchChange,
  selectedKey,
  onSelectItem,
  onFindMember,
  emptyMessage,
}: ConversationListPanelProps) {
  return (
    <div className={cn('flex flex-col border-r border-border bg-surface-raised', className)}>
      <div className="shrink-0 space-y-4 border-b border-border p-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-text-primary">{en.nav.chats}</h1>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onFindMember}
              aria-label={en.hub.findMemberTooltip}
              title={en.hub.findMemberTooltip}
            >
              <Plus className="size-5" aria-hidden="true" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label={en.hub.sortTooltip}
                  title={en.hub.sortTooltip}
                >
                  <SlidersHorizontal className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={sortMode}
                  onValueChange={(value) => onSortModeChange(value as HubSortMode)}
                >
                  <DropdownMenuRadioItem value="recent">{en.hub.sortRecent}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="unread">
                    {en.hub.sortUnreadFirst}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={en.hub.searchPlaceholder}
            aria-label={en.hub.searchPlaceholder}
            className="rounded-full pl-9"
          />
        </div>

        <div
          className="flex items-center gap-4 border-b border-border"
          role="group"
          aria-label={en.actions.filter}
        >
          {FILTERS.map(({ value, label }) => {
            const isActive = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onFilterChange(value)}
                aria-pressed={isActive}
                className={cn(
                  'flex items-center gap-1.5 border-b-2 pb-2 text-sm font-medium transition-colors duration-fast',
                  isActive
                    ? 'border-primary-600 text-text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary',
                )}
              >
                {label}
                {value === 'all' && unreadConversationCount > 0 && (
                  <Badge
                    variant={isActive ? 'default' : 'secondary'}
                    className="flex size-4 items-center justify-center rounded-full p-0 text-[10px]"
                  >
                    {unreadConversationCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                <Skeleton className="size-11 shrink-0 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}

          {!isLoading && items.length === 0 && <EmptyState title={emptyMessage} />}

          {!isLoading &&
            items.map((item) => (
              <ConversationListItem
                key={item.key}
                kind={item.kind}
                avatarUrl={item.avatarUrl}
                avatarFallback={item.avatarFallback}
                category={item.category}
                title={item.title}
                subtitle={item.subtitle}
                timestamp={item.timestamp}
                unreadCount={item.unreadCount}
                isOnline={item.isOnline}
                isSelected={selectedKey === item.key}
                onClick={() => onSelectItem(item)}
              />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
