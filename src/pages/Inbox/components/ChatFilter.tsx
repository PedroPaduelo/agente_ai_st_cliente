import { Button } from "@/components-custom/ui/button";
import { Filter, Search, X, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components-custom/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useInboxContext } from "../context";

export const ChatFilter = () => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const {
    telefoneFilter,
    setTelefoneFilter,
    sessionFilter,
    setSessionFilter,
    bankFilter,
    setBankFilter,
    hasBalanceFilter,
    setHasBalanceFilter,
    instanciaFilter,
    setInstanciaFilter,
    dateFromFilter,
    setDateFromFilter,
    dateToFilter,
    setDateToFilter,
    isFilterActive,
    handleApplyFilter,
    handleClearFilter
  } = useInboxContext();
  
  // Inicializar as datas se houver filtros
  useEffect(() => {
    if (dateFromFilter) {
      try {
        const dateParts = dateFromFilter.split('-');
        if (dateParts.length === 3) {
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1; // Mês é 0-indexed em Date
          const day = parseInt(dateParts[2]);
          const date = new Date(year, month, day);
          if (!isNaN(date.getTime())) { // Verificar se a data é válida
            setDateFrom(date);
          }
        }
      } catch (error) {
        console.error("Erro ao converter dateFromFilter para Date:", error);
      }
    }
    
    if (dateToFilter) {
      try {
        const dateParts = dateToFilter.split('-');
        if (dateParts.length === 3) {
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1; // Mês é 0-indexed em Date
          const day = parseInt(dateParts[2]);
          const date = new Date(year, month, day);
          if (!isNaN(date.getTime())) { // Verificar se a data é válida
            setDateTo(date);
          }
        }
      } catch (error) {
        console.error("Erro ao converter dateToFilter para Date:", error);
      }
    }
  }, [dateFromFilter, dateToFilter]);

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            {isFilterActive ? "Filtrado" : "Filtrar"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Filtros de Busca</h4>

            <div className="space-y-2">
              <label className="text-xs font-medium">Telefone</label>
              <input
                type="text"
                className="w-full text-sm border rounded-md px-2 py-1"
                placeholder="Ex: 553491141750"
                value={telefoneFilter}
                onChange={(e) => setTelefoneFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Session ID</label>
              <input
                type="text"
                className="w-full text-sm border rounded-md px-2 py-1"
                placeholder="Ex: 4482061"
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium">Banco</label>
              <input
                type="text"
                className="w-full text-sm border rounded-md px-2 py-1"
                placeholder="Ex: Nubank"
                value={bankFilter}
                onChange={(e) => setBankFilter(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium">Instância</label>
              <input
                type="text"
                className="w-full text-sm border rounded-md px-2 py-1"
                placeholder="Ex: 553432351471"
                value={instanciaFilter}
                onChange={(e) => setInstanciaFilter(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium">Possui Saldo</label>
              <select
                className="w-full text-sm border rounded-md px-2 py-1"
                value={hasBalanceFilter}
                onChange={(e) => setHasBalanceFilter(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Data Inicial</label>
              <div className="relative border rounded-md px-2 py-1 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex-grow text-left text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(date) => {
                        setDateFrom(date);
                        if (date) {
                          setDateFromFilter(format(date, "yyyy-MM-dd"));
                        } else {
                          setDateFromFilter("");
                        }
                      }}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                {dateFrom && (
                  <button
                    onClick={() => {
                      setDateFrom(undefined);
                      setDateFromFilter("");
                    }}
                    className="text-gray-400 hover:text-gray-600 ml-1 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Data Final</label>
              <div className="relative border rounded-md px-2 py-1 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex-grow text-left text-sm overflow-hidden text-ellipsis whitespace-nowrap" disabled={!dateFrom}>
                      {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={(date) => {
                        setDateTo(date);
                        if (date) {
                          setDateToFilter(format(date, "yyyy-MM-dd"));
                        } else {
                          setDateToFilter("");
                        }
                      }}
                      initialFocus
                      locale={ptBR}
                      disabled={!dateFrom ? undefined : (date) => {
                        // Verifica se a data é válida e se é posterior à data inicial
                        return date < dateFrom;
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {dateTo && (
                  <button
                    onClick={() => {
                      setDateTo(undefined);
                      setDateToFilter("");
                    }}
                    className="text-gray-400 hover:text-gray-600 ml-1 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              {isFilterActive && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => {
                    setDateFrom(undefined);
                    setDateTo(undefined);
                    handleClearFilter();
                  }}
                >
                  <X className="h-3 w-3" />
                  Limpar
                </Button>
              )}
              <Button
                size="sm"
                className="flex items-center gap-1"
                onClick={handleApplyFilter}
                disabled={!telefoneFilter && !sessionFilter && !bankFilter && !instanciaFilter && hasBalanceFilter === "" && (!dateFromFilter || dateFromFilter === "") && (!dateToFilter || dateToFilter === "")}
              >
                <Search className="h-3 w-3" />
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {isFilterActive && (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 p-0 h-8 w-8"
          onClick={() => {
            setDateFrom(undefined);
            setDateTo(undefined);
            handleClearFilter();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
