/* eslint-disable @typescript-eslint/no-unused-vars */
import { Eye } from "lucide-react";
import { formatDateTime, phoneDDI } from "@/lib/utils";
import type { Retry } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RetryDetailDialogProps {
  retry: Retry;
}

export function RetryDetailDialog({ retry }: RetryDetailDialogProps) {
  // Formatar dados para exibição
  const getReturnStatus = (retorno_api: string | { msg: string; id_facebook?: string }) => {
    if (typeof retorno_api === 'string') {
      return retorno_api.toLowerCase().includes('success') ? 'Sucesso' : 'Falha';
    }
    
    if (typeof retorno_api === 'object' && retorno_api && 'msg' in retorno_api) {
      return retorno_api.msg.includes('sucesso') ? 'Sucesso' : 'Falha';
    }
    
    return 'Desconhecido';
  };
  
  // Preparar o conteúdo de resposta da API para exibição
  const formatApiResponse = () => {
    console.log("Formatando resposta API:", retry.retur_api);
    
    if (!retry.retur_api) return 'Sem dados de resposta';
    
    if (typeof retry.retur_api === 'string') {
      try {
        // Tenta fazer parse do JSON caso seja uma string que contém JSON
        const jsonObj = JSON.parse(retry.retur_api);
        return JSON.stringify(jsonObj, null, 2);
      } catch (e) {
        // Se não for JSON válido, retorna a string como está
        return retry.retur_api;
      }
    }
    
    return JSON.stringify(retry.retur_api, null, 2);
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
      <DialogContent className="sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1100px] h-[700px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 border-b">
          <DialogTitle className="text-xl font-bold">Detalhes da Retentativa #{retry.id}</DialogTitle>
          <DialogDescription>
            Informações sobre a tentativa de reenvio de mensagem para {phoneDDI(retry.telefone)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-4 overflow-y-auto h-[calc(100%-100px)]">
          <div className="space-y-6">
            {/* Status e Info Geral - com visual melhorado */}
            <div className="bg-muted/20 rounded-lg p-4 border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold">Status Geral</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  getReturnStatus(retry.retur_api) === 'Sucesso'
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {getReturnStatus(retry.retur_api)}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">ID da Sessão</p>
                  <p className="text-sm font-mono">{retry.session}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Data de Criação</p>
                  <p className="text-sm">
                    {retry.creating_at 
                      ? formatDateTime(retry.creating_at)
                      : 'Data não disponível'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Flag de Transbordo</p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${retry.flague_transbordo === 'true' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <p className="text-sm">{retry.flague_transbordo === 'true' ? 'Sim' : 'Não'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tentativas Executadas</p>
                  <p className="text-sm font-medium">{retry.tentativas_executadas || '0'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Erro</p>
                  <p className="text-sm">{retry.error === 'false' ? 'Não' : retry.error === 'true' ? 'Sim' : retry.error}</p>
                </div>
              </div>
            </div>
            
            {/* Mensagens - com visual melhorado */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Mensagens</h3>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-muted-foreground">Última Mensagem</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-md border">
                  <p className="text-sm whitespace-pre-wrap">{retry.ultima_mensagem || 'Não disponível'}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-muted-foreground">Nova Mensagem</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-md border">
                  <p className="text-sm whitespace-pre-wrap">{retry.new_message || 'Não disponível'}</p>
                </div>
              </div>
            </div>
            
            {/* Resposta da API - com visual melhorado */}
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
