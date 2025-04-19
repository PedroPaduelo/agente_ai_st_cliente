import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components-custom/ui/card";
import { Button } from "@/components-custom/ui/button";
import {
  TypographyH1,
  TypographyMuted,
  TypographyValue,
  TypographyTableHeader,
  TypographyTableCell
} from "@/components-custom/typography";
import { useState } from "react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import type { 
  DashboardResponse, 
  PerformanceResponse,
  ConsultationsResponse,
  ChartItem,
  EventTypeItem,
  BankDistributionItem
} from "@/lib/api";
import { useDashboard, usePerformance, useConsultations } from "@/hooks/useDashboard";

// Format statistical values (adds k suffix for thousands)
function statsFormat(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
}

// Type for transformed dashboard data (matches component expectations)
interface FormattedDashboardData {
  // KPIs
  totalMessages: number;
  totalChats: number;
  totalTransbordos: number;
  totalRetries: number;
  transbordoRate: number;
  successRate: number;
  avgMessagesPerChat: number;
  
  // Charts
  messagesByDay: {
    date: string;
    count: number;
  }[];
  messagesBySender: {
    sender: string;
    count: number;
    percentage: number;
  }[];
  activePhones: {
    telefone: string;
    count: number;
  }[];
  messageAnalytics: {
    avgLength: number;
    minLength: number;
    maxLength: number;
  };
}

// Transform data from API responses - updated for new API structure
function transformData(
  dashboardData?: any,
  performanceData?: any,
  consultationsData?: any
): FormattedDashboardData {
  // Set default values
  const result: FormattedDashboardData = {
    totalMessages: 0,
    totalChats: 0,
    totalTransbordos: 0,
    totalRetries: 0,
    transbordoRate: 0,
    successRate: 0,
    avgMessagesPerChat: 0,
    messagesByDay: [],
    messagesBySender: [],
    activePhones: [],
    messageAnalytics: {
      avgLength: 0,
      minLength: 0,
      maxLength: 0
    }
  };
  
  // Process dashboard data if available
  if (dashboardData?.totals) {
    const { totals, charts } = dashboardData;
    
    // KPIs from main dashboard endpoint
    result.totalMessages = totals.messages || 0;
    result.totalChats = totals.chats || 0;
    result.totalTransbordos = totals.transbordos || 0;
    result.totalRetries = 0; // Não há equivalente na nova API, zero por padrão
    
    // Gráficos de mensagens por dia
    if (charts?.messagesByDay?.length > 0) {
      result.messagesByDay = charts.messagesByDay.map((item: ChartItem) => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        return {
          date: formattedDate,
          count: typeof item.count === 'string' ? parseInt(item.count, 10) : Number(item.count) || 0
        };
      });
    }
    
    // Dados de distribuição por tipo de evento
    if (charts?.eventsByType?.length > 0) {
      // Transformar para o formato messagesBySender
      result.messagesBySender = charts.eventsByType.map((item: EventTypeItem) => {
        const count = typeof item.count === 'string' ? parseInt(item.count, 10) : Number(item.count) || 0;
        const totalEvents = charts.eventsByType.reduce((sum: number, ev: EventTypeItem) => {
          return sum + (typeof ev.count === 'string' ? parseInt(ev.count, 10) : Number(ev.count) || 0);
        }, 0);
        
        const percentage = totalEvents > 0 ? (count / totalEvents) * 100 : 0;
        
        // Map para nomes mais amigáveis
        let sender;
        if (item.type_event === 'message') {
          sender = 'Mensagens';
        } else if (item.type_event === 'transbordo') {
          sender = 'Transbordos';
        } else if (item.type_event === 'consulta cpf') {
          sender = 'Consultas CPF';
        } else {
          sender = item.type_event;
        }
        
        return {
          sender,
          count,
          percentage
        };
      });
    }
    
    // Dados de distribuição por banco como telefones mais ativos
    if (charts?.bankDistribution?.length > 0) {
      result.activePhones = charts.bankDistribution.map((item: BankDistributionItem) => {
        return {
          telefone: item.bank, // Usando o banco como "telefone"
          count: typeof item.count === 'string' ? parseInt(item.count, 10) : Number(item.count) || 0
        };
      });
    }
  }
  
  // Processar dados de performance se disponíveis
  if (performanceData?.metrics) {
    const { metrics } = performanceData;
    
    // Métricas de performance
    result.transbordoRate = metrics.transbordoRate || 0;
    result.avgMessagesPerChat = metrics.avgMessagesPerChat || 0;
    result.successRate = 100 - result.transbordoRate; // Taxa de sucesso é o inverso da taxa de transbordo
    
    // Dados adicionais para métricas se disponíveis
    if (performanceData.distributions?.balanceDistribution) {
      // Podemos usar esses dados para análises adicionais
    }
  }
  
  // Processar dados de consultas se disponíveis
  if (consultationsData) {
    // Podemos adicionar métricas de consultas de CPF se necessário
    // ...
  }
  
  return result;
}

// Helper to format phone numbers
function formatPhoneNumber(phone: string): string {
  // Extract country code and DDD code
  const match = phone.match(/^(\d{2})(\d{2})(\d+)$/);
  
  if (match) {
    const [, , ddd, number] = match;
    if (ddd === '11') return `SP (${ddd}) ${number.substring(0, 5)}-xxxx`;
    if (ddd === '21') return `RJ (${ddd}) ${number.substring(0, 5)}-xxxx`;
    if (ddd === '31') return `MG (${ddd}) ${number.substring(0, 5)}-xxxx`;
    return `(${ddd}) ${number.substring(0, 5)}-xxxx`;
  }
  
  return phone;
}

// Demo data for fallback
const demoData: FormattedDashboardData = {
  totalMessages: 26142,
  totalChats: 4876,
  totalTransbordos: 9011,
  totalRetries: 9504,
  transbordoRate: 0,
  successRate: 100 - 36.36,
  avgMessagesPerChat: 5.4,
  messagesByDay: [
    { date: '10/03', count: 3629 },
    { date: '11/03', count: 10132 },
    { date: '12/03', count: 12381 }
  ],
  messagesBySender: [
    { sender: 'Cliente', count: 13516, percentage: 51.8 },
    { sender: 'Agente IA', count: 12574, percentage: 48.1 },
    { sender: 'Bot', count: 16, percentage: 0.1 }
  ],
  activePhones: [
    { telefone: 'MG (34) 98064-xxxx', count: 72 },
    { telefone: 'SP (11) 95459-xxxx', count: 30 },
    { telefone: 'SP (11) 99379-xxxx', count: 29 },
    { telefone: 'RS (51) 81925-xxxx', count: 28 },
    { telefone: 'SP (13) 99104-xxxx', count: 28 }
  ],
  messageAnalytics: {
    avgLength: 103,
    minLength: 1,
    maxLength: 973
  }
};

function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onFilter,
  onClear,
  activeFilter
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onFilter: () => void;
  onClear: () => void;
  activeFilter: {startDate?: string; endDate?: string};
}) {
  // Predefined date ranges
  const presetRanges = [
    { label: 'Hoje', days: 0 },
    { label: 'Últimos 7 dias', days: 7 },
    { label: 'Últimos 30 dias', days: 30 },
    { label: 'Este mês', days: 'month' }
  ];
  
  const handlePresetClick = (preset: typeof presetRanges[0]) => {
    const today = new Date();
    let startDateObj = new Date();
    
    if (preset.days === 'month') {
      // Primeiro dia do mês atual
      startDateObj = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (preset.days > 0) {
      // Subtrair dias
      startDateObj.setDate(today.getDate() - preset.days);
    }
    
    const formattedStartDate = startDateObj.toISOString().split('T')[0];
    const formattedEndDate = today.toISOString().split('T')[0];
    
    onStartDateChange(formattedStartDate);
    onEndDateChange(formattedEndDate);
  };
  
  const hasActiveFilter = !!(activeFilter.startDate || activeFilter.endDate);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {presetRanges.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset)}
            className="px-3 py-2 text-xs font-medium bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="space-y-1.5 flex-1">
          <label className="text-sm font-medium text-muted-foreground">Data inicial</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary/30 focus:border-primary/60 transition-all"
          />
        </div>
        
        <div className="space-y-1.5 flex-1">
          <label className="text-sm font-medium text-muted-foreground">Data final</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary/30 focus:border-primary/60 transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onFilter}
            variant="default"
            className="whitespace-nowrap px-4"
          >
            Aplicar
          </Button>
          
          {hasActiveFilter && (
            <Button 
              onClick={onClear}
              variant="outline"
              className="whitespace-nowrap"
            >
              Limpar
            </Button>
          )}
        </div>
      </div>
      
      {hasActiveFilter && (
        <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary-foreground text-xs font-medium rounded-full">
          <span className="mr-1">Filtro ativo:</span>
          <span className="font-semibold">{activeFilter.startDate || 'Início'}</span>
          <span className="mx-1">até</span>
          <span className="font-semibold">{activeFilter.endDate || 'Hoje'}</span>
        </div>
      )}
    </div>
  );
}

export function Dashboard() {
  // Estado para filtros de data
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [appliedFilter, setAppliedFilter] = useState<{startDate?: string; endDate?: string}>({});
  
  // Aplicar filtro
  const handleApplyFilter = () => {
    setAppliedFilter({
      startDate: startDate || undefined,
      endDate: endDate || undefined
    });
  };
  
  // Use React Query hooks com os novos endpoints e filtros
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useDashboard(appliedFilter);
  const { data: performanceData, isLoading: isPerformanceLoading, error: performanceError } = usePerformance(appliedFilter);
  const { data: consultationsData, isLoading: isConsultationsLoading, error: consultationsError } = useConsultations(appliedFilter);

  // Transform data usando todos os dados
  const data = transformData(
    dashboardData,
    performanceData,
    consultationsData
  );

  // Use demo data as fallback in development when we have errors
  const isLoading = isDashboardLoading || isPerformanceLoading || isConsultationsLoading;
  const error = dashboardError || performanceError || consultationsError;
  const shouldUseDemoData = import.meta.env.DEV && (error || (!dashboardData && !performanceData));
  
  const displayData = shouldUseDemoData ? demoData : data;

  if (isLoading) {
    return <div className="flex items-center justify-center h-full font-medium">Carregando...</div>;
  }

  if (error && !shouldUseDemoData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-destructive mb-4 font-medium">
          Erro ao carregar dados do dashboard
          {dashboardError instanceof Error && (
            <div className="text-sm mt-2">{dashboardError.message}</div>
          )}
          {performanceError instanceof Error && (
            <div className="text-sm mt-2">{performanceError.message}</div>
          )}
          {consultationsError instanceof Error && (
            <div className="text-sm mt-2">{consultationsError.message}</div>
          )}
        </div>
        {import.meta.env.DEV && (
          <TypographyMuted>Usando dados de demonstração no ambiente de desenvolvimento</TypographyMuted>
        )}
      </div>
    );
  }

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-violet-500 shadow-lg rounded-xl p-6 text-white mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-3">
            <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
          </svg>
          Central de Análise
        </h1>
        <p className="mt-2 text-white/80 max-w-2xl">
          Visualização em tempo real do desempenho do sistema de atendimento, 
          com métricas e tendências de conversas, consultas e interações.
        </p>
      </div>
      
      <div className="flex items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-lg font-semibold text-primary">Resumo de Indicadores</h2>
          <p className="text-sm text-muted-foreground">Principais métricas operacionais</p>
        </div>
        
        <div className="w-full max-w-lg">
          <DateRangeFilter 
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onFilter={handleApplyFilter}
            onClear={() => {
              setStartDate("");
              setEndDate("");
              setAppliedFilter({});
            }}
            activeFilter={appliedFilter}
          />
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
              <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
              <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
            </svg>
          </div>
          <CardContent className="p-4 h-full">
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium text-blue-700 dark:text-blue-300">Mensagens</h3>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Total processado</p>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-blue-700 dark:text-blue-200">
                  {statsFormat(displayData.totalMessages)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800 shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500">
              <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" />
              <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
            </svg>
          </div>
          <CardContent className="p-4 h-full">
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium text-emerald-700 dark:text-emerald-300">Conversas</h3>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Total iniciadas</p>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-200">
                  {statsFormat(displayData.totalChats)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800 shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z" clipRule="evenodd" />
            </svg>
          </div>
          <CardContent className="p-4 h-full">
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium text-amber-700 dark:text-amber-300">Transbordos</h3>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Total realizados</p>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-amber-700 dark:text-amber-200">
                  {statsFormat(displayData.totalTransbordos)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800 shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-500">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
          <CardContent className="p-4 h-full">
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium text-indigo-700 dark:text-indigo-300">Retentativas</h3>
                <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">Total de envios</p>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-indigo-700 dark:text-indigo-200">
                  {statsFormat(displayData.totalRetries)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
              <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
            </svg>
          </div>
          <CardContent className="p-4 h-full">
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium text-green-700 dark:text-green-300">Taxa de Sucesso</h3>
                <p className="text-xs text-green-600/70 dark:text-green-400/70">% tratamentos bem sucedidos</p>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-green-700 dark:text-green-200">
                  {displayData.successRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-purple-500">
              <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
            </svg>
          </div>
          <CardContent className="p-4 h-full">
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium text-purple-700 dark:text-purple-300">Média de Mensagens</h3>
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70">Por conversa</p>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-purple-700 dark:text-purple-200">
                  {displayData.avgMessagesPerChat.toFixed(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Analytics Section Title */}
      <div className="mt-10 mb-6">
        <h2 className="text-lg font-semibold text-primary">Análise de Tendências</h2>
        <p className="text-sm text-muted-foreground">Visualização de padrões e distribuições</p>
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Activity Chart */}
        <Card className="col-span-1 overflow-hidden border-none shadow-xl bg-white dark:bg-slate-900">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-violet-500 text-white pb-2">
            <CardTitle className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
              </svg>
              Tendência de Mensagens
            </CardTitle>
            <CardDescription className="text-white/80">Volume diário de mensagens processadas</CardDescription>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayData.messagesByDay}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  formatter={(value) => [statsFormat(Number(value)), "Mensagens"]} 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Bar 
                  dataKey="count" 
                  name="Mensagens" 
                  radius={[4, 4, 0, 0]}
                  fill="url(#colorCount)" 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Sender Distribution Chart */}
        <Card className="col-span-1 overflow-hidden border-none shadow-xl bg-white dark:bg-slate-900">
          <CardHeader className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white pb-2">
            <CardTitle className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
              </svg>
              Distribuição de Eventos
            </CardTitle>
            <CardDescription className="text-white/80">Composição por tipo de evento no sistema</CardDescription>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData.messagesBySender}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="sender"
                  paddingAngle={2}
                  label={({ sender, percentage }) => `${percentage.toFixed(1)}%`}
                >
                  {displayData.messagesBySender.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [statsFormat(Number(value)), "Eventos"]} 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Top Active Phones/Banks */}
        <Card className="col-span-1 overflow-hidden border border-indigo-100 dark:border-indigo-900 shadow-lg bg-gradient-to-br from-white to-indigo-50 dark:from-slate-900 dark:to-indigo-950">
          <CardHeader className="border-b border-indigo-100 dark:border-indigo-900/30">
            <CardTitle className="flex items-center text-indigo-700 dark:text-indigo-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-indigo-500">
                <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clipRule="evenodd" />
                <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
              </svg>
              Bancos Mais Ativos
            </CardTitle>
            <CardDescription className="text-indigo-600/70 dark:text-indigo-400/70">Distribuição de consultas por banco</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {displayData.activePhones.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm font-medium">{item.telefone}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-bold">{item.count}</span>
                    <div className="ml-4 w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${(item.count / displayData.activePhones[0].count) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Message Analytics */}
        <Card className="col-span-1 overflow-hidden border border-emerald-100 dark:border-emerald-900 shadow-lg bg-gradient-to-br from-white to-emerald-50 dark:from-slate-900 dark:to-emerald-950">
          <CardHeader className="border-b border-emerald-100 dark:border-emerald-900/30">
            <CardTitle className="flex items-center text-emerald-700 dark:text-emerald-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-emerald-500">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
              </svg>
              Análise de Mensagens
            </CardTitle>
            <CardDescription className="text-emerald-600/70 dark:text-emerald-400/70">Estatísticas de tamanho e distribuição</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-md border border-emerald-50 dark:border-emerald-900/30">
                  <div className="mb-2">
                    <span className="inline-block p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    </span>
                  </div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Média</div>
                  <div className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mt-1">{displayData.messageAnalytics.avgLength}</div>
                  <div className="text-xs text-emerald-600/70 dark:text-emerald-400/50 mt-1">caracteres</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-md border border-emerald-50 dark:border-emerald-900/30">
                  <div className="mb-2">
                    <span className="inline-block p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                      </svg>
                    </span>
                  </div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Mínimo</div>
                  <div className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mt-1">{displayData.messageAnalytics.minLength}</div>
                  <div className="text-xs text-emerald-600/70 dark:text-emerald-400/50 mt-1">caracteres</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-md border border-emerald-50 dark:border-emerald-900/30">
                  <div className="mb-2">
                    <span className="inline-block p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                      </svg>
                    </span>
                  </div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Máximo</div>
                  <div className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mt-1">{displayData.messageAnalytics.maxLength}</div>
                  <div className="text-xs text-emerald-600/70 dark:text-emerald-400/50 mt-1">caracteres</div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-inner border border-emerald-50 dark:border-emerald-900/30">
                <div className="text-sm text-emerald-800/90 dark:text-emerald-200/90 leading-relaxed">
                  <p>Tamanho médio de mensagens de <span className="font-semibold">{displayData.messageAnalytics.avgLength}</span> caracteres, com variação entre <span className="font-semibold">{displayData.messageAnalytics.minLength}</span> e <span className="font-semibold">{displayData.messageAnalytics.maxLength}</span> caracteres. Mensagens mais curtas tendem a ser respostas simples, enquanto as mais longas são explicativas.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Sender Details - Summary Table */}
        <Card className="col-span-2 overflow-hidden border-none shadow-xl bg-white dark:bg-slate-900">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white pb-2">
            <CardTitle className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
              </svg>
              Resumo por Categoria
            </CardTitle>
            <CardDescription className="text-white/80">Distribuição detalhada por tipo de interação</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">Quantidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">Percentual</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">Distribuição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100 dark:divide-purple-900/20">
                  {displayData.messagesBySender.map((item, index) => (
                    <tr key={index} className="hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <div className="text-sm font-medium">{item.sender}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold">{statsFormat(item.count)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{item.percentage.toFixed(1)}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
