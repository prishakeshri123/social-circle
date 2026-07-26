import { Card } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';

export function ClubCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </Card>
  );
}
