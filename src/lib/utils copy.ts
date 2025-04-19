import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Salva dados no localStorage
 * @param key Chave para armazenamento
 * @param value Valor a ser armazenado
 */
export function saveToLocalStorage(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao salvar no localStorage [${key}]:`, error);
  }
}

/**
 * Recupera dados do localStorage
 * @param key Chave para busca
 * @param defaultValue Valor padrão caso não encontre
 * @returns Valor recuperado ou valor padrão
 */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Erro ao ler do localStorage [${key}]:`, error);
    return defaultValue;
  }
}

/**
 * Formata uma string de data no formato ISO para o formato brasileiro
 * @param isoString String de data no formato ISO
 * @returns Data formatada (DD/MM/YYYY)
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return isoString;
  }
}

/**
 * Formata uma string de data/hora ISO para exibir apenas a hora e minuto
 * @param isoString String de data/hora no formato ISO
 * @returns Hora formatada (HH:MM)
 */
export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    // Adiciona 3 horas à data
    date.setHours(date.getHours() + 3);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Erro ao formatar hora:', error);
    return isoString;
  }
}

/**
 * Formata uma string de data/hora ISO para o formato completo brasileiro
 * @param isoString String de data/hora no formato ISO
 * @returns Data e hora formatadas (DD/MM/YYYY HH:MM)
 */
export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Erro ao formatar data e hora:', error);
    return isoString;
  }
}

 
export const  phoneDDI = (value: string) => {
  return value
    .replace(/\D+/g, '')
    .replace(/(\d{2})(\d)/, '+$1 $2')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
    .replace(/(-\d{4})\d+?$/, '$1')
}
