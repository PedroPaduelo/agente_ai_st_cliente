import axios from 'axios';

// Types for API requests and responses
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface CpfLookupParams {
  limit?: number;
  offset?: number;
  telefone?: string;
  session?: string;
  cpf?: string;
  agente?: string;
  dateFrom?: string; 
  dateTo?: string; 
}

export interface CpfConsultation {
  id: string;
  session: string;
  telefone: string;
  agente: string;
  cpf: string;
  retur_api: Record<string, any>;
  creating_at: string;
}

export interface CpfConsultationsResponse {
  success: boolean;
  data: CpfConsultation[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface ChatFilterParams extends PaginationParams {
  telefone?: string;
  session?: string;
  bank?: string;
  has_balance?: boolean;
  instancia?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface Chat {
  id: string;
  last_message: string;
  message_count: string | number;
  telefone?: string;
  session?: string;
  instancia?: string;
  balance?: string | null;
  bank?: string | null;
  has_balance?: boolean;
  creating_at?: string;
  updated_at?: string;
}

export interface ChatsResponse {
  success: boolean;
  data: Chat[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface SessionEvent {
  id: string;
  type_event: string;
  session_id: string;
  instancia: string;
  session: string;
  telefone: string;
  cpf: string | null;
  agente: string;
  sender: 'in' | 'out';
  transbordo: boolean;
  event_group: boolean;
  message: string | null;
  id_event_n8n: string;
  id_event_sub_flow_n8n: string;
  creating_at: string;
  retur_api: any;
}

export interface Message {
  [x: string]: any;
  id: string;
  session_id: string;
  instancia: string;
  telefone: string;
  sender: 'in' | 'out' | 'user' | 'bot';
  transbordo: boolean;
  message: string;
  creating_at?: Record<string, any>;
  created_at?: string;
  retry?: boolean; // Indica se a mensagem foi uma retentativa
}

export interface MessagesResponse {
  success: boolean;
  data: Message[];
}

export interface SessionEventsResponse {
  success: boolean;
  data: SessionEvent[];
}

export interface CreateMessageRequest {
  chat_id?: string;
  instancia?: string;
  telefone: string;
  sender?: 'user' | 'bot';
  transbordo?: boolean;
  message: string;
}

export interface CreateMessageResponse {
  success: boolean;
  data: Message;
}

export interface Transbordo {
  id: string;
  session: string;
  telefone: string;
  transbordo: boolean;
  retur_api: string | {
    status: string;
    descricao: string;
    protocolo: string;
    sessaoid: string;
  };
  codigo: string;
  creating_at: string;
  created_at?: string;
}

export interface TransbordosResponse {
  success: boolean;
  data: Transbordo[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}


export interface CreateTransbordoRequest {
  id_n8n?: string;
  telefone: string;
  transbordo: boolean;
  retur_api?: string;
  codigo?: string;
}

export interface CreateTransbordoResponse {
  success: boolean;
  data: Transbordo;
}

export interface Retry {
  id: string;
  session: string;
  telefone: string;
  error: string;
  flague_transbordo: string;
  tentativas_executadas: string;
  ultima_mensagem: string;
  new_message: string;
  retur_api: string | {
    msg: string;
    id_facebook?: string;
  };
  creating_at: string;
}

export interface RetriesResponse {
  success: boolean;
  data: Retry[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface CreateRetryResponse {
  success: boolean;
  data: Retry;
}

export interface MessagesByDay {
  date: string;
  count: string | number;
}

export interface MessagesBySender {
  sender: string;
  count: string | number;
}

export interface MessagesByHour {
  hour: string;
  count: string | number;
}

export interface ChatLengthDistribution {
  length_category: string;
  chat_count: string | number;
}

// Novos tipos baseados na documentação da API
export interface DashboardTotals {
  chats: number;
  messages: number;
  contacts: number;
  transbordos: number;
  cpfConsultations: number;
  events: number;
}

export interface ChartItem {
  date: string;
  count: string;
}

export interface BankDistributionItem {
  bank: string;
  count: string;
}

export interface EventTypeItem {
  type_event: string;
  count: string;
}

export interface DashboardResponse {
  success: boolean;
  data: {
    totals: DashboardTotals;
    charts: {
      chatsByDay: ChartItem[];
      messagesByDay: ChartItem[];
      transbordosByDay: ChartItem[];
      bankDistribution: BankDistributionItem[];
      eventsByType: EventTypeItem[];
    }
  };
}

export interface PerformanceMetrics {
  transbordoRate: number;
  avgTimeToTransbordo: number;
  avgMessagesPerChat: number;
}

export interface AgentDistributionItem {
  agente: string;
  count: string;
}

export interface BalanceDistributionItem {
  range: string;
  count: string;
}

export interface PerformanceResponse {
  success: boolean;
  data: {
    metrics: PerformanceMetrics;
    distributions: {
      agentDistribution: AgentDistributionItem[];
      balanceDistribution: BalanceDistributionItem[];
    }
  };
}

export interface ConsultationsChartItem {
  date: string;
  count: string;
}

export interface EventGroupItem {
  group_type: string;
  count: string;
}

export interface ConsultationsResponse {
  success: boolean;
  data: {
    consultationsByDay: ConsultationsChartItem[];
    eventsByGroup: EventGroupItem[];
    balanceByConsultation: BalanceDistributionItem[];
  }
}

// Manter para compatibilidade temporária
export interface MessageStatsResponse {
  success: boolean;
  data: {
    totalMessages: number;
    messagesByDay: MessagesByDay[];
    transbordoCount: number;
    messagesBySender: MessagesBySender[];
  };
}

// Create an axios instance with the API base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://n8n-queue-n8n-api-st-bot.mrt7ga.easypanel.host',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Dashboard endpoints
export const getMessageStats = () => api.get<MessageStatsResponse>('/messages/stats');
export const getDashboard = () => api.get<DashboardResponse>('/dashboard');
export const getPerformance = () => api.get<PerformanceResponse>('/dashboard/performance');

// Webhook endpoints
export interface TransbordoRequest {
  telefone: string;
  session: string;
  agente: string;
  instancia: string;
}

export const requestTransbordo = (data: TransbordoRequest) => 
  api.post('/webhook/n8n', data);

// Chat endpoints
export const getChats = (params?: PaginationParams) => 
  api.get<ChatsResponse>('/chats', { params });

export const filterChats = (params: ChatFilterParams) => {
  // Converter has_balance de boolean para string para a API
  const apiParams = {
    ...params,
    has_balance: params.has_balance !== undefined ? String(params.has_balance) : undefined
  };
  return api.get<ChatsResponse>('/chats/filter', { params: apiParams });
};

export const getChatMessages = (chatId: string) => 
  api.get<MessagesResponse>(`/chats/${chatId}/messages`);

export const getSessionEvents = (chatId: string) => 
  api.get<SessionEventsResponse>(`/events/session/${chatId}`);

export const createMessage = (data: CreateMessageRequest) => 
  api.post<CreateMessageResponse>('/messages', data);

// Transbordo endpoints
export const getTransbordos = (params?: PaginationParams) => 
  api.get<TransbordosResponse>('/transbordos', { params });

export const createTransbordo = (data: CreateTransbordoRequest) => 
  api.post<CreateTransbordoResponse>('/transbordos', data);

// Retry endpoints
export interface RetryFilterParams extends PaginationParams {
  telefone?: string;
  session?: string;
  flague_transbordo?: string;
  tentativas_executadas?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const getRetries = (params?: PaginationParams | RetryFilterParams) => 
  api.get<RetriesResponse>('/retries', { params });


// CPF Consultation endpoints
export const getCpfConsultations = (params?: PaginationParams) => 
  api.get<CpfConsultationsResponse>('/cpf-consultations', { params });

export const lookupCpfConsultations = (params: CpfLookupParams) => 
  api.get<CpfConsultationsResponse>('/cpf-consultations', { params });

export default api;
