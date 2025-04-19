import type { QueryClient } from "@tanstack/react-query";

/**
 * Obtém as chaves de consulta estruturadas para serem usadas com o React Query
 * @param resource Nome do recurso (ex: 'chats', 'messages', etc.)
 * @param params Parâmetros de consulta
 * @returns Chave de consulta formatada
 */
export function createQueryKey(resource: string, params?: Record<string, any>) {
  return params ? [resource, { params }] : [resource];
}

/**
 * Invalida todas as consultas relacionadas a um recurso
 * @param queryClient Cliente React Query
 * @param resource Nome do recurso para invalidar (ex: 'chats')
 */
export function invalidateResource(queryClient: QueryClient, resource: string) {
  queryClient.invalidateQueries({ queryKey: [resource] });
}

/**
 * Invalida consultas específicas de um recurso com base em um predicado
 * @param queryClient Cliente React Query
 * @param resource Nome do recurso (ex: 'chats')
 * @param predicate Função que determina quais consultas invalidar
 */
export function invalidateSpecificQueries(
  queryClient: QueryClient,
  resource: string,
  predicate: (queryKey: unknown[]) => boolean
) {
  queryClient.invalidateQueries({
    queryKey: [resource],
    predicate: (query) => predicate(query.queryKey),
  });
}

/**
 * Executa uma série de invalidações de cache após uma mutação
 * @param queryClient Cliente React Query
 * @param resources Lista de recursos para invalidar
 */
export function invalidateMultipleResources(
  queryClient: QueryClient,
  resources: string[]
) {
  resources.forEach(resource => {
    queryClient.invalidateQueries({ queryKey: [resource] });
  });
}
