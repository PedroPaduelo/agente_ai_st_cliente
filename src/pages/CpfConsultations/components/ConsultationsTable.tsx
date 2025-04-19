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

import { TableSkeleton } from "./TableSkeleton";


import { ConsultationDetailDialog } from "./ConsultationDetailDialog";
import { useCpfConsultationsContext } from "../context";

export function ConsultationsTable() {
  const {
    consultations,
    total,
    isLoading,
    isError,
    isFiltering,
    limit,
    offset,
    totalPages,
    currentPage,
    handleClearFilters,
    handlePreviousPage,
    handleNextPage
  } = useCpfConsultationsContext();

  return (
    <Card className="flex-1 flex flex-col">
      <div className="overflow-auto flex-1">
        {isLoading ? (
          <TableSkeleton columns={7} rows={10} />
        ) : isError ? (
          <div className="py-10 text-center text-destructive">
            Erro ao carregar consultas. Tente novamente mais tarde.
          </div>
        ) : (
          <Table className="min-w-full">

            <TableHeader className="bg-muted/50">
              <TableRow className="text-muted-foreground text-sm">
                <TableHead>ID</TableHead>
                <TableHead>Sessão</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Agente</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {consultations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    {isFiltering ? (
                      <div>
                        <p>Nenhuma consulta encontrada para os filtros aplicados.</p>
                        <Button 
                          variant="link" 
                          onClick={handleClearFilters}
                          className="mt-2"
                        >
                          Limpar filtros
                        </Button>
                      </div>
                    ) : (
                      "Nenhuma consulta encontrada"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                consultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>{consultation.id}</TableCell>
                    <TableCell>{consultation.session}</TableCell>
                    <TableCell>{phoneDDI(consultation.telefone)}</TableCell>
                    <TableCell>{consultation.agente}</TableCell>
                    <TableCell>{consultation.cpf}</TableCell>
                    <TableCell>
                      {formatDate(consultation.creating_at)} às {new Date(consultation.creating_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                    </TableCell>
                    <TableCell className="text-right">
                      <ConsultationDetailDialog consultation={consultation} />
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
            Mostrando {consultations.length > 0 ? offset + 1 : 0} a {Math.min(offset + limit, total)} de {total} consultas
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
              disabled={offset + limit >= total || isLoading}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
