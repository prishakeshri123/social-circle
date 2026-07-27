import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Search, Users } from 'lucide-react';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Input } from '@/shared/components/ui/Input';
import { ClubCard } from '@/features/discovery/components/ClubCard';
import { ClubCardSkeleton } from '@/features/discovery/components/ClubCardSkeleton';
import { en } from '@/shared/constants/locales/en';
import { queryKeys } from '@/shared/constants/queryKeys';
import { clubService } from '@/features/clubs/services/clubService';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';

export function ClubsPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim(), 250);
  const clubFilters = debouncedQuery ? { search: debouncedQuery, limit: 100 } : { limit: 100 };

  const clubsQuery = useQuery({
    queryKey: queryKeys.clubs.list(clubFilters),
    queryFn: () => clubService.list(clubFilters),
  });

  const clubs = clubsQuery.data?.data ?? [];

  return (
    <PageContainer className="space-y-5 pt-4 sm:pt-6">
      <Helmet>
        <title>{en.discovery.title} | Social Circle</title>
      </Helmet>

      <header className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-text-primary">{en.discovery.title}</h1>
          <p className="max-w-2xl text-text-secondary">{en.discovery.subtitle}</p>
        </div>

        <form role="search" onSubmit={(e) => e.preventDefault()} className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={en.placeholders.search}
            className="pl-9"
            aria-label={en.actions.search}
          />
        </form>
      </header>

      {clubsQuery.isPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ClubCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!clubsQuery.isPending && clubs.length === 0 && (
        <EmptyState icon={Users} title="No clubs available yet." />
      )}

      {!clubsQuery.isPending && clubs.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
