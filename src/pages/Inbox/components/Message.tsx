import { formatTime } from "@/lib/utils";
import { Bot, User, FileSearch, RotateCcw, ShieldAlert, ShieldCheck, ArrowRightFromLine } from "lucide-react";
import type { InboxMessage } from "@/hooks/useInbox";

type MessageProps = {
  message: InboxMessage;
};

export const Message = ({ message }: MessageProps) => {
  const isBot = message.sender === "bot";
  const isRetry = message.retry === true;
  const formattedTime = formatTime(message.timestamp);
  const eventType = message.eventType || "message";

  // Determinar ícone com base no tipo de evento
  const getEventIcon = () => {
    if (isBot) {
      switch (eventType) {
        case "consulta cpf":
          return <FileSearch className="h-4 w-4 text-primary-foreground" />;
        case "valida cpf":
          return <ShieldCheck className="h-4 w-4 text-primary-foreground" />;
        case "transbordo":
          return <ArrowRightFromLine className="h-4 w-4 text-primary-foreground" />;
        case "retry":
        case "message":
          if (isRetry) {
            return <RotateCcw className="h-4 w-4 text-primary-foreground" />;
          }
          return <Bot className="h-4 w-4 text-primary-foreground" />;
        default:
          return <ShieldAlert className="h-4 w-4 text-primary-foreground" />;
      }
    }
    return <User className="h-4 w-4" />;
  };

  // Determinar cor de fundo e borda com base no tipo de evento
  const getEventStyles = () => {
    if (isBot) {
      switch (eventType) {
        case "consulta cpf":
          return "bg-blue-100 border border-blue-300 text-blue-800";
        case "valida cpf":
          return "bg-indigo-100 border border-indigo-300 text-indigo-800";
        case "transbordo":
          return message.transbordo 
            ? "bg-emerald-100 border border-emerald-300 text-emerald-800"
            : "bg-rose-100 border border-rose-300 text-rose-800";
        case "message":
          if (isRetry) {
            return "bg-amber-100 border border-amber-300 text-amber-800";
          }
          if (message.isTransbordo && message.transbordo) {
            return "bg-emerald-100 border border-emerald-300 text-emerald-800";
          }
          if (message.isTransbordo && message.transbordo && !message.transbordo) {
            return "bg-rose-100 border border-rose-300 text-rose-800";
          }
          return "bg-secondary";
        default:
          return "bg-gray-100 border border-gray-300 text-gray-800";
      }
    }
    return "bg-primary text-primary-foreground";
  };

  // Determinar cor do ícone com base no tipo de evento
  const getIconBackgroundColor = () => {
    if (isBot) {
      switch (eventType) {
        case "consulta cpf":
          return "bg-blue-500 ml-2";
        case "valida cpf":
          return "bg-indigo-500 ml-2";
        case "transbordo":
          return message.transbordo
            ? "bg-emerald-500 ml-2"
            : "bg-rose-500 ml-2";
        case "message":
          if (isRetry) {
            return "bg-amber-500 ml-2";
          }
          if (message.isTransbordo && message.transbordo?.status) {
            return "bg-emerald-500 ml-2";
          }
          if (message.isTransbordo && message.transbordo && !message.transbordo.status) {
            return "bg-rose-500 ml-2";
          }
          return "bg-primary ml-2";
        default:
          return "bg-gray-500 ml-2";
      }
    }
    return "bg-secondary mr-2";
  };

  // Determinar rótulo do evento
  const getEventLabel = () => {
    switch (eventType) {
      case "consulta cpf":
        return "CONSULTA CPF";
      case "valida cpf":
        return "VALIDAÇÃO CPF";
      case "transbordo":
        return "TRANSBORDO";
      default:
        if (isRetry) {
          return "RETENTATIVA";
        }
        if (message.isTransbordo) {
          return "TRANSBORDO";
        }
        return null;
    }
  };

  // Determinar cor do rótulo
  const getLabelColor = () => {
    switch (eventType) {
      case "consulta cpf":
        return "text-blue-600";
      case "valida cpf":
        return "text-indigo-600";
      case "transbordo":
        return message.transbordo
          ? "text-emerald-600"
          : "text-rose-600";
      default:
        if (isRetry) {
          return "text-amber-600";
        }
        if (message.isTransbordo) {
          return message.transbordo
            ? "text-emerald-600"
            : "text-rose-600";
        }
        return "";
    }
  };

  return (
    <div className={`flex ${!isBot ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`flex max-w-[80%] ${!isBot ? "flex-row" : "flex-row-reverse"}`}
      >
        <div
          className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${getIconBackgroundColor()}`}
        >
          {getEventIcon()}
        </div>
        <div className="flex-grow-0">
          <div className={`rounded-lg p-3 ${getEventStyles()}`}>
            {message.agente && (
              <div className="text-xs font-semibold mb-1">
                {message.agente}
              </div>
            )}
            
            {getEventLabel() && (
              <div className={`text-xs font-semibold ${getLabelColor()} mb-1`}>
                {getEventLabel()}
              </div>
            )}
            
            {message.content}
            
            {eventType === "consulta cpf" && message.eventData && (
              <div className="mt-2 p-2 rounded bg-white/50 text-xs">
                {message.eventData.banco && (
                  <div>
                    <span className="font-medium">Banco:</span> {message.eventData.banco}
                  </div>
                )}
                {message.eventData.valor_liquido && (
                  <div>
                    <span className="font-medium">Valor:</span> R$ {message.eventData.valor_liquido}
                  </div>
                )}
                {message.eventData.valorliberado && (
                  <div>
                    <span className="font-medium">Valor liberado:</span> {message.eventData.valorliberado}
                  </div>
                )}
              </div>
            )}
            
            {eventType === "transbordo" && message.eventData && (
              <div className="mt-2 p-2 rounded bg-white/50 text-xs">
                {message.eventData.descricao && (
                  <div>
                    <span className="font-medium">Descrição:</span> {message.eventData.descricao}
                  </div>
                )}
                {message.eventData.protocolo && (
                  <div>
                    <span className="font-medium">Protocolo:</span> {message.eventData.protocolo}
                  </div>
                )}
                {message.eventData.sessaoid && (
                  <div>
                    <span className="font-medium">Sessão:</span> {message.eventData.sessaoid}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};
