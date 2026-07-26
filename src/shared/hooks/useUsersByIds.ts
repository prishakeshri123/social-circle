import { useQueries } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { queryKeys } from '@/shared/constants/queryKeys';
import type { User } from '@/types/user.types';

export function useUsersByIds(userIds: string[]): Record<string, User> {
  const uniqueIds = [...new Set(userIds)];

  const results = useQueries({
    queries: uniqueIds.map((id) => ({
      queryKey: queryKeys.users.detail(id),
      queryFn: () => userService.getById(id),
      staleTime: Infinity,
    })),
  });

  const map: Record<string, User> = {};
  results.forEach((result, index) => {
    if (result.data) map[uniqueIds[index]] = result.data;
  });
  return map;
}
