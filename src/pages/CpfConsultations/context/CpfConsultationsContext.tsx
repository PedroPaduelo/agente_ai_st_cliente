import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  type CpfConsultation, 
  getCpfConsultations, 
  lookupCpfConsultations, 
  type CpfLookupParams 
} from "@/lib/api";

interface CpfConsultationsContextType {
  // Estado
  limit: number;
  offset: number;

  telefoneFilter: string;
  cpfFilter: string;
  agenteFilter: string;
  sessionFilter: string;
  dateFromFilter: string;
  dateToFilter: string;

  isFiltering: boolean;
  
  // Dados
  consultations: CpfConsultation[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isError: boolean;
  
  // Ações
  setOffset: (offset: number) => void;

  setTelefoneFilter: (telefone: string) => void;
  setCpfFilter: (cpf: string) => void;

  setAgenteFilter: (agente: string) => void;
  setSessionFilter: (session: string) => void;

  setDateFromFilter: (dataFrom: string) => void;
  setDateToFilter: (dataTo: string) => void;


  handleSearch: () => void;
  handleClearFilters: () => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

const CpfConsultationsContext = createContext<CpfConsultationsContextType | undefined>(undefined);

export function CpfConsultationsProvider({ children }: { children: ReactNode }) {
  const [limit] = useState(8);
  const [offset, setOffset] = useState(0);

  const [telefoneFilter, setTelefoneFilter] = useState("");
  const [cpfFilter, setCpfFilter] = useState("");
  const [agenteFilter, setAgenteFilter] = useState("");
  const [sessionFilter, setSessionFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");



  const [isFiltering, setIsFiltering] = useState(false);
  const [filterParams, setFilterParams] = useState<CpfLookupParams | null>(null);

  // Query para busca normal paginada
  const normalQuery = useQuery({
    queryKey: ['cpfConsultations', { limit, offset }],
    queryFn: () => getCpfConsultations({ limit, offset }),
    enabled: !isFiltering,
  });

  // Query para busca filtrada
  const filterQuery = useQuery({
    queryKey: ['cpfLookup', filterParams],
    queryFn: () => lookupCpfConsultations(filterParams as CpfLookupParams),
    enabled: isFiltering && !!filterParams,
  });

  // Determina qual resultado usar com base no estado de filtragem
  const { data, isLoading, isError } = isFiltering ? filterQuery : normalQuery;

  const consultations = data?.data.data || [];
  const total = data?.data.pagination?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  // Resetar offset quando mudar o filtro
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isFiltering) {
      setOffset(0);
    }
  }, [isFiltering, filterParams]);

  const handleSearch = () => {

    if (telefoneFilter.trim() || cpfFilter.trim() || 
        agenteFilter.trim() || sessionFilter.trim() || 
        dateFromFilter.trim() || dateToFilter.trim()
    ) {
      const params: CpfLookupParams = {
        limit,
      };
      
      if (telefoneFilter.trim()) {
        params.telefone = telefoneFilter.trim();
      }
      
      if (cpfFilter.trim()) {
        params.cpf = cpfFilter.trim();
      }

      if (agenteFilter.trim()) {
        params.agente = agenteFilter.trim();
      }

      if (sessionFilter.trim()) {
        params.session = sessionFilter.trim();
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

  const handleClearFilters = () => {

    setTelefoneFilter("");
    setCpfFilter("");
    setAgenteFilter("");
    setSessionFilter("");
    setDateFromFilter("");
    setDateToFilter("");

    setIsFiltering(false);
    setFilterParams(null);
  };

  const handlePreviousPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  const handleNextPage = () => {
    if (offset + limit < total) {
      setOffset(offset + limit);
    }
  };

  const value = {
    // Estado
    limit,
    offset,

    telefoneFilter,
    cpfFilter,
    agenteFilter,
    sessionFilter,
    dateFromFilter,
    dateToFilter,

    isFiltering,
    
    // Dados
    consultations,
    total,
    totalPages,
    currentPage,
    isLoading,
    isError,
    
    // Ações
    setOffset,

    setTelefoneFilter,
    setCpfFilter,
    setAgenteFilter,
    setSessionFilter,
    setDateFromFilter,
    setDateToFilter,

    handleSearch,
    handleClearFilters,
    handlePreviousPage,
    handleNextPage,
  };

  return (
    <CpfConsultationsContext.Provider value={value}>
      {children}
    </CpfConsultationsContext.Provider>
  );
}

export function useCpfConsultationsContext() {
  const context = useContext(CpfConsultationsContext);
  if (context === undefined) {
    throw new Error("useCpfConsultationsContext must be used within a CpfConsultationsProvider");
  }
  return context;
}
