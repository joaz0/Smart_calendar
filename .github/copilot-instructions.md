## SmartCalendar — Instruções para agentes de código

Objetivo: ajudá-lo a entender rapidamente a arquitetura, convenções e fluxos de desenvolvimento deste repositório para que alterações práticas sejam feitas com segurança.

Resumo rápido

- Projeto composto por um front-end Angular (pasta `smart-calendar/`) e um backend Node/Express TypeScript (pasta `smart-calendar/backend/`).
- Front: Angular 20 (CLI), módulo principal em `src/app`, roteamento em `src/app/app.routes.ts` e `src/app/app.module.ts` — muitas rotas usam carregamento tardio (lazy-loaded modules).
- Back: Express + pg (Postgres). Entrypoint: `backend/src/server.ts`. DB pool em `backend/src/config/database.ts`. Rotas em `backend/src/routes/*` e controllers em `backend/src/controllers/*`.

Arquivos e padrões importantes (faça referência a eles ao editar):

- `smart-calendar/src/app/app.routes.ts` — define níveis de privacidade, guards (`core/guards/privacy.guard.ts`) e padrões de carregamento de módulos. Use como fonte ao adicionar novas rotas.
- `smart-calendar/src/app/app.module.ts` — lista módulos importados (ex.: `CalendarModule`). Evite duplicar providers que já são globais.
- `smart-calendar/backend/src/server.ts` — middlewares, CORS configurado para `http://localhost:4200`, health-check em `/health`.
- `smart-calendar/backend/src/config/database.ts` — configura Pool do `pg`. Variáveis de ambiente esperadas: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
- `smart-calendar/backend/package.json` e `smart-calendar/package.json` — scripts úteis:
  - Front: `npm start` (ng serve), `npm run build`, `npm test`.
  - Back: `npm run dev` (tsx watch src/server.ts), `npm run build` (tsc), `npm start` (node dist/server.js), `npm run db:setup`.

Convenções do projeto (observáveis no código)

- Roteamento: prefer lazy-loaded modules com `loadChildren` / `loadComponent`. Ao adicionar features, siga esse padrão para reduzir o bundle inicial.
- Guards e privacidade: as rotas carregadas adicionam meta `data` com `privacyLevel` e `context` (ver `app.routes.ts`). Ao modificar rotas, mantenha esses campos e não remova `privacyGuard` quando o recurso manipula dados sensíveis.
- API: endpoints REST simples sob `/api/events` e `/api/tasks`, controllers usam `pool.query` com prepared statements ($1, $2...). Reutilize esse padrão para evitar injeção SQL.
- Logging: servidor aplica um middleware de log simples em `server.ts` — mantenha mensagens semelhantes para consistência.

Fluxos de desenvolvimento e debugging

- Rodar front-end (dev):
  - Abra `smart-calendar/` e execute `npm install` (se necessário) e `npm start` (equivalente a `ng serve`). App: http://localhost:4200
- Rodar backend (dev):
  - Abra `smart-calendar/backend/`, execute `npm install` e `npm run dev`. O backend escuta porta `process.env.PORT` ou `3000`.
  - Verifique health: `GET http://localhost:3000/health`.
  - Banco: se usar `db:setup` (script `backend/src/scripts/setup-database.ts`) execute `npm run db:setup` para criar tabelas/fixtures — verifique `.env` para credenciais.
- Build & produção:
  - Backend: `npm run build` cria `dist/` e `npm start` roda `node dist/server.js`.
  - Front: `npm run build` (no `smart-calendar/`) gera `dist/`.

Testes e qualidade

- Front usa Karma/Jasmine (`ng test`). Não há testes backend por padrão.
- Código TypeScript: mantenha tipagens; controllers simples usam `any` em erros — preserve mensagens de erro em português já existentes.

Padrões de PR e mudanças seguras

- Ao modificar contrato da API, atualize ambos: controller (backend) e clientes que consomem (front) — busque por chamadas `HttpClient` no front (ex.: `core/services/event.service.ts`, `task.service.ts`).
- Ao adicionar variáveis de ambiente, documente-as em `README.md` e verifique `backend/src/config/database.ts`.

Exemplos concretos (pesquisar ao implementar mudanças)

- Para buscar eventos: `GET /api/events` mapeado em `backend/src/routes/event.routes.ts` -> `EventController.getAll`.
- Para busca com texto: `GET /api/events/search?q=termo` usa ILIKE no controller (`EventController.search`).

Limitações e o que NÃO presumir

- Não há arquivos de CI/CD ou deploy automáticos aqui — não altere pipelines que não existam.
- Não há testes de integração backend; mudanças em SQL e esquema exigirão instruções claras ao autor do PR.

Se precisar fazer uma mudança grande

- Atualize README do `smart-calendar/` com comandos e variáveis de ambiente.
- Inclua passos de teste manuais: como iniciar front + back, endpoints a verificar e fixtures DB (ex.: `db:setup`).

Perguntas rápidas para o revisor humano

- Há preferências por mensagens em PT-BR (o código já usa PT-BR) ou devemos padronizar para inglês?
- Quais serviços externos (se houver) devem ser simulados em dev (ex.: Oauth, integrações de saúde)?

Fim — peça feedback se algo ficou ambiguo ou incompleto.
