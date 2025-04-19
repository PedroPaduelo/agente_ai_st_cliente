import type { Retry } from "@/lib/api";
import { RetryDetailDialog } from "./RetryDetailDialog";

interface RetryItemProps {
  retry: Retry;
}

export function RetryItem({ retry }: RetryItemProps) {
  // Get message status from retorno_api
  const getReturnStatus = (retorno_api: string | { msg: string; id_facebook?: string }) => {
    if (typeof retorno_api === 'string') {
      return retorno_api.toLowerCase().includes('success') ? 'Sucesso' : 'Falha';
    }
    
    if (typeof retorno_api === 'object' && retorno_api && 'msg' in retorno_api) {
      return retorno_api.msg.includes('sucesso') ? 'Sucesso' : 'Falha';
    }
    
    return 'Desconhecido';
  };
  
  // Get message from retorno_api
  const getReturnMessage = (retorno_api: string | { msg: string; id_facebook?: string }) => {
    if (typeof retorno_api === 'string') {
      return retorno_api;
    }
    
    if (typeof retorno_api === 'object' && retorno_api && 'msg' in retorno_api) {
      return retorno_api.msg;
    }
    
    return 'Mensagem não disponível';
  };

  return (
    <tr key={retry.id} className="hover:bg-muted/50">
      <td className="px-4 py-3 text-sm">{retry.id}</td>
      <td className="px-4 py-3 text-sm">{retry.session}</td>
      <td className="px-4 py-3 text-sm">{retry.telefone}</td>
      <td className="px-4 py-3 text-sm">{retry.flague_transbordo}</td>
      <td className="px-4 py-3 text-sm">{retry.tentativas_executadas}</td>

      <td className="px-4 py-3 text-sm">
        <div className="max-w-xs truncate" title={retry.error}>
          {retry.error === 'false' ? 'Não' : retry.error === 'true' ? 'Sim' : retry.error}
        </div>
      </td>

      <td className="px-4 py-3 text-sm">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          getReturnStatus(retry.retur_api) === 'Sucesso'
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {getReturnStatus(retry.retur_api)}
        </span>
      </td>

      <td className="px-4 py-3 text-sm">
        <div className="max-w-xs truncate" title={getReturnMessage(retry.retur_api)}>
          {getReturnMessage(retry.retur_api)}
        </div>
      </td>


      <td className="px-4 py-3 text-sm">
        <RetryDetailDialog retry={retry} />
      </td>
    </tr>
  );
}
