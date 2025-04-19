# Chat API Frontend

Frontend para aplicação de chat, construído com React, Vite, TypeScript e shadcn/ui.

## Funcionalidades

- Dashboard interativo com gráficos e KPIs
- Visualização de conversas e mensagens
- Interface responsiva para desktop e mobile
- Tema claro/escuro (implementação futura)

## Stack Tecnológica

- **React**: Biblioteca JavaScript para construção de interfaces
- **Vite**: Build tool e dev server rápido
- **TypeScript**: Superset JavaScript com tipagem estática
- **React Router**: Roteamento para aplicações React
- **shadcn/ui**: Componentes UI reutilizáveis e acessíveis
- **Tailwind CSS**: Framework CSS utilitário
- **Recharts**: Biblioteca de gráficos para React
- **Axios**: Cliente HTTP para requests à API

## Iniciando

### Pré-requisitos

- Node.js (v16+ recomendado)
- Backend Chat API rodando (ver documentação do backend)

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   # Copie o arquivo de exemplo
   cp .env.example .env
   
   # Edite o arquivo .env com suas configurações
   VITE_API_URL=http://localhost:3000
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

```
/src
  /components
    /ui            # Componentes shadcn/ui
    /layout        # Componentes de layout (Sidebar, etc)
  /pages           # Páginas da aplicação
  /lib             # Utilitários e configurações
  /assets          # Recursos estáticos
```

## Rotas

- `/` - Dashboard principal com KPIs e gráficos
- `/inbox` - Inbox de chats e mensagens

## Próximos Passos

- Implementação de tema claro/escuro
- Filtragem e busca de conversas
- Notificações em tempo real de novas mensagens
- Paginação para carregamento de histórico de mensagens
- Autenticação e autorização de usuários
