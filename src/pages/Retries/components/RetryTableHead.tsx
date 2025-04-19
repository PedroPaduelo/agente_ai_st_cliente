export function RetryTableHead() {
  return (
    <thead>
      <tr className="bg-muted/50">
        <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
        <th className="px-4 py-3 text-left text-sm font-medium">Sessão</th>
        <th className="px-4 py-3 text-left text-sm font-medium">Telefone</th>
        <th className="px-4 py-3 text-left text-sm font-medium">Transbordo</th>
        <th className="px-4 py-3 text-left text-sm font-medium">Tentativa</th>
        <th className="px-4 py-3 text-left text-sm font-medium">Erro</th>
        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
        <th className="px-4 py-3 text-left text-sm font-medium">Mensagem</th>
        <th className="px-4 py-3 text-left text-sm font-medium">Ações</th>
      </tr>
    </thead>
  );
}
