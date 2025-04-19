import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components-custom/ui/card";
import {
  TypographyH1,
  TypographyMuted,
  TypographyValue,
  TypographyTableHeader,
  TypographyTableCell
} from "@/components-custom/typography";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { getPerformance, type PerformanceResponse } from "@/lib/api";

// Format statistical values
function statsFormat(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
}

// Interface for transformed performance data
interface FormattedPerformanceData {
  messagesByHour: {
    hour: string;
    count: number;
    formattedHour: string;
  }[];
  responseTime: number;
  chatLengthDistribution: {
    category: string;
    count: number;
    percentage: number;
  }[];
}

// Demo data for fallback
const demoData: FormattedPerformanceData = {
  messagesByHour: [
    { hour: "0", count: 18, formattedHour: "00h" },
    { hour: "2", count: 2, formattedHour: "02h" },
    { hour: "3", count: 4, formattedHour: "03h" },
    { hour: "4", count: 8, formattedHour: "04h" },
    { hour: "5", count: 12, formattedHour: "05h" },
    { hour: "6", count: 59, formattedHour: "06h" },
    { hour: "7", count: 124, formattedHour: "07h" },
    { hour: "8", count: 606, formattedHour: "08h" },
    { hour: "9", count: 1361, formattedHour: "09h" },
    { hour: "10", count: 2579, formattedHour: "10h" },
    { hour: "11", count: 5077, formattedHour: "11h" },
    { hour: "12", count: 5173, formattedHour: "12h" },
    { hour: "13", count: 4170, formattedHour: "13h" },
    { hour: "14", count: 2755, formattedHour: "14h" },
    { hour: "15", count: 1816, formattedHour: "15h" },
    { hour: "16", count: 962, formattedHour: "16h" },
    { hour: "17", count: 593, formattedHour: "17h" },
    { hour: "18", count: 383, formattedHour: "18h" },
    { hour: "19", count: 217, formattedHour: "19h" },
    { hour: "20", count: 163, formattedHour: "20h" },
    { hour: "21", count: 135, formattedHour: "21h" },
    { hour: "22", count: 64, formattedHour: "22h" },
    { hour: "23", count: 18, formattedHour: "23h" }
  ],
  responseTime: 57.29,
  chatLengthDistribution: [
    { category: "1-2 mensagens", count: 1373, percentage: 28.1 },
    { category: "3-5 mensagens", count: 1038, percentage: 21.2 },
    { category: "6-10 mensagens", count: 2232, percentage: 45.6 },
    { category: "11-20 mensagens", count: 253, percentage: 5.2 },
    { category: "21+ mensagens", count: 8, percentage: 0.2 }
  ]
};

// Function to transform API data
function transformData(response?: PerformanceResponse): FormattedPerformanceData {
  const result: FormattedPerformanceData = {
    messagesByHour: [],
    responseTime: 0,
    chatLengthDistribution: []
  };

  if (response?.data) {
    // Parse messages by hour
    if (response.data.messagesByHour?.length > 0) {
      result.messagesByHour = response.data.messagesByHour.map(item => {
        return {
          hour: item.hour,
          count: typeof item.count === 'string' ? parseInt(item.count, 10) : Number(item.count) || 0,
          formattedHour: `${item.hour.padStart(2, '0')}h`
        };
      });
    }

    // Parse response time
    if (response.data.responseTime) {
      result.responseTime = typeof response.data.responseTime === 'string' 
        ? parseFloat(response.data.responseTime) 
        : Number(response.data.responseTime) || 0;
    }

    // Parse chat length distribution
    if (response.data.chatLengthDistribution?.length > 0) {
      // Calculate total chats
      const totalChats = response.data.chatLengthDistribution.reduce((sum, item) => {
        const count = typeof item.chat_count === 'string' 
          ? parseInt(item.chat_count, 10) 
          : Number(item.chat_count) || 0;
        return sum + count;
      }, 0);

      // Format chat length distribution data
      result.chatLengthDistribution = response.data.chatLengthDistribution.map(item => {
        const count = typeof item.chat_count === 'string' 
          ? parseInt(item.chat_count, 10) 
          : Number(item.chat_count) || 0;
        
        return {
          category: `${item.length_category} mensagens`,
          count,
          percentage: totalChats > 0 ? (count / totalChats) * 100 : 0
        };
      });
    }
  }

  return result;
}

export function Performance() {
  const [data, setData] = useState<FormattedPerformanceData>(demoData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getPerformance();
        
        if (response.data && response.data.success) {
          const formattedData = transformData(response.data);
          setData(formattedData);
        } else {
          console.error('API response failed or returned success: false');
          setError('Falha ao carregar dados de performance');
          
          // Fallback to demo data in development
          if (import.meta.env.DEV) {
            setData(demoData);
          }
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setError('Erro ao carregar dados de performance');
        
        // Fallback to demo data in development
        if (import.meta.env.DEV) {
          setData(demoData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full font-medium">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-destructive mb-4 font-medium">{error}</div>
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
      <div>
        <TypographyH1>Performance</TypographyH1>
        <TypographyMuted>
          Análise de performance e métricas de atendimento.
        </TypographyMuted>
      </div>
      
      {/* Response Time Card */}
      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tempo Médio de Resposta</CardTitle>
            <CardDescription>Tempo médio de resposta do agente</CardDescription>
          </CardHeader>
          <CardContent>
            <TypographyValue>{data.responseTime.toFixed(2)} segundos</TypographyValue>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Messages by Hour Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Mensagens por Hora</CardTitle>
            <CardDescription>Volume de mensagens distribuído por hora do dia</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.messagesByHour}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedHour" />
                <YAxis />
                <Tooltip formatter={(value) => [statsFormat(Number(value)), "Mensagens"]} />
                <Bar dataKey="count" fill="#8884d8" name="Mensagens" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Chat Length Distribution Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Distribuição do Tamanho das Conversas</CardTitle>
            <CardDescription>Quantidade de mensagens por conversa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.chatLengthDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="category"
                      label={({ percentage }) => `${percentage.toFixed(1)}%`}
                    >
                      {data.chatLengthDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [statsFormat(Number(value)), "Conversas"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <TypographyTableHeader>Tamanho</TypographyTableHeader>
                        <TypographyTableHeader>Conversas</TypographyTableHeader>
                        <TypographyTableHeader>%</TypographyTableHeader>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.chatLengthDistribution.map((item, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <TypographyTableCell>{item.category}</TypographyTableCell>
                          <TypographyTableCell>{statsFormat(item.count)}</TypographyTableCell>
                          <TypographyTableCell>{item.percentage.toFixed(1)}%</TypographyTableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4">
                  <TypographyMuted>
                    A maioria das conversas ({data.chatLengthDistribution.find(i => i.percentage === Math.max(...data.chatLengthDistribution.map(i => i.percentage)))?.percentage.toFixed(1)}%) tem entre {data.chatLengthDistribution.find(i => i.percentage === Math.max(...data.chatLengthDistribution.map(i => i.percentage)))?.category.split(' ')[0]}.
                  </TypographyMuted>
                  <TypographyMuted className="mt-2">
                    Conversas mais longas (acima de 10 mensagens) representam {data.chatLengthDistribution.filter(i => i.category.includes('11-20') || i.category.includes('21+')).reduce((sum, i) => sum + i.percentage, 0).toFixed(1)}% do total.
                  </TypographyMuted>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Time Analysis */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Análise de Horários</CardTitle>
            <CardDescription>Períodos de maior e menor volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-md border p-4">
                <TypographyMuted>Horário de Pico</TypographyMuted>
                <TypographyValue className="mt-1">
                  {data.messagesByHour.reduce((max, current) => (current.count > max.count ? current : max), data.messagesByHour[0]).formattedHour} ({statsFormat(data.messagesByHour.reduce((max, current) => (current.count > max.count ? current : max), data.messagesByHour[0]).count)} mensagens)
                </TypographyValue>
              </div>
              <div className="rounded-md border p-4">
                <TypographyMuted>Horário de Menor Volume</TypographyMuted>
                <TypographyValue className="mt-1">
                  {data.messagesByHour.reduce((min, current) => (current.count < min.count ? current : min), data.messagesByHour[0]).formattedHour} ({data.messagesByHour.reduce((min, current) => (current.count < min.count ? current : min), data.messagesByHour[0]).count} mensagens)
                </TypographyValue>
              </div>
              <div className="rounded-md border p-4">
                <TypographyMuted>Média por Hora (Horário Comercial)</TypographyMuted>
                <TypographyValue className="mt-1">
                  {statsFormat(data.messagesByHour.filter(h => parseInt(h.hour) >= 8 && parseInt(h.hour) <= 18).reduce((sum, h) => sum + h.count, 0) / 11)}
                </TypographyValue>
              </div>
            </div>
            
            <TypographyMuted className="mt-4">
              Os dados mostram um pico de atividade por volta das {data.messagesByHour.reduce((max, current) => (current.count > max.count ? current : max), data.messagesByHour[0]).formattedHour}, com um declínio significativo após as 18h. O horário comercial (8h-18h) concentra {(data.messagesByHour.filter(h => parseInt(h.hour) >= 8 && parseInt(h.hour) <= 18).reduce((sum, h) => sum + h.count, 0) / data.messagesByHour.reduce((sum, h) => sum + h.count, 0) * 100).toFixed(1)}% do volume total de mensagens.
            </TypographyMuted>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
