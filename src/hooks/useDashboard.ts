import { useQuery } from '@tanstack/react-query';
import { getDashboard, getPerformance, getMessageStats } from '@/lib/api';
import axios from 'axios';

interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// URL base para o novo endpoint
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3019';

// Função auxiliar para consultar os novos endpoints
const fetchDashboardData = async (endpoint: string, params?: DateRangeParams) => {
  const response = await axios.get(`${baseURL}${endpoint}`, { params });
  return response.data;
};

export const useDashboard = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: async () => {
      try {
        // Tenta usar o novo endpoint
        const response = await fetchDashboardData('/dashboard', params);
        return response.data;
      } catch (error) {
        // Fallback para o endpoint antigo
        console.warn('Fallback para API antiga', error);
        const { data } = await getDashboard();
        return data.data;
      }
    },
    meta: {
      description: 'Fetch overall dashboard data',
    },
  });
};

export const usePerformance = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ['performance', params],
    queryFn: async () => {
      try {
        // Tenta usar o novo endpoint
        const response = await fetchDashboardData('/dashboard/performance', params);
        return response.data;
      } catch (error) {
        // Fallback para o endpoint antigo
        console.warn('Fallback para API antiga', error);
        const { data } = await getPerformance();
        return data.data;
      }
    },
    meta: {
      description: 'Fetch performance metrics and distributions',
    },
  });
};

export const useConsultations = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ['consultations', params],
    queryFn: async () => {
      const response = await fetchDashboardData('/dashboard/consultations', params);
      return response.data;
    },
    meta: {
      description: 'Fetch consultation flow and related data',
    },
  });
};

// Mantido para compatibilidade
export const useMessageStats = () => {
  return useQuery({
    queryKey: ['messageStats'],
    queryFn: async () => {
      const { data } = await getMessageStats();
      return data.data;
    },
    meta: {
      description: 'Fetch message statistics (legacy)',
    },
  });
};
