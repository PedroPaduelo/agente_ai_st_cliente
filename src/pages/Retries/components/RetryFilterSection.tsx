import { Search, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useRetryContext } from "../context";


export function RetryFilterSection() {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  
  const {
    telefoneFilter,
    sessionFilter,
    flagueTransbordoFilter,
    tentativasExecutadasFilter,
    dateFromFilter,
    dateToFilter,
    
    setTelefoneFilter,
    setSessionFilter,
    setFlagueTransbordoFilter,
    setTentativasExecutadasFilter,
    setDateFromFilter,
    setDateToFilter,
    
    isFiltering,
    handleSearch,
    handleClearFilters
  } = useRetryContext();

  return (
    <Card className="mb-4 p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Filtros de Retentativas</h3>
      <div className="flex flex-col md:flex-row gap-4 flex-wrap">

        <div className="flex-1 min-w-[250px]">
          <Label htmlFor="telefone" className="block text-sm font-medium mb-1">
            Telefone
          </Label>
          <div className="relative">
            <Input
              id="telefone"
              type="text"
              placeholder="Buscar por telefone"
              value={telefoneFilter}
              onChange={(e) => setTelefoneFilter(e.target.value)}
              className="pr-10 w-full hover:border-primary focus-visible:ring-1 focus-visible:ring-primary"
            />
  
          </div>
        </div>
        
        <div className="flex-1 min-w-[250px]">
          <Label htmlFor="session" className="block text-sm font-medium mb-1">
            Sessão
          </Label>
          <div className="relative">
            <Input
              id="session"
              type="text"
              placeholder="Buscar por sessão"
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="pr-10 w-full hover:border-primary focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[250px]">
          <Label htmlFor="flague_transbordo" className="block text-sm font-medium mb-1">
            Flag de transbordo
          </Label>
          <Select 
            value={flagueTransbordoFilter} 
            onValueChange={setFlagueTransbordoFilter}
          >
            <SelectTrigger id="flague_transbordo" className="w-full hover:border-primary focus-visible:ring-1 focus-visible:ring-primary">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="1">Sim</SelectItem>
              <SelectItem value="0">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[250px]">
          <Label htmlFor="tentativas_executadas" className="block text-sm font-medium mb-1">
            Tentativas executadas
          </Label>
          <Input
            id="tentativas_executadas"
            type="text"
            placeholder="Número de tentativas"
            value={tentativasExecutadasFilter}
            onChange={(e) => setTentativasExecutadasFilter(e.target.value)}
            className="pr-10 w-full hover:border-primary focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="dateFrom" className="block text-sm font-medium mb-1">
            Data de início
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dateFrom"
                variant={"outline"}
                className={`w-full justify-start text-left font-normal hover:border-primary hover:bg-transparent ${!dateFrom && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
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
                footer={<p className="text-xs text-center p-2 text-muted-foreground">Selecione a data de início</p>}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="dateTo" className="block text-sm font-medium mb-1">
            Data de fim
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dateTo"
                variant={"outline"}
                className={`w-full justify-start text-left font-normal hover:border-primary hover:bg-transparent ${!dateTo && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
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
                disabled={!dateFrom ? undefined : (date) => date < dateFrom}
                footer={<p className="text-xs text-center p-2 text-muted-foreground">Selecione a data de fim</p>}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-end space-x-3 min-w-[200px]">
          <Button 
            onClick={handleSearch}
            disabled={!telefoneFilter && !sessionFilter && (flagueTransbordoFilter === "todos") && !tentativasExecutadasFilter && !dateFromFilter && !dateToFilter}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
          
          {isFiltering && (
            <Button 
              variant="outline" 
              onClick={() => {
                handleClearFilters();
                setDateFrom(undefined);
                setDateTo(undefined);
              }}
              className="flex-1 border-primary/20 hover:bg-primary/10 hover:text-primary"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>

      </div>
      
      {isFiltering && (
        <div className="mt-4 text-sm flex flex-wrap gap-2">
          <span className="font-medium">Filtros ativos: </span>
          {telefoneFilter && <span className="mr-2 px-2 py-1 bg-muted rounded-md">Telefone: {telefoneFilter}</span>}
          {sessionFilter && <span className="mr-2 px-2 py-1 bg-muted rounded-md">Sessão: {sessionFilter}</span>}
          {flagueTransbordoFilter && flagueTransbordoFilter !== "todos" && (
            <span className="mr-2 px-2 py-1 bg-muted rounded-md">
              Transbordo: {flagueTransbordoFilter === "1" ? "Sim" : "Não"}
            </span>
          )}
          {tentativasExecutadasFilter && <span className="mr-2 px-2 py-1 bg-muted rounded-md">Tentativas: {tentativasExecutadasFilter}</span>}
          {dateFromFilter && <span className="mr-2 px-2 py-1 bg-muted rounded-md">De: {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : dateFromFilter}</span>}
          {dateToFilter && <span className="mr-2 px-2 py-1 bg-muted rounded-md">Até: {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : dateToFilter}</span>}
        </div>
      )}
    </Card>
  );
}
