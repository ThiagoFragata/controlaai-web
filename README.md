# ControlaAí 💰

Um sistema completo de controle financeiro pessoal, desenvolvido com Next.js 16 e React 19, para ajudar você a gerenciar suas finanças de forma eficiente e intuitiva.

![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.18.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-cyan)

## 🌐 Deploy

O projeto está disponível em produção em:

https://controlaai-web.vercel.app/

## ✨ Funcionalidades

### 📊 Dashboard

- **Resumo Mensal**: Visualize receitas, despesas e saldo em tempo real
- **Gráficos Interativos**: Distribuição de gastos por categoria
- **Indicadores Principais**: Contas fixas, parcelas, gastos variáveis
- **Alertas Inteligentes**: Próximas parcelas e maiores gastos

### 💳 Controle de Gastos

- **Gastos Variáveis**: Registre e categorize todos os seus gastos
- **Contas Mensais**: Gerencie contas fixas como aluguel, luz, internet
- **Parcelas**: Controle de compras parceladas com datas de vencimento
- **Rendas**: Registro de todas as fontes de receita

### 🔐 Autenticação

- **Login Seguro**: Sistema de autenticação com NextAuth.js
- **Cadastro de Usuários**: Interface intuitiva para novos usuários
- **Sessões Protegidas**: Todas as rotas do dashboard são autenticadas

### 🎨 Interface Moderna

- **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- **UI/UX Apple-like**: Interface moderna com efeitos glassmorphism
- **Componentes Reutilizáveis**: Sistema de design consistente
- **Animações Fluidas**: Transições suaves com Framer Motion

## 🚀 Roadmap - Próximas Funcionalidades

### 🔐 Autenticação Avançada

- **Login com Google**: Integração com OAuth 2.0 do Google para facilitar o acesso
- **Login Social**: Suporte para outros provedores (GitHub, Apple ID)
- **Recuperação de Senha**: Sistema de reset de senha via email
- **Verificação em Duas Etapas**: Camada extra de segurança

### 🤖 Integração com IA/LLM

- **Assistente Financeiro Virtual**: Chatbot para consultas sobre finanças
- **Categorização Automática**: IA para classificar gastos automaticamente
- **Análise Preditiva**: Previsões de gastos baseadas no histórico
- **Insights Inteligentes**: Sugestões personalizadas para economia
- **Relatórios em Linguagem Natural**: Geração de relatórios explicativos

### 📱 Melhorias na Experiência

- **Notificações Push**: Alertas para vencimentos e metas
- **Modo Offline**: Funcionamento básico sem conexão
- **Sincronização Multi-dispositivo**: Dados em tempo real
- **Exportação de Dados**: PDF, Excel, CSV
- **Metas Financeiras**: Sistema de objetivos e acompanhamento

### 🔧 Funcionalidades Avançadas

- **Orçamento Inteligente**: Controle de gastos por categoria
- **Cartões de Crédito**: Integração com faturas e limites
- **Investimentos**: Acompanhamento de carteira de investimentos
- **Relatórios Avançados**: Dashboards personalizáveis
- **API Pública**: Para integrações de terceiros

### 🌍 Internacionalização

- **Múltiplos Idiomas**: Suporte para português, inglês e espanhol
- **Moedas Locais**: Formatação automática por país
- **Feriados Regionais**: Consideração em cálculos de prazos

## 🛠️ Stack Tecnológico

### Frontend

- **Next.js 16.0.0** - Framework React com App Router
- **React 19.2.0** - Biblioteca para interfaces de usuário
- **TypeScript 5.0** - Tipagem estática para JavaScript
- **Tailwind CSS 4.0** - Framework CSS utilitário

### Backend & Database

- **Prisma 6.18.0** - ORM para Node.js
- **PostgreSQL** - Banco de dados relacional
- **NextAuth.js 4.24.11** - Autenticação para Next.js

### UI Components & Libraries

- **Radix UI** - Componentes acessíveis e customizáveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones modernos
- **Framer Motion** - Animações

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Yarn ou npm

### Passos para Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/ThiagoFragata/controlaai-web.git
cd controlaai-web
```

2. **Instale as dependências**

```bash
yarn install
# ou
npm install
```

3. **Configure o banco de dados**

```bash
# Copie o arquivo de exemplo e configure suas variáveis de ambiente
cp .env.example .env
```

4. **Configure as variáveis de ambiente no arquivo .env**

   - `DATABASE_URL`: URL do seu banco de dados PostgreSQL
   - `NEXTAUTH_SECRET`: Gere uma string secreta segura para NextAuth
   - `NEXTAUTH_URL`: URL da sua aplicação (localhost:3000 para desenvolvimento)
   - `NEXT_PUBLIC_APP_URL`: URL pública da aplicação

5. **Execute as migrações do Prisma**

```bash
npx prisma migrate dev
```

5. **Gere o cliente Prisma**

```bash
npx prisma generate
```

6. **Inicie o servidor de desenvolvimento**

```bash
yarn dev
# ou
npm run dev
```

7. **Acesse a aplicação**

```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   │   ├── auth/         # Autenticação
│   │   ├── contas-mensais/ # CRUD Contas Mensais
│   │   ├── gastos-variaveis/ # CRUD Gastos Variáveis
│   │   ├── parcelas/     # CRUD Parcelas
│   │   └── renda/        # CRUD Rendas
│   ├── dashboard/        # Páginas do Dashboard
│   ├── signin/          # Página de Login
│   └── signup/          # Página de Cadastro
├── components/           # Componentes React
│   ├── ui/             # Componentes base (shadcn/ui)
│   └── ...             # Componentes específicos
├── lib/                # Utilitários e configurações
├── providers/          # Context Providers
└── store/              # Gerenciamento de estado
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev          # Inicia servidor de desenvolvimento
yarn build        # Build para produção
yarn start        # Inicia servidor de produção
yarn lint         # Executa ESLint

# Database
npx prisma studio # Interface visual do banco
npx prisma migrate dev # Migrações de desenvolvimento
npx prisma generate   # Gera cliente Prisma
```

## 🌟 Principais Features

### Dashboard Inteligente

- Cálculo automático de saldo
- Médias de gastos por categoria
- Alertas para próximos vencimentos
- Visualizações gráficas interativas

### Gerenciamento Completo

- CRUD completo para todas as entidades
- Validação de dados com Zod
- Formatação automática de moeda
- Filtros e buscas avançadas

### Performance Otimizada

- Server Components do Next.js 13+
- Cache inteligente com React Query
- Lazy loading de componentes
- Otimização de imagens

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Thiago Fragata**

- GitHub: [@ThiagoFragata](https://github.com/ThiagoFragata)
- LinkedIn: [Thiago Fragata](https://linkedin.com/in/thiagofragata)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Prisma](https://www.prisma.io/) - ORM moderno
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis
- [Vercel](https://vercel.com/) - Deploy platform

---

⭐ **Se este projeto te ajudou, deixe uma estrela no GitHub!**

## 🔭 Próximos passos e integrações

Abaixo seguem recomendações e ideias para evoluir o projeto em áreas importantes — instruções e decisões rápidas para quando for implementar.

### 1) Login com Google

- Use o provider Google do NextAuth.js para permitir login social. Passos principais:
  - Crie credenciais OAuth 2.0 no Google Cloud Console (Client ID e Client Secret).
  - Adicione as variáveis de ambiente no Vercel / .env:
    - `GOOGLE_CLIENT_ID`
    - `GOOGLE_CLIENT_SECRET`
    - `NEXTAUTH_URL` (ex.: https://controlaai-web.vercel.app)
  - Configure NextAuth providers em `src/lib/auth` (ou arquivo equivalente):
    - import { GoogleProvider } from 'next-auth/providers/google'
  - Teste localmente com `NEXTAUTH_URL=http://localhost:3000` e credenciais de desenvolvimento.

### 2) Integração com LLM (Large Language Models)

- Caso queira adicionar funcionalidades baseadas em LLM (ex.: sugestões de categorização, análise de gastos, resumo financeiro):
  - Escolha um provedor: OpenAI, Anthropic, Azure OpenAI, Google Vertex AI, etc.
  - Recomendação de arquitetura:
    - Fazer chamadas a LLMs apenas no servidor (API routes / server actions) para proteger chaves.
    - Cache de respostas (Redis) para reduzir custo e latência em prompts repetidos.
    - Implementar rate limits e monitoramento de custo por usuário.
  - Variáveis de ambiente típicas:
    - `OPENAI_API_KEY` ou `LLM_API_KEY`
  - Exemplo de uso: endpoint `/api/insights` que recebe transações e retorna um resumo/insight.

### 3) Outras possibilidades a considerar

- Single Sign-On / SAML para clientes corporativos.
- Integração mobile: React Native + Expo ou Next.js + PWAs para melhorar a experiência em dispositivos móveis.
- Pagamentos e faturamento: integração com Stripe se for necessário cobrar por premium features.
- Observability: Sentry para erro/monitoramento, e um sistema de logs estruturados (e.g., Logflare, Datadog).
- Jobs/background: usar uma fila (BullMQ, RQ, or serverless cron) para tarefas agendadas (notificações, processamento de extratos).
- Internacionalização (i18n): next-intl / i18next para suportar outros idiomas.
- Acessibilidade: auditoria com Lighthouse e melhorias de ARIA/keyboard navigation.

Se quiser, posso:

- Adicionar um exemplo de configuração do NextAuth para Google.
- Criar um endpoint exemplo para chamadas ao OpenAI (com tratamento de custo e cache).
- Gerar um checklist para deploy seguro do LLM em produção (monitoramento, limites, fallback).
