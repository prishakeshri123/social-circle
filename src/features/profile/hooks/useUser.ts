import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useUser(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => userService.getById(userId),
    enabled: Boolean(userId),
  });
}
