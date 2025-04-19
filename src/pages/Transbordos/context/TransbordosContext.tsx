import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { PaginationParams, Transbordo } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { getTransbordos } from "@/lib/api";

interface TransbordoFilterParams extends PaginationParams {
  telefone?: string;
  session?: string;
  agente?: string;
  codigo?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface TransbordosContextType {
  // Estado
  pagination: PaginationParams;
  
  // Filtros
  telefoneFilter: string;
  sessionFilter: string;
  agenteFilter: string;
  codigoFilter: string;
  dateFromFilter: string;
  dateToFilter: string;
  isFiltering: boolean;
  
  // Dados
  transbordos: Transbordo[];
  totalTransbordos: number;
  isLoading: boolean;
  error: unknown;
  isError: boolean;
  
  // Ações
  setPagination: React.Dispatch<React.SetStateAction<PaginationParams>>;
  setTelefoneFilter: (value: string) => void;
  setSessionFilter: (value: string) => void;
  setAgenteFilter: (value: string) => void;
  setCodigoFilter: (value: string) => void;
  setDateFromFilter: (value: string) => void;
  setDateToFilter: (value: string) => void;
  handleSearch: () => void;
  handleClearFilters: () => void;
}

const TransbordosContext = createContext<TransbordosContextType | undefined>(undefined);

export function TransbordosProvider({ children }: { children: ReactNode }) {
  // Estado paginação
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: 10,
    offset: 0,
  });
  
  // Estado filtros
  const [telefoneFilter, setTelefoneFilter] = useState("");
  const [sessionFilter, setSessionFilter] = useState("");
  const [agenteFilter, setAgenteFilter] = useState("");
  const [codigoFilter, setCodigoFilter] = useState("todos");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterParams, setFilterParams] = useState<TransbordoFilterParams | null>(null);
  
  // Query para buscar transbordos com ou sem filtro
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['transbordos', isFiltering ? filterParams : pagination],
    queryFn: async () => {
      const params = isFiltering && filterParams ? filterParams : pagination;
      const response = await getTransbordos(params);
      return response.data;
    },
  });
  
  const transbordos = response?.data || [];
  const totalTransbordos = response?.pagination?.total || 0;
  
  // Resetar offset quando mudar o filtro
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
        agenteFilter.trim() || (codigoFilter && codigoFilter !== "todos") ||
        dateFromFilter.trim() || dateToFilter.trim()) {
      
      const params: TransbordoFilterParams = {
        limit: pagination.limit,
        offset: 0,
      };
      
      if (telefoneFilter.trim()) {
        params.telefone = telefoneFilter.trim();
      }
      
      if (sessionFilter.trim()) {
        params.session = sessionFilter.trim();
      }
      
      if (agenteFilter.trim()) {
        params.agente = agenteFilter.trim();
      }
      
      if (codigoFilter && codigoFilter !== "todos") {
        params.codigo = codigoFilter;
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
    setAgenteFilter("");
    setCodigoFilter("todos");
    setDateFromFilter("");
    setDateToFilter("");
    setIsFiltering(false);
    setFilterParams(null);
  };

  const contextValue: TransbordosContextType = {
    // Estado
    pagination,
    
    // Filtros
    telefoneFilter,
    sessionFilter,
    agenteFilter,
    codigoFilter,
    dateFromFilter,
    dateToFilter,
    isFiltering,
    
    // Dados
    transbordos,
    totalTransbordos,
    isLoading,
    error,
    isError: !!error,
    
    // Ações
    setPagination,
    setTelefoneFilter,
    setSessionFilter,
    setAgenteFilter,
    setCodigoFilter,
    setDateFromFilter,
    setDateToFilter,
    handleSearch,
    handleClearFilters,
  };

  return (
    <TransbordosContext.Provider value={contextValue}>
      {children}
    </TransbordosContext.Provider>
  );
}

export function useTransbordosContext() {
  const context = useContext(TransbordosContext);
  
  if (context === undefined) {
    throw new Error("useTransbordosContext must be used within a TransbordosProvider");
  }
  
  return context;
}
