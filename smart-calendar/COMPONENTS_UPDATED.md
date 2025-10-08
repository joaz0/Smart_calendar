# Componentes atualizados e convenções (atualização automática)

Resumo rápido
- Atualizei ~30 templates HTML para marcação semântica, melhores ARIA e identificadores para agentes de código.
- Objetivo: facilitar leitura por automações, melhorar semântica e preparar base para testes/estilização.

Componentes atualizados (exemplos mais relevantes)
- Layouts:
  - `src/app/layouts/main-layout/main-layout.html` (header, aside, main, footer)
  - `src/app/layouts/auth-layout/auth-layout.html`
- Shared components:
  - `src/app/shared/components/header/header.html`
  - `src/app/shared/components/sidebar/sidebar.html`
  - `src/app/shared/components/search-bar/search-bar.html`
  - `src/app/shared/components/loading-spinner/loading-spinner.html`
  - `src/app/shared/components/not-found/not-found.html`
- Tasks:
  - `src/app/features/tasks/task-list/task-list.html`
  - `src/app/features/tasks/task-form/task-form.html`
  - `src/app/features/tasks/task-item/task-item.html`
- Events / Calendar (exemplos):
  - `src/app/features/events/event-list/event-list.html`
  - `src/app/features/events/event-details/event-details.html`
  - `src/app/features/calendar/calendar-view/calendar-view.html`
  - `src/app/features/calendar/day-view/day-view.html`
  - `src/app/features/calendar/week-view/week-view.html`
- Colaboração / Integrações / IA (placeholders seguros quando o TS não expôs APIs):
  - `src/app/features/collaboration/*` (dashboard, team-overview, delegation, polls, quick-links)
  - `src/app/features/integrations/*` (video-call-quick-add, messaging-settings, document-attachment-manager, contact-sync-settings)
  - `src/app/features/ai-assistant/*` (ai-scheduling-assistant, ai-suggestions-panel, daily-ai-summary, travel-time-calculator, intelligent-task-scheduler)

Regras de naming e convenções aplicadas
- data-component: adicionei `data-component="ComponentName"` em cada template para que agentes e buscas localizem rapidamente o componente (ex.: `<div data-component="TaskList">`). Use esse nome como referência quando criar testes ou scripts automatizados.
- Semântica: preferir elementos HTML5 (header, main, nav, section, article, footer, aside) em vez de divs genéricas quando fizer sentido.
- ARIA: quando aplicável, adicionei `role`, `aria-label` e `aria-live` mínimos para elementos interativos (botões, formulários, overlays).
- Placeholders: onde o template original dependia fortemente de bindings ou de componentes não importados, substituí por placeholders textuais (`data-placeholder`) para evitar erros de build enquanto se faz a integração completa.

Notas sobre o build
- Rodei `npm run build -- --configuration development` no diretório `smart-calendar/` e obtive erros de compilação (diversos) — detalhes completos no log de build.
- Causas principais detectadas:
  - Mistura de componentes "standalone" declarados em NgModules (erros NG6008/NG6007).
  - Templates usando pipes (`date`) e diretivas (`ngModel`, `formGroup`) sem os módulos/imports adequados expostos em componentes (ex.: falta de `CommonModule`, `FormsModule`, `ReactiveFormsModule` ou `DatePipe` no array de imports de componentes standalone).
  - Algumas declarações/TS incorretas no código original (ex.: uso incorreto de `constructor(private, snackBar, MatSnackBar);` e top-level await em `notification.service.ts`).

Próximos passos sugeridos (escolha uma):
1. Corrigir compilação por áreas: resolver primeiro os problemas mais críticos (Calendar module + declarações duplicadas). Posso implementar isso em commits pequenos e testar o build após cada grupo.
2. Fazer uma passada para garantir que cada template usa apenas bindings que existam no `.ts` correspondente (adicionar `*ngIf` defensivos ou ajustar templates para `?` safe navigation).
3. Reverter placeholders temporários para implementações completas assim que os serviços/inputs/outputs estejam prontos no TypeScript.

Se quiser que eu comece a corrigir os erros do build, diga qual opção prefere (1 ou 2) e eu começo pelo topo-prioritário (Calendar module é o que gera mais erros agora). Se preferir revisar a lista de templates atualizados primeiro, posso gerar um diff separado.

Arquivo gerado automaticamente — revise e diga se quer que eu o adicione ao README principal.
