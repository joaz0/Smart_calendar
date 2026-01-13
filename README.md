# 📅 Smart Calendar - Sistema de Agenda Inteligente

> Sistema completo de agenda com IA, colaboração em equipe e foco em produtividade e bem-estar.

[![Angular](https://img.shields.io/badge/Angular-18-red)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 Quick Start (5 minutos)

### Pré-requisitos
- Node.js 20+
- PostgreSQL 15+
- npm ou yarn

### Iniciar Backend

```bash
cd smart-calendar/backend
npm install
npm run dev
```

Backend: http://localhost:3000

### Iniciar Frontend (outro terminal)

```bash
cd smart-calendar
npm install
npm start
```

Frontend: http://localhost:4200

---

## 📚 Documentação

| Documento | Descrição | Para |
|-----------|-----------|------|
| [smart-calendar/DOCUMENTATION.md](./smart-calendar/DOCUMENTATION.md) | Padrões, arquitetura e patterns frontend | Desenvolvedores Frontend |
| [smart-calendar/backend/BACKEND_DOCUMENTATION.md](./smart-calendar/backend/BACKEND_DOCUMENTATION.md) | API, endpoints e padrões backend | Desenvolvedores Backend |
| [.github/copilot-instructions.md](./.github/copilot-instructions.md) | Instruções para agentes de código | Contribuidores |

---

## 🌟 Principais Features

- 🤖 **IA Integrada** - Sugestões inteligentes e agendamento automático
- 👥 **Colaboração** - Calendários compartilhados e delegação de tarefas
- 🎯 **Produtividade** - Modo foco, blocos de contexto, rastreamento de hábitos
- 💚 **Bem-Estar** - Detector de burnout, pausas ativas, proteção de tempo pessoal
- 🔒 **Privacidade** - Camuflagem de eventos, múltiplos calendários
- 📱 **Responsivo** - Mobile, tablet, desktop com suporte PWA
- ✅ Categorização com cores personalizadas
- ✅ Busca semântica inteligente
- ✅ Filtros avançados

#### Inteligência Artificial
- 🤖 Assistente de agendamento inteligente
- 🤖 Sugestões contextuais baseadas em padrões
- 🤖 Resumo diário automatizado
- 🤖 Cálculo de tempo de viagem com IA
- 🤖 Moderador de reuniões
- 🤖 Análise de produtividade em tempo real

#### Colaboração
- 👥 Calendários compartilhados de equipe
- 👥 Delegação de tarefas com acompanhamento
- 👥 Enquetes de agendamento
- 👥 Visualização de disponibilidade em tempo real
- 👥 Links rápidos para reuniões
- 👥 Analytics de colaboração

#### Produtividade & Contexto
- 🎯 Blocos de contexto temáticos
- 🎯 Biblioteca de templates de eventos
- 🎯 Modo foco com bloqueio de distrações
- 🎯 Rastreamento de hábitos
- 🎯 Notas de reunião com timestamps
- 🎯 Insights de produtividade

#### Bem-Estar
- 💚 Detector de burnout com alertas
- 💚 Lembretes de pausas ativas
- 💚 Integração com apps de saúde
- 💚 Proteção de tempo pessoal
- 💚 Agendamento de wind-down
- 💚 Relatórios de bem-estar

#### Privacidade & Segurança
- 🔒 Camuflagem de eventos sensíveis
- 🔒 Múltiplos calendários separados
- 🔒 Modo off-grid
- 🔒 Backup e migração criptografada
- 🔒 Herança digital configurável
- 🔒 Controle granular de compartilhamento

#### Visualizações Avançadas
- 📊 Calendário com níveis de energia
- 📊 Timeline de projetos visual
- 📊 Mapa de relacionamentos
- 📊 Dashboard de analytics de tempo
- 📊 Busca semântica com IA
- 📊 Relatórios de insights pessoais

#### Integrações
- 🌐 Google Calendar (OAuth2)
- 🌐 Mapas e navegação
- 🌐 Zoom, Meet, Teams
- 🌐 Slack, WhatsApp
- 🌐 Google Drive, Dropbox
- 🌐 Apple Health, Google Fit

#### Interface & UX
- 🎨 Tema claro/escuro automático
- 🎨 Design Material moderno
- 🎨 Animações suaves
- 🎨 Atalhos de teclado
- 🎨 PWA instalável
- 🎨 Suporte offline

### ⚙️ Backend (Node.js + PostgreSQL)

#### API REST
- ✅ Endpoints RESTful completos
- ✅ Autenticação JWT com refresh tokens
- ✅ Autorização baseada em roles
- ✅ Rate limiting e throttling
- ✅ Validação robusta de dados
- ✅ Paginação e ordenação

#### Banco de Dados
- 💾 PostgreSQL 15+ com otimizações
- 💾 15+ tabelas relacionais
- 💾 Índices otimizados
- 💾 Triggers automáticos
- 💾 Migrations versionadas
- 💾 Backup automatizado

#### Segurança
- 🔐 Bcrypt para senhas
- 🔐 Headers de segurança (Helmet)
- 🔐 CORS configurável
- 🔐 Sanitização de inputs
- 🔐 Proteção contra SQL Injection
- 🔐 Logs de auditoria

#### Serviços Avançados
- 🚀 Sistema de notificações
- 🚀 Processamento de eventos recorrentes
- 🚀 Análise de produtividade
- 🚀 Geração de insights com IA
- 🚀 Sincronização externa
- 🚀 Webhooks configuráveis

---

## 🛠️ Tecnologias

### Frontend Stack
```
Angular 18.2+          - Framework principal
Angular Material 18    - Componentes UI
RxJS 7+               - Programação reativa
TypeScript 5.5+       - Linguagem tipada
SCSS                  - Estilos avançados
Chart.js              - Gráficos e visualizações
date-fns              - Manipulação de datas
```

### Backend Stack
```
Node.js 20+           - Runtime JavaScript
Express 4.18+         - Framework web
PostgreSQL 15+        - Banco de dados
TypeScript 5.5+       - Linguagem tipada
JWT                   - Autenticação
Bcrypt                - Hash de senhas
Helmet                - Segurança HTTP
```

### DevOps & Tools
```
Git                   - Controle de versão
npm/pnpm              - Gerenciador de pacotes
ESLint                - Linter
Prettier              - Formatação de código
Jest                  - Testes unitários
Docker                - Containerização (opcional)
```

---

## 📁 Estrutura do Projeto

```
smart-calendar/
├── 📂 backend/                    # API Node.js + Express
│   ├── 📂 src/
│   │   ├── 📂 config/            # Configurações (DB, JWT)
│   │   ├── 📂 controllers/       # Controllers da API
│   │   ├── 📂 middleware/        # Autenticação, validação
│   │   ├── 📂 routes/            # 20+ rotas organizadas
│   │   ├── 📂 services/          # Lógica de negócio
│   │   │   ├── ai-assistant.service.ts
│   │   │   ├── burnout-detector.service.ts
│   │   │   ├── smart-scheduler.service.ts
│   │   │   └── __tests__/       # Testes unitários
│   │   ├── 📂 scripts/           # Scripts de setup/migração
│   │   └── server.ts             # Entry point
│   ├── migrate.js                # Sistema de migrações
│   ├── package.json
│   └── tsconfig.json
│
├── 📂 src/                        # Frontend Angular
│   ├── 📂 app/
│   │   ├── 📂 core/              # Serviços core e guards
│   │   │   ├── 📂 guards/        # Auth, Privacy guards
│   │   │   ├── 📂 interceptors/  # HTTP interceptors
│   │   │   ├── 📂 models/        # 40+ interfaces TypeScript
│   │   │   │   ├── 📂 ai/
│   │   │   │   ├── 📂 collaboration/
│   │   │   │   ├── 📂 visualization/
│   │   │   │   └── 📂 wellness/
│   │   │   └── 📂 services/      # 50+ serviços organizados
│   │   │       ├── 📂 ai/
│   │   │       ├── 📂 collaboration/
│   │   │       ├── 📂 context/
│   │   │       ├── 📂 integrations/
│   │   │       ├── 📂 privacy/
│   │   │       ├── 📂 visualization/
│   │   │       └── 📂 wellness/
│   │   │
│   │   ├── 📂 features/          # Módulos de funcionalidades
│   │   │   ├── 📂 calendar/      # Views do calendário
│   │   │   ├── 📂 ai-assistant/  # IA e assistente
│   │   │   ├── 📂 collaboration/ # Ferramentas de equipe
│   │   │   ├── 📂 wellness/      # Bem-estar
│   │   │   ├── 📂 privacy-control/ # Privacidade
│   │   │   ├── 📂 context-productivity/ # Produtividade
│   │   │   ├── 📂 advanced-visualization/ # Analytics
│   │   │   ├── 📂 integrations/  # Integrações externas
│   │   │   ├── 📂 tasks/         # Gerenciamento de tarefas
│   │   │   └── 📂 events/        # Gerenciamento de eventos
│   │   │
│   │   ├── 📂 shared/            # Componentes compartilhados
│   │   │   ├── 📂 components/    # UI components
│   │   │   ├── 📂 directives/    # Diretivas customizadas
│   │   │   └── 📂 pipes/         # Pipes customizados
│   │   │
│   │   ├── 📂 layouts/           # Layouts da aplicação
│   │   └── 📂 utils/             # Utilitários diversos
│   │
│   ├── 📂 assets/                # Assets estáticos
│   │   ├── 📂 images/
│   │   └── 📂 styles/            # SCSS global
│   └── 📂 environments/          # Configurações de ambiente
│
├── 📂 n8n-nodes-agenda-rapido/   # Integração n8n
│   ├── 📂 credentials/
│   └── 📂 nodes/
│
├── 📂 public/                     # Assets públicos
├── angular.json                   # Config Angular
├── package.json                   # Dependências
└── README.md                      # Este arquivo
```

---

## 💻 Instalação

### Pré-requisitos

```bash
Node.js >= 20.0.0
PostgreSQL >= 15.0
npm >= 10.0.0 (ou pnpm)
Git
```

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/smart-calendar.git
cd smart-calendar
```

### 2. Instale as Dependências

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
cd ..
```

---

## ⚙️ Configuração

### 1. Configure o Banco de Dados

```bash
# Crie o banco de dados PostgreSQL
createdb smart_calendar

# Ou via SQL
psql -U postgres
CREATE DATABASE smart_calendar;
\q
```

### 2. Configure Variáveis de Ambiente

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env`:
```env
# Database (Local Development)
DATABASE_URL=postgresql://usuario:senha@localhost:5432/smart_calendar

# OU use variáveis separadas:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_calendar
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# JWT
JWT_SECRET=seu-segredo-super-secreto-aqui-min-32-caracteres
JWT_REFRESH_SECRET=outro-segredo-para-refresh-token

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:4200

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# OAuth (opcional)
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
```

#### Frontend (environment.ts)
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  googleMapsApiKey: 'sua-api-key',
  oauthRedirectUri: 'http://localhost:4200/auth/callback'
};
```

### 3. Execute as Migrações

```bash
cd backend
npm run migrate
```

### 4. (Opcional) Crie Usuário de Teste

```bash
npm run create-test-user
```

---

## 🚀 Desenvolvimento

### Inicie o Backend

```bash
cd backend
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### Inicie o Frontend

```bash
# Em outro terminal, na raiz do projeto
ng serve
```

A aplicação estará disponível em `http://localhost:4200`

### Scripts Disponíveis

#### Frontend
```bash
npm start              # Inicia em modo desenvolvimento
npm run build          # Build de produção
npm run watch          # Build em modo watch
npm test               # Roda testes
```

#### Backend
```bash
npm run dev            # Desenvolvimento com nodemon
npm start              # Produção
npm run migrate        # Roda migrações
npm test               # Testes unitários
npm run test:watch     # Testes em watch mode
npm run lint           # Verifica código
```

---

## 🌐 Deploy

### Backend no Render.com

1. **Crie conta no Render.com**

2. **Novo Web Service**
   - Connect repository
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node

3. **Configure PostgreSQL**
   - Novo PostgreSQL database
   - Copie DATABASE_URL

4. **Variáveis de Ambiente**
   ```
   NODE_ENV=production
   DATABASE_URL=[copiado do Render]
   JWT_SECRET=[gerado com: openssl rand -base64 32]
   JWT_REFRESH_SECRET=[outro secret]
   CORS_ORIGIN=https://seu-frontend.netlify.app
   ```

5. **Deploy**
   ```bash
   git push origin main
   ```

6. **Execute Migrações**
   - Acesse Shell no Render
   - Execute: `npm run migrate`

### Frontend no Netlify

1. **Build Local**
   ```bash
   ng build --configuration=production
   ```

2. **Deploy no Netlify**
   - Conecte repositório
   - Build command: `ng build --configuration=production`
   - Publish directory: `dist/smart-calendar/browser`

3. **Configure Variáveis**
   ```
   NODE_ENV=production
   ```

4. **Configure Redirects**
   
   Crie `netlify.toml` na raiz:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Alternativas de Deploy

#### Backend
- ✅ Render.com (Recomendado)
- ✅ Railway.app
- ✅ Fly.io
- ✅ Heroku
- ✅ AWS EC2/ECS
- ✅ DigitalOcean App Platform

#### Frontend
- ✅ Netlify (Recomendado)
- ✅ Vercel
- ✅ GitHub Pages
- ✅ AWS S3 + CloudFront
- ✅ Firebase Hosting

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:3000/api
Production: https://api.smart-calendar.com/api
```

### Autenticação

#### POST /auth/register
Registra novo usuário
```json
{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

#### POST /auth/login
Login do usuário
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

Response:
```json
{
  "token": "jwt-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "name": "Nome do Usuário"
  }
}
```

### Eventos

#### GET /events
Lista eventos do usuário
```
Query params:
  - start_date: Data inicial (ISO 8601)
  - end_date: Data final (ISO 8601)
  - category_id: Filtro por categoria
  - page: Número da página
  - limit: Itens por página
```

#### POST /events
Cria novo evento
```json
{
  "title": "Reunião",
  "description": "Reunião de planejamento",
  "start_date": "2025-01-15T10:00:00Z",
  "end_date": "2025-01-15T11:00:00Z",
  "category_id": 1,
  "location": "Sala 5",
  "is_recurring": false
}
```

#### PUT /events/:id
Atualiza evento

#### DELETE /events/:id
Remove evento

### Tarefas

#### GET /tasks
Lista tarefas

#### POST /tasks
Cria tarefa
```json
{
  "title": "Comprar mantimentos",
  "description": "Lista de compras",
  "due_date": "2025-01-20T18:00:00Z",
  "priority": "high",
  "category_id": 2
}
```

#### PATCH /tasks/:id/complete
Marca tarefa como completa

### IA & Sugestões

#### GET /ai/suggestions
Obtém sugestões de IA

#### POST /ai/schedule
Agendamento inteligente

#### GET /ai/productivity
Analytics de produtividade

### Colaboração

#### POST /collaboration/polls
Cria enquete de agendamento

#### POST /collaboration/delegate
Delega tarefa

#### GET /collaboration/availability
Verifica disponibilidade

---

## 🏗️ Arquitetura

### Padrões e Princípios

- **SOLID**: Princípios de design orientado a objetos
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **Clean Architecture**: Separação de camadas
- **Repository Pattern**: Abstração de dados
- **Service Layer**: Lógica de negócio isolada

### Frontend Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Components, Pages, Layouts)       │
├─────────────────────────────────────┤
│         Application Layer           │
│  (Services, State Management)       │
├─────────────────────────────────────┤
│           Domain Layer              │
│  (Models, Business Logic)           │
├─────────────────────────────────────┤
│        Infrastructure Layer         │
│  (HTTP, Storage, External APIs)     │
└─────────────────────────────────────┘
```

### Backend Architecture

```
┌─────────────────────────────────────┐
│         Routes Layer                │
│  (Express Routes, Middleware)       │
├─────────────────────────────────────┤
│       Controllers Layer             │
│  (Request/Response Handling)        │
├─────────────────────────────────────┤
│        Services Layer               │
│  (Business Logic)                   │
├─────────────────────────────────────┤
│     Data Access Layer               │
│  (Database Queries, Models)         │
└─────────────────────────────────────┘
```

### Database Schema

```sql
-- Principais tabelas
users (id, email, password, name, preferences, created_at)
events (id, user_id, title, start_date, end_date, ...)
tasks (id, user_id, title, due_date, priority, ...)
categories (id, user_id, name, color, icon)
privacy_settings (id, user_id, settings, ...)
ai_insights (id, user_id, type, data, ...)
collaboration (id, owner_id, shared_with, ...)
wellness_data (id, user_id, metrics, ...)
```

---

## 🧪 Testes

### Frontend

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:coverage

# Testes e2e
npm run e2e
```

### Backend

```bash
cd backend

# Testes unitários
npm test

# Testes com watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Estrutura de Testes

```
├── src/
│   ├── services/
│   │   ├── burnout-detector.service.ts
│   │   └── __tests__/
│   │       └── burnout-detector.service.test.ts
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, siga estas diretrizes:

### 1. Fork & Clone

```bash
git clone https://github.com/seu-usuario/smart-calendar.git
cd smart-calendar
git checkout -b feature/nova-funcionalidade
```

### 2. Desenvolvimento

- Siga os padrões de código existentes
- Escreva testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use commits semânticos (Conventional Commits)

### 3. Commits Semânticos

```bash
feat: adiciona nova funcionalidade X
fix: corrige bug Y
docs: atualiza documentação
style: formatação de código
refactor: refatoração do módulo Z
test: adiciona testes
chore: atualiza dependências
```

### 4. Pull Request

```bash
git push origin feature/nova-funcionalidade
```

Abra um PR com:
- Descrição clara das mudanças
- Screenshots (se aplicável)
- Referência a issues relacionadas

---

## 📖 Documentação Adicional

- [Guia de Responsividade](RESPONSIVE_GUIDE.md)
- [Integração n8n](n8n-nodes-agenda-rapido/README.md)
- [API Reference](API_REFERENCE.md) *(em breve)*
- [Contributing Guide](CONTRIBUTING.md) *(em breve)*

---

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/seu-usuario/smart-calendar/issues) com:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Versão do navegador/SO

---

## 💡 Roadmap

### v1.1 (Q1 2025)
- [ ] Suporte a múltiplos idiomas (i18n)
- [ ] Notificações push web
- [ ] Modo offline completo
- [ ] Importação de calendários (ICS)

### v1.2 (Q2 2025)
- [ ] App mobile nativo (React Native)
- [ ] Assistente de voz
- [ ] Integração com Notion
- [ ] API pública com rate limiting

### v2.0 (Q3 2025)
- [ ] Workspaces corporativos
- [ ] Permissões avançadas
- [ ] Analytics para empresas
- [ ] White-label customizável

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2025 Smart Calendar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👥 Time

Desenvolvido com ❤️ por [Joaz Rodrigues](https://github.com/joaz0)

---

## 🙏 Agradecimentos

- [Angular Team](https://angular.io/)
- [Material Design](https://material.angular.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Node.js Community](https://nodejs.org/)
- Todos os [contribuidores](https://github.com/seu-usuario/smart-calendar/graphs/contributors)

---

## 📞 Contato

- Website: [https://smart-calendar.com](https://smart-calendar.com)
- Email: contato@smart-calendar.com
- Twitter: [@SmartCalendar](https://twitter.com/SmartCalendar)
- Discord: [Comunidade Smart Calendar](https://discord.gg/smart-calendar)

---

<div align="center">

**[⬆ Voltar ao topo](#-smart-calendar---sistema-de-agenda-inteligente)**

Feito com ❤️ usando Angular + Node.js

⭐ Se este projeto te ajudou, considere dar uma estrela!

</div>
