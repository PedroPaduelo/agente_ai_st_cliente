import { Eye } from "lucide-react";
import { formatDateTime, phoneDDI } from "@/lib/utils";
import type { Transbordo } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TransbordoDetailDialogProps {
  transbordo: Transbordo;
}

export function TransbordoDetailDialog({ transbordo }: TransbordoDetailDialogProps) {
  // Formatar dados para exibição
  const getReturnStatus = (retorno_api: string | { status: string; descricao: string; protocolo: string; sessaoid: string; }) => {
    if (typeof retorno_api === 'string') {
      return retorno_api.toLowerCase().includes('success') ? 'Sucesso' : 'Falha';
    }
    
    if (typeof retorno_api === 'object' && retorno_api && 'status' in retorno_api) {
      return retorno_api.status === 'true' ? 'Sucesso' : 'Falha';
    }
    
    return 'Desconhecido';
  };
  
  // Formatação da descrição
  const getDescription = (retorno_api: string | { status: string; descricao: string; protocolo: string; sessaoid: string; }) => {
    if (typeof retorno_api === 'object' && retorno_api && 'descricao' in retorno_api) {
      return retorno_api.descricao;
    }
    
    return '';
  };
  
  // Formatação do protocolo
  const getProtocolo = (retorno_api: string | { status: string; descricao: string; protocolo: string; sessaoid: string; }) => {
    if (typeof retorno_api === 'object' && retorno_api && 'protocolo' in retorno_api) {
      return retorno_api.protocolo;
    }
    
    return '';
  };
  
  // Preparar o conteúdo de resposta da API para exibição
  const formatApiResponse = () => {
    if (!transbordo.retur_api) return 'Sem dados de resposta';
    
    if (typeof transbordo.retur_api === 'string') {
      try {
        // Tenta fazer parse do JSON caso seja uma string que contém JSON
        const jsonObj = JSON.parse(transbordo.retur_api);
        return JSON.stringify(jsonObj, null, 2);
      } catch {
        // Se não for JSON válido, retorna a string como está
        return transbordo.retur_api;
      }
    }
    
    return JSON.stringify(transbordo.retur_api, null, 2);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="px-2 h-7 text-xs hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          Detalhes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1100px] h-[600px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 border-b">
          <DialogTitle className="text-xl font-bold">Detalhes do Transbordo #{transbordo.id}</DialogTitle>
          <DialogDescription>
            Informações sobre a transferência para atendimento humano do número {phoneDDI(transbordo.telefone)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-4 overflow-y-auto h-[calc(100%-100px)]">
          <div className="space-y-6">
            {/* Status e Info Geral */}
            <div className="bg-muted/20 rounded-lg p-4 border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold">Status Geral</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  getReturnStatus(transbordo.retur_api) === 'Sucesso'
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {getReturnStatus(transbordo.retur_api)}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">ID da Sessão</p>
                  <p className="text-sm font-mono">{transbordo.session}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Código</p>
                  <p className="text-sm font-medium">{transbordo.codigo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Data de Criação</p>
                  <p className="text-sm">
                    {formatDateTime(transbordo.created_at || transbordo.creating_at)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Detalhes de Resposta */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Detalhes</h3>
              
              {getDescription(transbordo.retur_api) && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-muted-foreground">Descrição</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md border">
                    <p className="text-sm whitespace-pre-wrap">{getDescription(transbordo.retur_api)}</p>
                  </div>
                </div>
              )}
              
              {getProtocolo(transbordo.retur_api) && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-muted-foreground">Protocolo</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md border">
                    <p className="text-sm font-mono">{getProtocolo(transbordo.retur_api)}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Resposta da API - completa */}
            <div>
              <h3 className="text-sm font-semibold border-b pb-2 mb-2">Resposta da API</h3>
              <pre className="bg-muted/30 p-4 rounded-md border overflow-auto max-h-[230px] text-xs font-mono">
                {formatApiResponse()}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
