import { Card } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';

export function InvitationCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <Skeleton className="h-1 w-full rounded-none" />
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 flex-1 rounded-md" />
        </div>
      </div>
    </Card>
  );
}
