# Santana Cred IA - Frontend

Frontend para a plataforma de análise e gerenciamento de interações de IA da Santana Cred, construído com React, Vite, TypeScript e shadcn/ui.

## Visão Geral

Esta aplicação fornece uma interface para visualizar e interagir com dados provenientes de sistemas de IA de atendimento, incluindo conversas de chat, consultas de CPF, transbordos para atendimento humano e retentativas de mensagens. O dashboard oferece uma visão consolidada das principais métricas e tendências.

## Funcionalidades Principais

*   **Dashboard:** Visão geral com KPIs (Key Performance Indicators), gráficos de volume de mensagens, chats, transbordos, distribuição por banco e tipos de evento.
*   **Inbox:** Interface para visualização detalhada de conversas individuais, incluindo mensagens trocadas, eventos da sessão (consultas CPF, validações, transbordos) e informações do cliente (telefone, banco, saldo). Permite o envio manual de mensagens e a solicitação de transbordo.
*   **Consultas CPF:** Tabela paginada e filtrável com o histórico de todas as consultas de CPF realizadas pelo sistema, incluindo detalhes da resposta da API.
*   **Transbordos:** Tabela paginada e filtrável com o registro de todas as solicitações de transferência para atendimento humano, incluindo status e detalhes da API.
*   **Retentativas:** Tabela paginada e filtrável com o histórico de tentativas de reenvio de mensagens que falharam inicialmente, incluindo detalhes do erro e status final.
*   **Performance:** (Implementação futura) Análise de métricas de desempenho do atendimento, como tempo médio de resposta, taxa de resolução, etc.
*   **Interface Responsiva:** Adaptada para uso em desktops e dispositivos móveis.
*   **Tema Claro/Escuro:** Suporte a temas para melhor visualização (implementação futura).

## Stack Tecnológica

*   **React (v19):** Biblioteca JavaScript para construção de interfaces de usuário.
*   **Vite:** Ferramenta de build e servidor de desenvolvimento rápido.
*   **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
*   **React Router DOM (v7):** Gerenciamento de rotas na aplicação.
*   **Tailwind CSS:** Framework CSS utilitário para estilização rápida.
*   **shadcn/ui:** Coleção de componentes de UI reutilizáveis, acessíveis e customizáveis, construídos sobre Radix UI e Tailwind CSS.
*   **Radix UI:** Primitivos de UI acessíveis e não estilizados.
*   **TanStack Query (React Query v5):** Gerenciamento de estado assíncrono, cache e sincronização de dados do servidor.
*   **Axios:** Cliente HTTP baseado em Promises para requisições à API.
*   **Recharts:** Biblioteca para criação de gráficos em React.
*   **Zod:** Validação de schemas e tipos (usado internamente em algumas dependências).
*   **date-fns:** Biblioteca para manipulação de datas.
*   **Lucide React:** Biblioteca de ícones SVG.

## Iniciando o Projeto

### Pré-requisitos

*   Node.js (v18+ recomendado)
*   npm (geralmente vem com o Node.js)
*   API Backend rodando e acessível (verificar URL no `.env`).

### Instalação

1.  **Clone o repositório** (se ainda não o fez):
    ```bash
    # Exemplo: git clone <url-do-repositorio>
    # cd <nome-do-diretorio>
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure as Variáveis de Ambiente:**
    *   Copie o arquivo de exemplo: `cp .env.example .env`
    *   Edite o arquivo `.env` com a URL correta da sua API backend:
        ```dotenv
        VITE_API_URL=http://localhost:3019 # Ou a URL da sua API
        ```
    *   Para builds de produção ou ambientes específicos, configure também `.env.production` ou outros arquivos `.env.[mode]`. O arquivo `.env.production` já está configurado para usar HashRouter, ideal para deploy em serviços como Vercel ou Netlify sem configuração de servidor adicional.

### Executando

1.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível geralmente em `http://localhost:5173` (verifique o output do terminal).

2.  **Build para produção:**
    ```bash
    npm run build
    ```
    Os arquivos otimizados estarão na pasta `dist/`. O script de build já inclui a cópia do `index.html` para `200.html` e `404.html` para compatibilidade com SPAs em alguns serviços de hospedagem.

3.  **Preview da build de produção:**
    ```bash
    npm run preview
    ```

## Estrutura do Projeto

```
/src
├── App.tsx             # Componente principal, define rotas
├── main.tsx            # Ponto de entrada, inicializa React e Providers
├── index.css           # Estilos globais e configuração Tailwind base
├── vite-env.d.ts       # Tipos de ambiente Vite
│
├── assets/             # Recursos estáticos (imagens, SVGs)
├── components/         # Componentes UI padrão (gerados/gerenciados por shadcn/ui)
├── components-custom/  # Componentes customizados ou modificados
│   ├── layout/         # Componentes de estrutura (Layout, Sidebar)
│   ├── skeletons/      # Componentes de Skeleton Loading
│   ├── ui/             # Componentes de UI customizados (FormExample, etc)
│   └── typography.tsx  # Componentes para padronização de texto
│
├── hooks/              # Hooks customizados (useDashboard, useInbox, etc.)
├── lib/                # Utilitários, configurações, API
│   ├── api.ts          # Configuração do Axios e funções de chamada da API
│   ├── theme-provider.tsx # Gerenciador de tema claro/escuro
│   └── utils.ts        # Funções utilitárias gerais (formatação, localStorage)
│
└── pages/              # Componentes de página (cada pasta representa uma rota)
    ├── Dashboard/
    ├── Inbox/
    ├── CpfConsultations/
    ├── Transbordos/
    ├── Retries/
    ├── Performance/
    └── FormExamplePage/ # Página de exemplo
```

## Rotas da Aplicação

*   `/`: **Dashboard** - Visão geral das métricas.
*   `/inbox`: **Inbox** - Visualização e interação com conversas.
*   `/cpf-consultations`: **Consultas CPF** - Histórico de consultas de CPF.
*   `/transbordos`: **Transbordos** - Histórico de transferências para atendimento humano.
*   `/retries`: **Retentativas** - Histórico de retentativas de envio de mensagens.
*   `/performance`: **Performance** - Análise de desempenho (atualmente com dados de exemplo).
*   `/form-example`: **Exemplo de Formulário** - Página de demonstração de componentes de formulário.

## Próximos Passos e Melhorias

*   Implementar completamente a página de **Performance**.
*   Adicionar **autenticação** de usuários.
*   Implementar **notificações** em tempo real para novas mensagens ou eventos.
*   Melhorar a **paginação** e carregamento sob demanda (infinite scroll) em listas longas.
*   Adicionar **testes** unitários e de integração.
*   Refinar a **interface mobile**.
*   Completar a funcionalidade de **tema claro/escuro**.
*   Otimizar o **desempenho** de carregamento e renderização.
