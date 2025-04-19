import { formatTime, phoneDDI } from "@/lib/utils";
import { useInboxContext } from "../context";
import type { InboxChat } from "@/hooks/useInbox";

type ChatItemProps = {
  chat: InboxChat;
};

export const ChatItem = ({ chat }: ChatItemProps) => {
  const { selectedChat, setSelectedChat } = useInboxContext();
  const isSelected = selectedChat === chat.id;
  const formattedTime = formatTime(chat.timestamp);

  // Determinar se tem saldo para estilização
  const hasSaldo = chat.hasBalance === true;
  const bankInfo = chat.bank ? chat.bank : 'N/A';

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className={`border-b p-3 cursor-pointer hover:bg-accent ${isSelected ? "bg-accent" : ""} transition-colors`}
      onClick={() => setSelectedChat(chat.id)}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="font-medium flex items-center gap-2">
          {phoneDDI(chat.telefone)}
          {hasSaldo && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              Saldo Disponível
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          {formattedTime}
        </div>
      </div>
      
      <div className="text-sm truncate max-w-[250px] mb-2">
        {chat.lastMessage}
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="px-2 py-0.5 bg-muted rounded">{chat.session}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {chat.instancia && (
            <span className="px-2 py-0.5 bg-muted rounded" title="Instância">
              {chat.instancia.slice(-4)}
            </span>
          )}
          
          {chat.bank && (
            <span 
              className={`px-2 py-0.5 rounded ${hasSaldo ? "bg-green-100 text-green-800" : "bg-muted"}`}
              title={`Banco: ${bankInfo}${chat.balance ? ` - Saldo: ${chat.balance}` : ''}`}
            >
              {bankInfo}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
