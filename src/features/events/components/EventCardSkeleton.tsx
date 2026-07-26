import { Card } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';

export function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-32" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </Card>
  );
}
