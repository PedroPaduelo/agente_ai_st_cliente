import { Eye } from "lucide-react";
import { formatDateTime, phoneDDI } from "@/lib/utils";
import type { CpfConsultation } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { JsonViewer } from "./JsonViewer";

interface ConsultationDetailDialogProps {
  consultation: CpfConsultation;
}

export function ConsultationDetailDialog({ consultation }: ConsultationDetailDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Consulta de CPF</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">ID da Consulta</h3>
              <p className="text-sm">{consultation.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Sessão</h3>
              <p className="text-sm">{consultation.session}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Telefone</h3>
              <p className="text-sm">{phoneDDI(consultation.telefone)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Agente</h3>
              <p className="text-sm">{consultation.agente}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">CPF</h3>
              <p className="text-sm">{consultation.cpf}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Data de Criação</h3>
              <p className="text-sm">{formatDateTime(consultation.creating_at)}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Dados da Consulta</h3>
            <JsonViewer data={consultation.retur_api} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
