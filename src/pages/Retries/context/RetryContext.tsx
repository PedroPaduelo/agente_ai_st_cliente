import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { PaginationParams, Retry, RetryFilterParams } from "@/lib/api";
import { useRetries } from "@/hooks/useRetries";

interface RetryContextType {
  // Estado
  pagination: PaginationParams;
  
  // Filtros
  telefoneFilter: string;
  sessionFilter: string;
  flagueTransbordoFilter: string;
  tentativasExecutadasFilter: string;
  dateFromFilter: string;
  dateToFilter: string;
  isFiltering: boolean;
  
  // Dados
  retries: Retry[];
  totalRetries: number;
  isLoading: boolean;
  error: unknown;
  isError: boolean;
  
  // Ações
  setPagination: React.Dispatch<React.SetStateAction<PaginationParams>>;
  setTelefoneFilter: (value: string) => void;
  setSessionFilter: (value: string) => void;
  setFlagueTransbordoFilter: (value: string) => void;
  setTentativasExecutadasFilter: (value: string) => void;
  setDateFromFilter: (value: string) => void;
  setDateToFilter: (value: string) => void;
  handleSearch: () => void;
  handleClearFilters: () => void;
}

const RetryContext = createContext<RetryContextType | undefined>(undefined);

export function RetryProvider({ children }: { children: ReactNode }) {
  // Estado paginação
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: 10,
    offset: 0,
  });
  
  // Estado filtros
  const [telefoneFilter, setTelefoneFilter] = useState("");
  const [sessionFilter, setSessionFilter] = useState("");
  const [flagueTransbordoFilter, setFlagueTransbordoFilter] = useState("todos");
  const [tentativasExecutadasFilter, setTentativasExecutadasFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterParams, setFilterParams] = useState<RetryFilterParams | null>(null);
  
  // Query para busca com ou sem filtro
  const {
    data,
    isLoading,
    error
  } = useRetries(isFiltering && filterParams ? filterParams : pagination);
  
  const retries = data?.data || [];
  const totalRetries = data?.total || 0;
  
  // Resetar offset quando mudar o filtro
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isFiltering) {
      setPagination(prev => ({
        ...prev,
        offset: 0
      }));
    }
  }, [isFiltering, filterParams]);
  
  // Função para realizar busca com filtros
  const handleSearch = () => {
    if (telefoneFilter.trim() || sessionFilter.trim() || 
        (flagueTransbordoFilter && flagueTransbordoFilter !== "todos") || tentativasExecutadasFilter.trim() ||
        dateFromFilter.trim() || dateToFilter.trim()) {
      
      const params: RetryFilterParams = {
        limit: pagination.limit,
      };
      
      if (telefoneFilter.trim()) {
        params.telefone = telefoneFilter.trim();
      }
      
      if (sessionFilter.trim()) {
        params.session = sessionFilter.trim();
      }
      
      if (flagueTransbordoFilter && flagueTransbordoFilter !== "todos") {
        params.flague_transbordo = flagueTransbordoFilter;
      }
      
      if (tentativasExecutadasFilter.trim()) {
        params.tentativas_executadas = tentativasExecutadasFilter.trim();
      }
      
      if (dateFromFilter.trim()) {
        params.dateFrom = dateFromFilter.trim();
      }
      
      if (dateToFilter.trim()) {
        params.dateTo = dateToFilter.trim();
      }
      
      setFilterParams(params);
      setIsFiltering(true);
    }
  };
  
  // Função para limpar filtros
  const handleClearFilters = () => {
    setTelefoneFilter("");
    setSessionFilter("");
    setFlagueTransbordoFilter("todos");
    setTentativasExecutadasFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    setIsFiltering(false);
    setFilterParams(null);
  };

  const contextValue: RetryContextType = {
    // Estado
    pagination,
    
    // Filtros
    telefoneFilter,
    sessionFilter,
    flagueTransbordoFilter,
    tentativasExecutadasFilter,
    dateFromFilter,
    dateToFilter,
    isFiltering,
    
    // Dados
    retries,
    totalRetries,
    isLoading,
    error,
    isError: !!error,
    
    // Ações
    setPagination,
    setTelefoneFilter,
    setSessionFilter,
    setFlagueTransbordoFilter,
    setTentativasExecutadasFilter,
    setDateFromFilter,
    setDateToFilter,
    handleSearch,
    handleClearFilters,
  };

  return (
    <RetryContext.Provider value={contextValue}>
      {children}
    </RetryContext.Provider>
  );
}

export function useRetryContext() {
  const context = useContext(RetryContext);
  
  if (context === undefined) {
    throw new Error("useRetryContext must be used within a RetryProvider");
  }
  
  return context;
}
