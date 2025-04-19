import { TransbordoContent } from "./components";
import { TransbordosProvider } from "./context";

export function Transbordos() {
  return (
    <TransbordosProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transbordos</h1>
          <p className="text-muted-foreground">
            Registros de transferências para atendimento humano.
          </p>
        </div>
        
        <TransbordoContent />
      </div>
    </TransbordosProvider>
  );
}
