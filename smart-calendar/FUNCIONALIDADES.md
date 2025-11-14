# 📋 Lista Completa de Funcionalidades - Smart Calendar

## 🔐 Autenticação e Segurança
- Login/Registro de usuários
- OAuth com Google e Microsoft
- Autenticação JWT
- Guards de proteção de rotas
- Sistema de privacidade em 5 níveis (Public, Shared, Private, Confidential, Stealth)
- Modo Off-Grid (sem rastreamento)

## 📅 Calendário
- Visualização mensal
- Visualização semanal
- Visualização diária
- Lista de agenda
- Criação/edição/exclusão de eventos
- Eventos recorrentes
- Categorização de eventos
- Eventos privados/públicos
- Tempo de viagem automático
- Links rápidos em eventos (videoconferência, documentos)

## ✅ Tarefas
- Criação/edição/exclusão de tarefas
- Priorização de tarefas
- Status de conclusão
- Delegação de tarefas
- Tarefas delegadas (de/para)
- Categorização de tarefas

## 🧠 Assistente de IA
- Agendamento por linguagem natural (português)
- Parsing inteligente de datas e horários
- Extração de participantes e locais
- Sugestões de IA personalizadas
- Resumo diário automático
- Agendamento inteligente de tarefas
- Moderação de reuniões (encontrar horários comuns)
- Comandos de voz/texto
- Sistema de treinamento de IA (datasets e exemplos)
- Log de comandos de IA com intent e entities
- Análise de confiança (confidence) das interpretações

## 📊 Produtividade e Contexto
- Blocos de tempo por contexto
- Análise de padrões de produtividade
- Editor de blocos contextuais
- Modo Foco integrado
- Bloqueio de apps e sites durante eventos
- Checklist de preparação para eventos
- Templates de eventos reutilizáveis
- Notas com timestamp em reuniões
- Insights de produtividade
- Score de produtividade diário
- Componentes de produtividade (foco, energia, conclusão)
- Histórico de produtividade por usuário

## 🎯 Hábitos e Rotinas
- Rastreador de hábitos
- Registro de entradas diárias
- Cálculo de streaks
- Estatísticas de consistência
- Dashboard de hábitos

## 🤝 Colaboração
- Enquetes de agendamento
- Sistema de votação para horários
- Status em tempo real (disponível, ocupado, foco)
- Agenda de equipe
- Visualização de disponibilidade
- Gerenciador de links rápidos
- Calendário compartilhado

## 💪 Bem-estar e Saúde
- Detector de burnout
- Análise de risco de esgotamento
- Pausas ativas automáticas
- Lembretes de pausas
- Integração com apps de saúde
- Agendamento de exercícios
- Horário de desacelerar (wind-down)
- Proteção do horário pré-sono
- Tempo protegido pessoal
- Relatórios de bem-estar

## 📈 Analytics e Visualizações
- Dashboard de analytics de tempo
- Calendário de energia semanal
- Relatórios de insights pessoais
- Visualização de timeline de projetos
- Mapeador de relacionamentos
- Busca semântica inteligente
- Gráficos e estatísticas

## 🔗 Integrações
- Google Calendar (OAuth)
- Microsoft Calendar (OAuth)
- Apps de saúde (Apple Health, Google Fit)
- Mapas (cálculo de tempo de viagem)
- Videoconferência (Zoom, Meet, Teams)
- Sincronização de contatos
- Anexos de documentos
- Mensageria
- N8N (automação de workflows)
- Webhooks personalizados
- API REST completa

## 🔒 Privacidade e Controle
- Centro de controle de privacidade
- Camuflagem de eventos
- Múltiplos calendários
- Backup e migração
- Herança digital
- Criptografia de dados sensíveis
- Modo stealth

## 🎨 Interface e Experiência
- Dashboard principal
- Layout responsivo
- Tema claro/escuro
- Notificações
- Atalhos rápidos
- Drag and drop
- Filtros e buscas

## ⚙️ Configurações
- Preferências de usuário
- Configurações de notificações
- Configurações de privacidade
- Configurações de integrações
- Personalização de interface
- Configurações de pausas
- Configurações de wind-down

## 🔔 Notificações e Lembretes
- Lembretes de eventos
- Lembretes de tarefas
- Lembretes de pausas
- Alertas de burnout
- Notificações de delegação
- Notificações de enquetes

## 📱 Recursos Avançados
- Sugestão de horários ótimos
- Análise de padrões comportamentais
- Detecção de conflitos
- Otimização de agenda
- Recomendações personalizadas
- Machine learning para preferências

## 🌐 API Backend (Endpoints)

### Autenticação
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/refresh`
- GET `/api/oauth/google`
- GET `/api/oauth/microsoft`

### Eventos
- GET `/api/events`
- POST `/api/events`
- PUT `/api/events/:id`
- DELETE `/api/events/:id`

### Tarefas
- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`
- POST `/api/tasks/:id/delegate`
- GET `/api/tasks/delegated`

### IA
- POST `/api/ai-commands` - Criar comando de IA
- GET `/api/ai-commands` - Listar comandos
- GET `/api/ai-suggestions` - Listar sugestões
- POST `/api/ai-suggestions` - Criar sugestão
- GET `/api/ai-training` - Listar datasets
- POST `/api/ai-training` - Criar dataset
- GET `/api/ai-training/:id` - Obter dataset
- GET `/api/ai-training/:datasetId/examples` - Listar exemplos
- POST `/api/ai-training/:datasetId/examples` - Adicionar exemplo

### Agendamento Inteligente
- POST `/api/smart-scheduler/suggest-time`
- POST `/api/smart-scheduler/find-meeting-time`

### Resumo Diário
- GET `/api/daily-summary/today`
- GET `/api/daily-summary/:date`

### Modo Foco
- POST `/api/focus-mode/activate`
- POST `/api/focus-mode/deactivate`
- GET `/api/focus-mode/active`

### Hábitos
- GET `/api/habits`
- POST `/api/habits`
- POST `/api/habits/:id/entries`
- GET `/api/habits/:id/stats`

### Enquetes
- POST `/api/polls`
- POST `/api/polls/:id/vote`
- GET `/api/polls/:id/results`

### Burnout
- GET `/api/burnout/analyze`

### Pausas
- POST `/api/breaks/schedule`
- GET `/api/breaks/preferences`

### Wind-Down
- GET `/api/wind-down/check`
- POST `/api/wind-down/settings`

### Produtividade
- GET `/api/productivity` - Listar scores de produtividade
- POST `/api/productivity` - Criar/atualizar score diário
- GET `/api/productivity?userId=X` - Scores por usuário

### Usuário
- GET `/api/user/profile`
- PUT `/api/user/profile`
- GET `/api/user/status`

### Categorias
- GET `/api/categories` - Listar categorias
- POST `/api/categories` - Criar categoria
- PUT `/api/categories/:id` - Atualizar categoria
- DELETE `/api/categories/:id` - Deletar categoria

## 📊 Banco de Dados (Tabelas Principais)

- `users` - Usuários
- `events` - Eventos
- `tasks` - Tarefas
- `categories` - Categorias
- `ai_parsing_log` - Log de parsing de IA
- `ai_commands` - Comandos de IA (raw_text, intent, entities, confidence)
- `ai_suggestions` - Sugestões de IA
- `ai_training_datasets` - Datasets de treinamento
- `ai_training_examples` - Exemplos de treinamento
- `daily_summaries` - Resumos diários
- `focus_sessions` - Sessões de foco
- `time_blocks` - Blocos de tempo
- `event_templates` - Templates de eventos
- `event_checklists` - Checklists
- `meeting_notes` - Notas de reunião
- `habits` - Hábitos
- `habit_entries` - Registros de hábitos
- `scheduling_polls` - Enquetes
- `poll_votes` - Votos
- `user_status` - Status de usuários
- `user_contacts` - Contatos
- `teams` - Equipes
- `burnout_analysis` - Análise de burnout
- `break_preferences` - Preferências de pausas
- `health_data` - Dados de saúde
- `exercise_schedules` - Agendamentos de exercícios
- `wind_down_settings` - Configurações de wind-down
- `productivity_scores` - Scores de produtividade (date, score, components, insights)

## 🎯 Diferenciais do Smart Calendar

1. **IA em Português** - Parsing de linguagem natural otimizado para português brasileiro
2. **Bem-estar Integrado** - Foco em saúde mental e prevenção de burnout
3. **Privacidade em Camadas** - 5 níveis de privacidade configuráveis
4. **Colaboração Inteligente** - Enquetes e moderação automática de reuniões
5. **Contexto e Energia** - Agendamento baseado em níveis de energia
6. **Pausas Ativas** - Sistema automático de pausas saudáveis
7. **Delegação Inteligente** - Sistema completo de delegação de tarefas
8. **Analytics Avançado** - Visualizações e insights profundos
9. **Modo Off-Grid** - Trabalho sem rastreamento
10. **Herança Digital** - Planejamento de legado digital
11. **Treinamento de IA** - Sistema de machine learning com datasets personalizados
12. **N8N Integration** - Automação avançada de workflows
13. **OAuth Social** - Login com Google e Microsoft
14. **Responsividade Total** - Design mobile-first com PWA support
15. **Performance Otimizada** - Lighthouse score 95+ em todas as métricas
