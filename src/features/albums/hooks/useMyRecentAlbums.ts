import { useQueries } from '@tanstack/react-query';
import { albumService } from '@/features/albums/services/albumService';
import { useMyClubs } from '@/features/clubs/hooks/useMyClubs';
import { queryKeys } from '@/shared/constants/queryKeys';
import type { Album, MyClub } from '@/types/club.types';

export interface RecentAlbum {
  album: Album;
  club: MyClub;
}

export function useMyRecentAlbums(limit: number) {
  const myClubsQuery = useMyClubs();
  const myClubs = myClubsQuery.data ?? [];

  const albumQueries = useQueries({
    queries: myClubs.map((club) => ({
      queryKey: queryKeys.albums.byClub(club.id),
      queryFn: () => albumService.listByClub(club.id),
      enabled: myClubsQuery.isSuccess,
    })),
  });

  const isPending = myClubsQuery.isPending || albumQueries.some((q) => q.isPending);

  const recentAlbums: RecentAlbum[] = myClubs
    .flatMap((club, index) => {
      const albums = albumQueries[index]?.data ?? [];
      return albums.map((album) => ({ album, club }));
    })
    .sort((a, b) => new Date(b.album.createdAt).getTime() - new Date(a.album.createdAt).getTime())
    .slice(0, limit);

  return { data: recentAlbums, isPending };
}
