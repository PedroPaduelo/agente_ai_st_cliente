import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components-custom/ui/card";
import { Button } from "@/components-custom/ui/button";
import { MessageSquare } from "lucide-react";
import { ChatListSkeleton } from "@/components-custom/skeletons/InboxSkeletons";
import { ChatItem } from "./ChatItem";
import { ChatFilter } from "./ChatFilter";
import { useInboxContext } from "../context";

export const ChatList = () => {
  const {
    chats,
    totalChats,
    isChatsLoading,
    chatsError,
    pagination,
    setPagination,
    telefoneFilter,
    sessionFilter,
    isFilterActive
  } = useInboxContext();

  // Configuração da paginação
  const handlePrevPage = () => {
    setPagination((prev) => ({
      ...prev,
      offset: Math.max(0, (prev.offset || 0) - (prev.limit || 10)),
    }));
  };

  const handleNextPage = () => {
    setPagination((prev) => ({
      ...prev,
      offset: (prev.offset || 0) + (prev.limit || 10),
    }));
  };

  // Cálculo de informações de página
  const currentPage = Math.floor((pagination.offset || 0) / (pagination.limit || 10)) + 1;
  const totalPages = Math.ceil(totalChats / (pagination.limit || 10));
  const startItem = Math.min((pagination.offset || 0) + 1, totalChats);
  const endItem = Math.min((pagination.offset || 0) + (pagination.limit || 10), totalChats);
  const hasNextPage = (pagination.offset || 0) + (pagination.limit || 10) < totalChats;

  return (
    <Card className="md:col-span-1 flex flex-col overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversas
          </CardTitle>

          <ChatFilter />
        </div>

        <CardDescription className="mt-1">
          {totalChats > 0
            ? `${chats.length} de ${totalChats} conversas`
            : `${chats.length} conversas`}
          {isFilterActive && (
            <span className="ml-1">
              {telefoneFilter && ` • Tel: ${telefoneFilter}`}
              {sessionFilter && ` • Session: ${sessionFilter}`}
            </span>
          )}
        </CardDescription>
      </CardHeader>

      {/* Estrutura com chat list scrollável e paginação fixa */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Área de scroll dos chats */}
        <div className="flex-1 overflow-auto">
          {isChatsLoading ? (
            <ChatListSkeleton />
          ) : (
            <>
              {chatsError && chats.length === 0 && (
                <div className="p-4 text-destructive text-sm">
                  Erro ao carregar conversas
                </div>
              )}
              {chats.length === 0 && !isChatsLoading && !chatsError && (
                <div className="p-4 text-muted-foreground text-sm">
                  Nenhuma conversa encontrada
                </div>
              )}
              <div className="divide-y">
                {chats.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Paginação fixa na parte inferior com informações detalhadas */}
        {totalChats > 0 ? (
          <div className="p-2 border-t bg-card">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={!pagination.offset || isChatsLoading}
                  className="px-2"
                >
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!hasNextPage || isChatsLoading}
                  className="px-2"
                >
                  Próximo
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                <span>
                  Exibindo <span className="font-medium">{startItem}</span>
                  {startItem !== endItem && (
                    <>
                      {" "}
                      - <span className="font-medium">{endItem}</span>
                    </>
                  )}{" "}
                  de <span className="font-medium">{totalChats}</span> conversas
                </span>
                <div className="mt-1">
                  Página <span className="font-medium">{currentPage}</span> de{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
};
