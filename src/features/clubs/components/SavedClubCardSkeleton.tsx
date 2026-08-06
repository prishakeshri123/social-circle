import { Card } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';

export function SavedClubCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    </Card>
  );
}
