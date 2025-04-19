import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { PaginationParams, ChatFilterParams, TransbordoRequest } from "@/lib/api";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/utils";
import { requestTransbordo } from "@/lib/api";
import { 
  useInboxChats, 
  useFilteredInboxChats, 
  useInboxChatMessages, 
  useSessionEvents,
  useSendInboxMessage,
  type InboxChat,
  type InboxMessage
} from "@/hooks/useInbox";

interface InboxContextType {
  // Estado
  selectedChat: string | null;
  pagination: PaginationParams;
  newMessage: string;
  telefoneFilter: string;
  sessionFilter: string;
  bankFilter: string;
  hasBalanceFilter: string;
  instanciaFilter: string;
  dateFromFilter: string;
  dateToFilter: string;
  isFilterActive: boolean;
  transbordoIsPending: boolean;
  notification: {
    type: 'success' | 'error';
    message: string;
    visible: boolean;
  };
  
  // Dados
  chats: InboxChat[];
  totalChats: number;
  messages: InboxMessage[];
  isChatsLoading: boolean;
  isMessagesLoading: boolean;
  chatsError: unknown;
  messagesError: unknown;
  sendMessageIsPending: boolean;
  
  // Ações
  setSelectedChat: (chatId: string) => void;
  setPagination: React.Dispatch<React.SetStateAction<PaginationParams>>;
  setNewMessage: (message: string) => void;
  setTelefoneFilter: (telefone: string) => void;
  setSessionFilter: (session: string) => void;
  setBankFilter: (bank: string) => void;
  setHasBalanceFilter: (hasBalance: string) => void;
  setInstanciaFilter: (instancia: string) => void;
  setDateFromFilter: (dateFrom: string) => void;
  setDateToFilter: (dateTo: string) => void;
  handleApplyFilter: () => void;
  handleClearFilter: () => void;
  handleSendMessage: () => Promise<void>;
  handleTransbordo: () => Promise<void>;
}

const InboxContext = createContext<InboxContextType | undefined>(undefined);

export function InboxProvider({ children }: { children: ReactNode }) {
  // Query client para atualizar as queries
  const queryClient = useQueryClient();
  
  // Estado local
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: 10,
    offset: 0,
  });
  const [newMessage, setNewMessage] = useState("");
  // Recuperar filtros salvos do localStorage
  const [telefoneFilter, setTelefoneFilter] = useState(() => 
    getFromLocalStorage<string>("inbox_telefoneFilter", ""));
    
  const [sessionFilter, setSessionFilter] = useState(() => 
    getFromLocalStorage<string>("inbox_sessionFilter", ""));
    
  const [bankFilter, setBankFilter] = useState(() => 
    getFromLocalStorage<string>("inbox_bankFilter", ""));
    
  const [hasBalanceFilter, setHasBalanceFilter] = useState(() => 
    getFromLocalStorage<string>("inbox_hasBalanceFilter", ""));
    
  const [instanciaFilter, setInstanciaFilter] = useState(() => 
    getFromLocalStorage<string>("inbox_instanciaFilter", ""));
    
  const [dateFromFilter, setDateFromFilter] = useState(() => 
    getFromLocalStorage<string>("inbox_dateFromFilter", ""));
    
  const [dateToFilter, setDateToFilter] = useState(() => 
    getFromLocalStorage<string>("inbox_dateToFilter", ""));
    
  const [isFilterActive, setIsFilterActive] = useState(() => 
    getFromLocalStorage<boolean>("inbox_isFilterActive", false))

  // Parâmetros de filtro
  const filterParams: ChatFilterParams = {
    ...pagination,
    ...(telefoneFilter ? { telefone: telefoneFilter } : {}),
    ...(sessionFilter ? { session: sessionFilter } : {}),
    ...(bankFilter ? { bank: bankFilter } : {}),
    ...(hasBalanceFilter ? { has_balance: hasBalanceFilter === "true" } : {}),
    ...(instanciaFilter ? { instancia: instanciaFilter } : {}),
    ...(dateFromFilter && dateFromFilter.trim() !== "" ? { dateFrom: dateFromFilter } : {}),
    ...(dateToFilter && dateToFilter.trim() !== "" ? { dateTo: dateToFilter } : {})
  };

  // Efeito para salvar filtros no localStorage quando mudarem
  useEffect(() => {
    saveToLocalStorage("inbox_telefoneFilter", telefoneFilter);
    saveToLocalStorage("inbox_sessionFilter", sessionFilter);
    saveToLocalStorage("inbox_bankFilter", bankFilter);
    saveToLocalStorage("inbox_hasBalanceFilter", hasBalanceFilter);
    saveToLocalStorage("inbox_instanciaFilter", instanciaFilter);
    saveToLocalStorage("inbox_dateFromFilter", dateFromFilter);
    saveToLocalStorage("inbox_dateToFilter", dateToFilter);
    saveToLocalStorage("inbox_isFilterActive", isFilterActive);
  }, [telefoneFilter, sessionFilter, bankFilter, hasBalanceFilter, instanciaFilter, dateFromFilter, dateToFilter, isFilterActive]);
  
  // Consultas de dados
  const filteredChatsQuery = useFilteredInboxChats(filterParams);
  const allChatsQuery = useInboxChats(pagination);
  
  // Usar os resultados da consulta baseado no estado do filtro
  const chatsData = isFilterActive ? filteredChatsQuery.data : allChatsQuery.data;
  const isChatsLoading = isFilterActive ? filteredChatsQuery.isLoading : allChatsQuery.isLoading;
  const chatsError = isFilterActive ? filteredChatsQuery.error : allChatsQuery.error;

  // Buscar eventos usando o hook de eventos de sessão - usa o chatId diretamente
  const {
    data: eventsData,
    isLoading: isEventsLoading,
    error: eventsError
  } = useSessionEvents(selectedChat);
  
  // Manter hook legacy para compatibilidade e transição
  const {
    data: messagesData,
    isLoading: isMessagesDataLoading,
    error: messagesDataError
  } = useInboxChatMessages(selectedChat);

  const sendMessageMutation = useSendInboxMessage();
  const [transbordoIsPending, setTransbordoIsPending] = useState(false);

  // Dados extraídos
  const chats = chatsData?.chats || [];
  const totalChats = chatsData?.pagination.total || 0;
  
  // Usar eventos se disponíveis, caso contrário usar mensagens antigas
  const messages = eventsData?.events || messagesData?.messages || [];
  const isMessagesLoading = isEventsLoading || isMessagesDataLoading;
  const messagesError = eventsError || messagesDataError;

  // Handlers
  const handleSelectChat = (chatId: string) => {
    // Se o dispositivo for móvel e este chat for selecionado, fechar sidebar (implementação futura)
    setSelectedChat(chatId);
  };
  
  const handleApplyFilter = () => {
    // Verificar se há pelo menos um filtro preenchido
    if (telefoneFilter || sessionFilter || bankFilter || hasBalanceFilter || instanciaFilter || dateFromFilter || dateToFilter) {
      setIsFilterActive(true);
      setPagination(prev => ({...prev, offset: 0}));
      setSelectedChat(null);
      
      // Salvar estado de filtros no localStorage
      saveToLocalStorage("inbox_isFilterActive", true);
    }
  };
  
  const handleClearFilter = () => {
    setTelefoneFilter("");
    setSessionFilter("");
    setBankFilter("");
    setHasBalanceFilter("");
    setInstanciaFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    setIsFilterActive(false);
    setPagination(prev => ({...prev, offset: 0}));
    setSelectedChat(null);
    
    // Limpar filtros no localStorage
    saveToLocalStorage("inbox_telefoneFilter", "");
    saveToLocalStorage("inbox_sessionFilter", "");
    saveToLocalStorage("inbox_bankFilter", "");
    saveToLocalStorage("inbox_hasBalanceFilter", "");
    saveToLocalStorage("inbox_instanciaFilter", "");
    saveToLocalStorage("inbox_dateFromFilter", "");
    saveToLocalStorage("inbox_dateToFilter", "");
    saveToLocalStorage("inbox_isFilterActive", false);
  };

  const handleSendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;

    const selectedChatData = chats.find((chat) => chat.id === selectedChat);
    if (!selectedChatData) return;

    try {
      // Use a instância do chat selecionado, se disponível
      let instancia = selectedChatData.instancia || "";
      
      // Se não tiver instância no chat, procurar nas mensagens
      if (!instancia && messages.length > 0) {
        for (const msg of messages) {
          if (msg.instancia && msg.instancia.trim() !== "") {
            instancia = msg.instancia;
            break;
          }
        }
        
        // Se ainda não encontrou, usar a sessão como fallback
        if (!instancia && selectedChatData.session) {
          instancia = selectedChatData.session;
        }
      }
      
      const messageData = {
        chat_id: selectedChatData.id,
        telefone: selectedChatData.telefone,
        sender: "bot" as const,
        instancia: instancia || "App Web",
        message: newMessage.trim(),
      };

      setNewMessage("");
      await sendMessageMutation.mutateAsync(messageData);
      
      // Invalidar tanto as mensagens quanto os eventos para forçar atualização
      if (selectedChat) {
        queryClient.invalidateQueries({
          queryKey: ['inbox', 'messages', { chatId: selectedChat }]
        });
        
        // Invalidar eventos para o chat selecionado
        queryClient.invalidateQueries({
          queryKey: ['session', 'events', { chatId: selectedChat }]
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Estado para mensagens de notificação
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    visible: boolean;
  }>({ type: 'success', message: '', visible: false });

  // Função para realizar o transbordo de atendimento
  const handleTransbordo = async () => {
    if (!selectedChat) return;

    const selectedChatData = chats.find((chat) => chat.id === selectedChat);
    if (!selectedChatData) return;
    
    try {
      setTransbordoIsPending(true);
      
      // Prepara os dados para o transbordo
      const transbordoData: TransbordoRequest = {
        telefone: selectedChatData.telefone,
        session: selectedChatData.session,
        agente: "Agente Sofia", // Nome fixo do agente de IA
        instancia: selectedChatData.instancia || (messages.length > 0 ? messages[0].instancia : "")
      };
      
      // Envia a requisição de transbordo
      await requestTransbordo(transbordoData);
      
      // Forçar recarregamento imediato das mensagens e eventos
      if (selectedChat) {
        await queryClient.refetchQueries({
          queryKey: ['inbox', 'messages', { chatId: selectedChat }],
          exact: true
        });
        
        // Recarregar também os eventos da sessão
        await queryClient.refetchQueries({
          queryKey: ['session', 'events', { chatId: selectedChat }],
          exact: true
        });
      }
      
      // Exibe notificação de sucesso
      setNotification({
        type: 'success',
        message: 'Atendimento transferido com sucesso!',
        visible: true
      });
      
      // Esconde a notificação após 3 segundos e atualiza novamente
      setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
        // Refetch adicional após a notificação desaparecer para garantir atualização
        if (selectedChat) {
          queryClient.refetchQueries({
            queryKey: ['inbox', 'messages', { chatId: selectedChat }],
            exact: true
          });
          
          // Recarregar também os eventos da sessão
          queryClient.refetchQueries({
            queryKey: ['session', 'events', { chatId: selectedChat }],
            exact: true
          });
        }
      }, 3000);
      
    } catch (error) {
      console.error("Erro ao realizar transbordo:", error);
      // Exibe notificação de erro
      setNotification({
        type: 'error',
        message: 'Erro ao transferir atendimento. Tente novamente.',
        visible: true
      });
      
      // Esconde a notificação após 3 segundos
      setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
      }, 3000);
    } finally {
      setTransbordoIsPending(false);
    }
  };

  const value = {
    // Estado
    selectedChat,
    pagination,
    newMessage,
    telefoneFilter,
    sessionFilter,
    bankFilter,
    hasBalanceFilter,
    instanciaFilter,
    dateFromFilter,
    dateToFilter,
    isFilterActive,
    transbordoIsPending,
    notification,
    
    // Dados
    chats,
    totalChats,
    messages,
    isChatsLoading,
    isMessagesLoading,
    chatsError,
    messagesError,
    sendMessageIsPending: sendMessageMutation.isPending,
    
    // Ações
    setSelectedChat: handleSelectChat,
    setPagination,
    setNewMessage,
    setTelefoneFilter,
    setSessionFilter,
    setBankFilter,
    setHasBalanceFilter,
    setInstanciaFilter,
    setDateFromFilter,
    setDateToFilter,
    handleApplyFilter,
    handleClearFilter,
    handleSendMessage,
    handleTransbordo,
  };

  return (
    <InboxContext.Provider value={value}>
      {children}
    </InboxContext.Provider>
  );
}

export function useInboxContext() {
  const context = useContext(InboxContext);
  if (context === undefined) {
    throw new Error("useInboxContext must be used within an InboxProvider");
  }
  return context;
}
