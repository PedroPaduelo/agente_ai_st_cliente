import { ChatList, ChatDetails } from "./components";
import { InboxProvider } from "./context";

export function Inbox() {
  return (
    <InboxProvider>
      <div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">
            Conversas e mensagens de clientes.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)] max-w-full overflow-hidden">
          {/* Chat list */}
          <ChatList />

          {/* Chat messages */}
          <ChatDetails />
        </div>
      </div>
    </InboxProvider>
  );
}
