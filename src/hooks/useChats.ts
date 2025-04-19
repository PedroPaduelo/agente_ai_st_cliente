import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getChats, 
  filterChats, 
  getChatMessages,
  createMessage,
  type ChatFilterParams,
  type CreateMessageRequest 
} from '@/lib/api';

export const useChats = (params?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: ['chats', { params }],
    queryFn: async () => {
      const { data } = await getChats(params);
      return data.data;
    },
    meta: {
      description: 'Fetch paginated list of chats',
    },
  });
};

export const useFilteredChats = (filters: ChatFilterParams) => {
  return useQuery({
    queryKey: ['chats', 'filtered', { filters }],
    queryFn: async () => {
      const { data } = await filterChats(filters);
      return data.data;
    },
    enabled: !!filters.telefone || !!filters.session, // Only run if filters are provided
    meta: {
      description: 'Fetch filtered list of chats by phone number or session',
    },
  });
};

export const useChatMessages = (chatId: string) => {
  return useQuery({
    queryKey: ['chatMessages', { chatId }],
    queryFn: async () => {
      const { data } = await getChatMessages(chatId);
      return data.data;
    },
    enabled: !!chatId, // Only run if chatId is provided
    meta: {
      description: 'Fetch messages for a specific chat',
    },
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newMessage: CreateMessageRequest) => {
      const { data } = await createMessage(newMessage);
      return data.data;
    },
    onSuccess: (_, variables) => {
      // If we have a chat_id, invalidate that specific chat's messages
      if (variables.chat_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['chatMessages', { chatId: variables.chat_id }] 
        });
      }
      
      // Always invalidate all chats when a new message is created
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      
      // Potentially also invalidate any filtered chat queries
      queryClient.invalidateQueries({ 
        queryKey: ['chats', 'filtered'],
        predicate: (query) => {
          // Only invalidate filtered queries that might include this chat
          if (query.queryKey.length >= 3 && query.queryKey[2]) {
            const filters = (query.queryKey[2] as any).filters;
            return !filters || 
                   (filters.telefone && filters.telefone === variables.telefone) ||
                   (filters.session && variables.chat_id && filters.session === variables.chat_id);
          }
          return false;
        }
      });
    },
    meta: {
      description: 'Create a new message',
    },
  });
};
