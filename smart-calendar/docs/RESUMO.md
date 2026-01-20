# Resumo de Status

Este arquivo resume onde o trabalho parou e o que mudou nesta rodada.

## O que mudou
- Migracao de SCSS: trocado `@import` por `@use` nos arquivos SCSS, mantendo o import de tema CSS em `src/styles.scss`.
- Ajustes de mixed-decls no Sass: declaracoes movidas para `& {}` apos regras aninhadas em `_mixins.scss` e alguns estilos de componentes.
- Tipagem e pequenos fixes em TypeScript para reduzir erros de compilacao em services e componentes (ex: ApiService, Event/Task API, EventsComponent, MainLayout, Dashboard, Settings, SearchBar, Sidebar, Header).

## Pendencias / checagens sugeridas
- Rodar `ng build` ou `ng serve` para confirmar se nao restaram warnings/erros.
- Se `ApiService` precisar de `responseType` diferente de `json`, revisar a tipagem de `HttpOptions`.

