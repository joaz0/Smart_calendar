# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [2.0.0] - 2025-01-XX

### ✨ Adicionado
- PWA completo com service worker e offline mode
- Integração n8n para automações
- Sistema de design renovado com tokens SCSS
- Light mode com gradiente branco → lilás (#DAC8F7)
- Dark mode com gradiente preto → roxo (#5b0bdc)
- Theme toggle funcional com persistência
- Integração Google Calendar OAuth2
- Integração Health apps (Google Fit, Apple Health)
- Integração Video conferencing (Zoom, Meet, Teams)
- Sistema de webhooks completo
- Offline service com cache e sync
- 85+ serviços implementados no frontend
- WCAG 2.1 AA compliance
- Headers de segurança (CSP, XSS, Frame)
- Cache otimizado para assets estáticos
- Deploy automático (Render + Netlify)

### 🔧 Modificado
- Angular atualizado para 18.2.14
- Dependências críticas atualizadas (axios, joi, pg, jsonwebtoken)
- Estrutura de rotas otimizada
- Sistema de autenticação melhorado
- Rate limiting configurado (100 req/15min)
- CORS restritivo implementado

### 🐛 Corrigido
- Vulnerabilidades de segurança mitigadas
- Error handling melhorado
- Loading states corrigidos
- Date utils com suporte a segundos
- Privacy utils com sanitização aprimorada
- Notification utils com limites de setTimeout

### 📚 Documentação
- README.md atualizado para v2.0
- API_REFERENCE.md criado
- CONTRIBUTING.md criado
- SECURITY.md criado
- DEPLOY_GUIDE.md criado
- DESIGN_SYSTEM.md atualizado
- BACKEND_DOCUMENTATION.md atualizado

### 🔒 Segurança
- 0 vulnerabilidades em produção (backend)
- Mitigações aplicadas para Angular 18
- CSP headers configurados
- CORS restritivo
- Sanitização de inputs
- JWT com refresh tokens e RSA keys

---

## [1.0.0] - 2024-XX-XX

### ✨ Adicionado
- Sistema de autenticação JWT
- CRUD de eventos e tarefas
- Sistema de categorias
- Dashboard com estatísticas
- Calendário mensal/semanal/diário
- Filtros e busca
- Notificações
- Temas claro/escuro
- Responsividade mobile

### 🔧 Tecnologias
- Angular 18.2
- Node.js 20+
- PostgreSQL 15+
- TypeScript 5.5+
- Angular Material 18
- Express 4.18+

---

## Tipos de Mudanças
- `✨ Adicionado` - Novas features
- `🔧 Modificado` - Mudanças em features existentes
- `🐛 Corrigido` - Bug fixes
- `🗑️ Removido` - Features removidas
- `🔒 Segurança` - Vulnerabilidades corrigidas
- `📚 Documentação` - Mudanças na documentação
- `⚡ Performance` - Melhorias de performance
- `♻️ Refatoração` - Refatoração de código
