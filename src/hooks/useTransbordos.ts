import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTransbordos, 
  createTransbordo,
  type CreateTransbordoRequest,
  type PaginationParams
} from '@/lib/api';

export const useTransbordos = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['transbordos', { params }],
    queryFn: async () => {
      const { data } = await getTransbordos(params);
      return data.data;
    },
    meta: {
      description: 'Fetch paginated list of transbordos',
    },
  });
};

export const useCreateTransbordo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTransbordo: CreateTransbordoRequest) => {
      const { data } = await createTransbordo(newTransbordo);
      return data.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate transbordos queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ['transbordos'] });
      
      // If this transbordo is related to a specific chat, we should invalidate that chat's data
      if (variables.telefone) {
        queryClient.invalidateQueries({
          queryKey: ['chats', 'filtered'],
          predicate: (query) => {
            if (query.queryKey.length >= 3 && query.queryKey[2]) {
              const filters = (query.queryKey[2] as any).filters;
              return filters && filters.telefone === variables.telefone;
            }
            return false;
          }
        });
      }
    },
    meta: {
      description: 'Create a new transbordo record',
    },
  });
};
