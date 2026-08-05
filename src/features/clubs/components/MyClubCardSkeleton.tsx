import { Card } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';

export function MyClubCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-4 pt-7">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <div className="grid grid-cols-3 gap-2 border-y border-border py-3">
          <Skeleton className="mx-auto h-8 w-10" />
          <Skeleton className="mx-auto h-8 w-10" />
          <Skeleton className="mx-auto h-8 w-10" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    </Card>
  );
}
