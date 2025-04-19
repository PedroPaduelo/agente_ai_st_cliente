import { FilterSection, ConsultationsTable } from "./components";
import { CpfConsultationsProvider } from "./context";

export function CpfConsultations() {
  return (
    <CpfConsultationsProvider>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Consultas de CPF</h1>
        </div>

        <FilterSection />

        <ConsultationsTable />
      </div>
    </CpfConsultationsProvider>
  );
}
