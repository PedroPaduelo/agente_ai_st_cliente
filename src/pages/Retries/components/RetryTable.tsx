import { formatDate, phoneDDI } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PageSkeleton } from "@/components-custom/skeletons/TableSkeleton";
import { RetryDetailDialog } from "./RetryDetailDialog";
import { useRetryContext } from "../context";

export function RetryTable() {
  const { 
    retries, 
    totalRetries,
    pagination,
    isLoading,
    isError,
    isFiltering,
    handleClearFilters,
    setPagination
  } = useRetryContext();

  // Calcular valores de paginação
  const limit = pagination.limit || 10;
  const offset = pagination.offset || 0;
  const totalPages = Math.ceil(totalRetries / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  // Funções de navegação
  const handlePreviousPage = () => {
    setPagination(prev => ({ 
      ...prev, 
      offset: Math.max(0, prev.offset ? prev.offset - limit : 0) 
    }));
  };

  const handleNextPage = () => {
    setPagination(prev => ({ 
      ...prev, 
      offset: (prev.offset || 0) + limit 
    }));
  };

  // Função para formatar o status da retentativa
  const getReturnStatus = (retorno_api: string | { msg: string; id_facebook?: string }) => {
    if (typeof retorno_api === 'string') {
      return retorno_api.toLowerCase().includes('success') ? 'Sucesso' : 'Falha';
    }
    
    if (typeof retorno_api === 'object' && retorno_api && 'msg' in retorno_api) {
      return retorno_api.msg.includes('sucesso') ? 'Sucesso' : 'Falha';
    }
    
    return 'Desconhecido';
  };

  return (
    <Card className="flex-1 flex flex-col">
      <div className="overflow-auto flex-1">
        {isLoading ? (
          <PageSkeleton />
        ) : isError ? (
          <div className="py-10 text-center text-destructive">
            Erro ao carregar registros de retentativas. Tente novamente mais tarde.
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader className="bg-muted/50">
              <TableRow className="text-muted-foreground text-sm">
                <TableHead>ID</TableHead>
                <TableHead>Sessão</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Transbordo</TableHead>
                <TableHead>Tentativas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {retries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    {isFiltering ? (
                      <div>
                        <p>Nenhuma retentativa encontrada para os filtros aplicados.</p>
                        <Button 
                          variant="link" 
                          onClick={handleClearFilters}
                          className="mt-2"
                        >
                          Limpar filtros
                        </Button>
                      </div>
                    ) : (
                      "Nenhum registro de retentativa encontrado"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                retries.map((retry) => (
                  <TableRow key={retry.id}>
                    <TableCell>{retry.id}</TableCell>
                    <TableCell>{retry.session}</TableCell>
                    <TableCell>{phoneDDI(retry.telefone)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        retry.flague_transbordo === "1"
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {retry.flague_transbordo === "1" ? "Sim" : "Não"}
                      </span>
                    </TableCell>
                    <TableCell>{retry.tentativas_executadas}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getReturnStatus(retry.retur_api) === 'Sucesso'
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {getReturnStatus(retry.retur_api)}
                      </span>
                    </TableCell>
                    <TableCell>
                    {formatDate(retry.creating_at)} às {new Date(retry.creating_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                      
                    </TableCell>
                    <TableCell className="text-right">
                      <RetryDetailDialog retry={retry} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
      
      {/* Paginação fixa na parte inferior */}
      <div className="border-t p-4 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div className="text-sm">
            {isFiltering && (
              <div className="mb-1 text-xs text-muted-foreground">
                <span className="bg-primary/10 px-2 py-0.5 rounded text-primary">Filtro ativo</span>
              </div>
            )}
            Mostrando {retries.length > 0 ? offset + 1 : 0} a {Math.min(offset + limit, totalRetries)} de {totalRetries} retentativas
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={offset === 0 || isLoading}
            >
              Anterior
            </Button>
            <div className="flex items-center px-2 text-sm">
              Página {currentPage} de {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={offset + limit >= totalRetries || isLoading}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
