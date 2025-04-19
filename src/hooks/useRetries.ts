import { useQuery } from '@tanstack/react-query';
import { 
  getRetries, 
  type PaginationParams,
  type RetryFilterParams
} from '@/lib/api';

export const useRetries = (params?: PaginationParams | RetryFilterParams) => {
  return useQuery({
    queryKey: ['retries', { params }],
    queryFn: async () => {
      const { data } = await getRetries(params);
      
      if (data.success) {
        return {
          data: data.data,
          pagination: data.pagination,
          total: data.pagination?.total || 0
        };
      }
      
      throw new Error('Failed to fetch retry data');
    },
    meta: {
      description: 'Fetch paginated list of retry attempts',
    },
  });
};
