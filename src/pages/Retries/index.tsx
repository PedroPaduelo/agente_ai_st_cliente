import { RetryContent } from "./components";
import { RetryProvider } from "./context";

export function Retries() {
  return (
    <RetryProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Retentativas</h1>
          <p className="text-muted-foreground">
            Registros de retentativas de envio de mensagens.
          </p>
        </div>
        
        <RetryContent />
      </div>
    </RetryProvider>
  );
}
