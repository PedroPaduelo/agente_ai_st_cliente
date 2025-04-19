import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getChats,
  filterChats,
  getChatMessages,
  getSessionEvents,
  createMessage,
  type Chat as APIChat,
  type Message as APIMessage,
  type SessionEvent as APISessionEvent,
  type PaginationParams,
  type ChatFilterParams,
  type CreateMessageRequest
} from '@/lib/api';

// Custom Inbox Chat type
export interface InboxChat {
  id: string;
  telefone: string;
  session: string;
  instancia?: string;
  balance?: string | null;
  bank?: string | null;
  hasBalance?: boolean;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
  customer?: string;
  status?: 'active' | 'transbordo' | 'closed';
}

// Interface para dados de evento
export interface EventData {
  status?: string;
  descricao?: string;
  protocolo?: string;
  sessaoid?: string;
  msg?: string | null;
  banco?: string;
  valor_liquido?: string;
  valorliberado?: string;
  cpf?: string;
  id_cadastro?: string;
  id_facebook?: string;
  [key: string]: unknown; // Para permitir outras propriedades não listadas acima
}

// Custom Inbox Message type
export interface InboxMessage {
  id: string;
  sender: "user" | "bot";
  instancia: string;
  content: string;
  timestamp: string;
  eventType?: string; // Tipo de evento como "message", "transbordo", "consulta cpf", "valida cpf", etc.
  retry?: boolean; // Indica se a mensagem foi uma retentativa
  isTransbordo?: boolean;
  transbordo?: {
    status: boolean;
  };
  eventData?: EventData; // Dados específicos do evento
  agente?: string; // Nome do agente
  session?: string; // ID da sessão
}

// Transform API Chat data to InboxChat format
export function transformChats(apiChats: APIChat[]): InboxChat[] {
  if (!apiChats || !Array.isArray(apiChats) || apiChats.length === 0) {
    return [];
  }

  return apiChats.map((chat) => {
    // Extrair as informações relevantes da API
    const telefone = chat.telefone || "5511999999999"; // Default fallback
    const session = chat.session || "";

    const message_count =
      typeof chat.message_count === "string"
        ? Number.parseInt(chat.message_count, 10)
        : chat.message_count || 0;

    // Get last message content
    const lastMessage =
      typeof chat.last_message === "string"
        ? chat.last_message
        : Object.keys(chat.last_message || {}).length === 0
          ? `Última mensagem (total: ${message_count})`
          : "Sem mensagens";

    // Use phone number as customer name (in a real app, this would come from a contact DB)
    const customerName = telefone;

    // Determine status based on business logic
    // This should be updated based on actual API data
    const status: "active" | "transbordo" | "closed" = "active";

    // Use timestamp from API or default to current time
    const timestamp = typeof chat.creating_at === 'string'
    ? chat.creating_at
    : new Date().toISOString();


    // Usar o id do chat como identificador único
    // Se não tiver id definido, usar o índice como fallback
    const id = chat.id;

    return {
      id: id,
      telefone: telefone,
      session: session,
      instancia: chat.instancia,
      balance: chat.balance,
      bank: chat.bank,
      hasBalance: chat.has_balance === true,
      customer: customerName,
      lastMessage: lastMessage,
      timestamp: timestamp,
      unread: false, // This should be determined by business logic
      status: status,
    };
  });
}

// Transform API SessionEvent data to InboxMessage format
export function transformSessionEvents(events: APISessionEvent[]): InboxMessage[] {
  if (!events || !Array.isArray(events) || events.length === 0) {
    return [];
  }

  // Instância padrão a ser usada
  const defaultInstancia = events.length > 0 ? events[0].instancia || "App Web" : "App Web";
  
  return events.map((event, index) => {
    // Ensure we have valid values or provide defaults
    const id = event.id || `event-${index}`;

    // Map 'in' to 'user' and 'out' to 'bot' for sender
    const sender: "user" | "bot" = event.sender === "in" ? "user" : "bot";

    // Timestamp
    const timestamp = event.creating_at || new Date().toISOString();

    let content = "";
    const eventType = event.type_event || "message";
    let isTransbordo = event.transbordo;
    let transbordoStatus = false;

    // Processar o conteúdo com base no tipo de evento
    switch (eventType) {
      case "message":
        content = event.message || "";
        break;
      case "transbordo":
        content = "Transferência de atendimento";
        isTransbordo = true;
        // Verificar o campo transbordo diretamente para determinar o status
        transbordoStatus = event.transbordo === true;
        
        if (event.retur_api && typeof event.retur_api === 'object') {
          // Verificação adicional do status no retorno da API (se disponível)
          if (event.retur_api.status !== undefined) {
            transbordoStatus = event.retur_api.status === "true";
          }
          
          if (event.retur_api.descricao) {
            content += `: ${event.retur_api.descricao}`;
          }
          if (event.retur_api.protocolo) {
            content += ` (Protocolo: ${event.retur_api.protocolo})`;
          }
        }
        break;
      case "consulta cpf":
        content = `Consulta de CPF: ${event.cpf || "N/A"}`;
        if (event.retur_api && typeof event.retur_api === 'object') {
          if (event.retur_api.banco && event.retur_api.valor_liquido) {
            content = `Consulta de CPF: ${event.cpf || "N/A"} - Resultado encontrado`;
          } else if (event.retur_api.msg === null) {
            content = `Consulta de CPF: ${event.cpf || "N/A"} - Sem resultado`;
          }
        }
        break;
      case "valida cpf":
        if (event.retur_api && typeof event.retur_api === 'object' && event.retur_api.cpf) {
          content = `Validação de CPF: ${event.retur_api.cpf}`;
          if (event.retur_api.id_cadastro) {
            content += ` (ID: ${event.retur_api.id_cadastro})`;
          }
        } else {
          content = `Validação de CPF: ${event.cpf || "N/A"}`;
        }
        break;
      default:
        content = `Evento: ${eventType}`;
        if (event.message) {
          content += ` - ${event.message}`;
        }
    }

    return {
      id,
      sender,
      instancia: event.instancia || defaultInstancia,
      content,
      timestamp,
      eventType,
      retry: false,
      isTransbordo,
      transbordo: {
        status: transbordoStatus
      },
      eventData: event.retur_api,
      agente: event.agente,
      session: event.session
    };
  });
}

// Função legada para manter compatibilidade
export function transformMessages(apiMessages: APIMessage[]): InboxMessage[] {
  if (!apiMessages || !Array.isArray(apiMessages) || apiMessages.length === 0) {
    return [];
  }

  // Encontrar a primeira instância na lista de mensagens, se existir
  let firstInstancia = "";
  for (const msg of apiMessages) {
    if (msg.instancia && typeof msg.instancia === 'string' && msg.instancia.trim() !== '') {
      firstInstancia = msg.instancia;
      break;
    }
  }

  // Usar session_id como fallback para instância
  const sessionId = apiMessages.length > 0 && apiMessages[0].session_id 
    ? apiMessages[0].session_id 
    : "";

  // Instância final - usa a primeira encontrada ou session_id como fallback
  const defaultInstancia = firstInstancia || sessionId || "App Web";

  return apiMessages.map((message, index) => {
    // Ensure we have valid values or provide defaults
    const id = message.id || `msg-${index}`;

    // Map 'in' to 'user' and 'out' to 'bot' for sender
    let sender: "user" | "bot";
    if (message.sender === "in") {
      sender = "user";
    } else if (message.sender === "out") {
      sender = "bot";
    } else if (message.sender === "user" || message.sender === "bot") {
      sender = message.sender;
    } else {
      sender = "bot"; // Default fallback
    }

    const messageContent = message.message || message.retorno_api?.descricao || "";
    
    // Verificar se a propriedade está presente usando type guard
    const hasRetornoApi = (msg: Record<string, unknown>): msg is { retorno_api: { descricao?: string, status?: string } } => 
      'retorno_api' in msg && typeof msg.retorno_api === 'object';

    // Use timestamp from API or default to current time
    let timestamp = new Date().toISOString();
      
    if (message.created_at) {
      timestamp = message.created_at;
    } else if (message.creating_at) {
      timestamp = typeof message.creating_at === 'string'
        ? message.creating_at
        : new Date().toISOString();
    }

    // Adicionar o campo retry se existir na API
    return {
      id: id,
      sender: sender,
      instancia: message.instancia || defaultInstancia,
      content: messageContent,
      timestamp: timestamp,
      eventType: 'message',
      retry: 'retry' in message ? !!message.retry : undefined,
      isTransbordo: message.transbordo,
      transbordo: {
        status: hasRetornoApi(message) ? message.retorno_api.status === "true" : false
      }
    };
  });
}

// React Query hook para buscar as conversas
export function useInboxChats(params: PaginationParams) {
  return useQuery({
    queryKey: ['inbox', 'chats', { params }],
    queryFn: async () => {
      const { data } = await getChats(params);
      return {
        chats: transformChats(data.data),
        pagination: data.pagination
      };
    },
    meta: {
      description: 'Fetch paginated chats for the inbox'
    }
  });
}

// React Query hook para buscar conversas filtradas
export function useFilteredInboxChats(filters: ChatFilterParams) {
  return useQuery({
    queryKey: ['inbox', 'chats', 'filtered', { filters }],
    queryFn: async () => {
      const { data } = await filterChats(filters);
      return {
        chats: transformChats(data.data),
        pagination: data.pagination
      };
    },
    enabled: !!filters.telefone || !!filters.session || !!filters.bank || !!filters.has_balance || !!filters.instancia,
    meta: {
      description: 'Fetch filtered chats by phone or session'
    }
  });
}

// React Query hook para buscar mensagens de um chat (mantido para compatibilidade)
export function useInboxChatMessages(chatId: string | null) {
  return useQuery({
    queryKey: ['inbox', 'messages', { chatId }],
    queryFn: async () => {
      if (!chatId) return { messages: [] };
      
      const { data } = await getChatMessages(chatId);
      return {
        messages: transformMessages(data.data)
      };
    },
    enabled: !!chatId,
    meta: {
      description: 'Fetch messages for a specific chat'
    }
  });
}

// React Query hook para buscar eventos de uma sessão
export function useSessionEvents(chatId: string | null) {
  return useQuery({
    queryKey: ['session', 'events', { chatId }],
    queryFn: async () => {
      if (!chatId) return { events: [] };
      
      const { data } = await getSessionEvents(chatId);
      return {
        events: transformSessionEvents(data.data)
      };
    },
    enabled: !!chatId,
    meta: {
      description: 'Fetch all events for a specific chat'
    }
  });
}

// React Query hook para enviar uma nova mensagem
export function useSendInboxMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (message: CreateMessageRequest) => {
      const { data } = await createMessage(message);
      return data.data;
    },
    onSuccess: (_, variables) => {
      // Invalida as mensagens do chat atual para refazer a busca
      if (variables.chat_id) {
        queryClient.invalidateQueries({
          queryKey: ['inbox', 'messages', { chatId: variables.chat_id }]
        });
      }
      
      // Também invalida a lista de chats para atualizar a mensagem mais recente
      queryClient.invalidateQueries({
        queryKey: ['inbox', 'chats'],
        predicate: (query) => !query.queryKey.includes('filtered')
      });
      
      // Se tiver filtro de telefone, também invalida as consultas filtradas correspondentes
      if (variables.telefone) {
        queryClient.invalidateQueries({
          queryKey: ['inbox', 'chats', 'filtered'],
          predicate: (query) => {
            if (query.queryKey.length >= 4 && query.queryKey[3]) {
              const filtersObj = query.queryKey[3] as { filters?: ChatFilterParams };
              return filtersObj?.filters?.telefone === variables.telefone;
            }
            return false;
          }
        });
      }
    },
    meta: {
      description: 'Send a new message in a chat'
    }
  });
}
