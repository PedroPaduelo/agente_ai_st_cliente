import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components-custom/ui/card";
import { ArrowRightFromLine, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components-custom/ui/button";
import { 
  ChatHeaderSkeleton, 
  MessagesListSkeleton, 
  ChatInputSkeleton 
} from "@/components-custom/skeletons/InboxSkeletons";
import { Message } from "./Message";
import { formatDateTime, phoneDDI } from "@/lib/utils";
import { useInboxContext } from "../context";

export const ChatDetails = () => {
  const {
    selectedChat,
    chats,
    messages,
    isMessagesLoading,
    messagesError,
    handleTransbordo,
    transbordoIsPending,
    notification
  } = useInboxContext();

  // Helper para encontrar o chat atual
  const currentChat = selectedChat 
    ? chats.find((chat) => chat.id === selectedChat) 
    : null;

  return (
    <Card className="md:col-span-2 flex flex-col overflow-hidden relative">
      {/* Notificação Toast */}
      {notification.visible && (
        <div className={`absolute top-2 right-2 left-2 px-4 py-2 rounded-md z-10 flex items-center justify-between ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
          'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? 
              <CheckCircle className="h-4 w-4 mr-2" /> : 
              <AlertCircle className="h-4 w-4 mr-2" />
            }
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}
      
      {selectedChat ? (
        <>
          {isMessagesLoading ? (
            <>
              <ChatHeaderSkeleton />
              <CardContent className="flex-1 overflow-auto p-4">
                <MessagesListSkeleton />
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="flex flex-col pb-2">
                <div className="flex items-center justify-between w-full">
                  <CardTitle>
                    {phoneDDI(currentChat?.telefone || "")}
                  </CardTitle>
                  <CardDescription>
                    Data/Hora: {formatDateTime(currentChat?.timestamp || "")}
                  </CardDescription>
                </div>
                <div className="mt-2 self-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800"
                    onClick={handleTransbordo}
                    disabled={transbordoIsPending}
                  >
                    <ArrowRightFromLine className="h-3.5 w-3.5 mr-1" />
                    {transbordoIsPending ? "Transferindo..." : "Transferir para atendente"}
                  </Button>
                </div>
              </CardHeader>

              <CardDescription className="pb-4 -mt-4 border-b pl-6">
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 max-w-full overflow-x-auto pb-1">
                  <div className="flex items-center bg-muted px-3 py-1 rounded-md">
                    <span className="text-xs font-medium">Session:</span>
                    <span className="ml-1 text-xs">{currentChat?.session}</span>
                  </div>
                  
                  <div className="flex items-center bg-muted px-3 py-1 rounded-md">
                    <span className="text-xs font-medium">Instância:</span>
                    <span className="ml-1 text-xs">{currentChat?.instancia || (messages.length > 0 ? messages[0]?.instancia : "N/A")}</span>
                  </div>
                  
                  {currentChat?.bank && (
                    <div className={`flex items-center px-3 py-1 rounded-md ${currentChat.hasBalance ? "bg-green-100" : "bg-muted"}`}>
                      <span className={`text-xs font-medium ${currentChat.hasBalance ? "text-green-800" : ""}`}>Banco:</span>
                      <span className={`ml-1 text-xs ${currentChat.hasBalance ? "text-green-800" : ""}`}>{currentChat.bank}</span>
                    </div>
                  )}
                  
                  {currentChat?.balance && (
                    <div className="flex items-center bg-green-100 px-3 py-1 rounded-md">
                      <span className="text-xs font-medium text-green-800">Saldo:</span>
                      <span className="ml-1 text-xs text-green-800">{currentChat.balance}</span>
                    </div>
                  )}
                  
                  {currentChat?.hasBalance !== undefined && (
                    <div className={`flex items-center px-3 py-1 rounded-md ${currentChat.hasBalance ? "bg-green-100" : "bg-red-100"}`}>
                      <span className={`text-xs font-medium ${currentChat.hasBalance ? "text-green-800" : "text-red-800"}`}>
                        {currentChat.hasBalance ? "Saldo disponível" : "Sem saldo"}
                      </span>
                    </div>
                  )}
                </div>
              </CardDescription>

              <CardContent className="flex-1 overflow-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {messagesError
                      ? "Erro ao carregar eventos da sessão"
                      : "Nenhum evento encontrado para esta sessão"}
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <div className="text-xs font-medium bg-secondary px-2 py-1 rounded-full">
                        {messages.length} eventos
                      </div>
                      <div className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {messages.filter(m => m.eventType === "consulta cpf").length} consultas CPF
                      </div>
                      <div className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        {messages.filter(m => m.eventType === "valida cpf").length} validações CPF
                      </div>
                      <div className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                        {messages.filter(m => m.eventType === "transbordo").length} transbordos
                      </div>
                      <div className="text-xs font-medium bg-secondary px-2 py-1 rounded-full">
                        {messages.filter(m => m.eventType === "message").length} mensagens
                      </div>
                    </div>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <Message key={message.id} message={message} />
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Selecione uma conversa para visualizar as mensagens
        </div>
      )}
    </Card>
  );
};
