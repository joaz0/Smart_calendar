# 🔧 Plano de Correção ESLint - Smart Calendar

## 📊 Status Atual
- **Total de Erros:** ~1109
- **Arquivos Afetados:** 78+
- **Correções Automáticas Aplicadas:** 4 fases

## ✅ Correções Já Aplicadas

### Fase 1: Tipos Inferíveis ✅
```bash
# Removido anotações de tipo triviais
# Antes: const name: string = 'value'
# Depois: const name = 'value'
```

### Fase 2: Unused Variables em Pipes ✅
```typescript
// Antes: transform(value, args)
// Depois: transform(_value, _args)
```

### Fase 3: hasOwnProperty ✅
```typescript
// Antes: obj.hasOwnProperty(key)
// Depois: Object.prototype.hasOwnProperty.call(obj, key)
```

### Fase 4: Case Declarations ✅
```typescript
// Adicionado blocos em case statements
```

## 🎯 Próximas Correções Prioritárias

### 1. Control Flow Migration (120+ erros) 🔴 CRÍTICO

**Comando Angular CLI:**
```bash
ng generate @angular/core:control-flow
```

**Conversão Manual (se necessário):**
```typescript
// ANTES
<div *ngIf="condition">Content</div>
<div *ngFor="let item of items">{{item}}</div>

// DEPOIS
@if (condition) {
  <div>Content</div>
}
@for (item of items; track item.id) {
  <div>{{item}}</div>
}
```

**Arquivos Prioritários:**
1. `app.html` - 5 erros
2. `sidebar.html` - 15+ erros
3. `week-view.html` - 48 erros
4. `task-form.html` - 10 erros
5. `event-form.html` - 30 erros

### 2. Inject() Migration (50+ erros) 🟡 ALTA

**Comando Angular CLI:**
```bash
ng generate @angular/core:inject
```

**Conversão Manual:**
```typescript
// ANTES
constructor(
  private router: Router,
  private service: MyService
) {}

// DEPOIS
private router = inject(Router);
private service = inject(MyService);
```

**Arquivos Prioritários:**
1. `app.ts` - 4 erros
2. `main-layout.ts` - 8 erros
3. `auth.interceptor.ts` - 2 erros
4. `base-modal.component.ts` - 2 erros

### 3. TypeScript Any (165+ erros) 🔵 MÉDIA

**Estratégia:**
1. Criar interfaces globais
2. Substituir `any` por tipos específicos
3. Usar `unknown` quando tipo é realmente desconhecido

**Interfaces Necessárias:**
```typescript
// src/app/core/models/common.types.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type FormValue = Record<string, unknown>;
export type QueryParams = Record<string, string | number | boolean>;
```

**Arquivos Prioritários:**
1. `base-form.component.ts` - 11 erros
2. `converters.ts` - 14 erros
3. `week-view.ts` - 38 erros

### 4. Empty Functions (20+ erros) 🟢 BAIXA

**Correção:**
```typescript
// ANTES
subscribe() {}

// DEPOIS
subscribe(): void {
  // Implementação futura
}
// OU remover se não usado
```

### 5. No Output Native (5+ erros) 🟢 BAIXA

**Correção:**
```typescript
// ANTES
@Output() change = new EventEmitter();

// DEPOIS
@Output() valueChange = new EventEmitter();
```

## 📝 Script de Migração Completo

### migrate-control-flow.sh
```bash
#!/bin/bash
# Migra *ngIf/*ngFor para @if/@for

find src/app -name "*.html" -type f | while read file; do
  # Backup
  cp "$file" "$file.bak"
  
  # Conversões básicas
  sed -i 's/<div \*ngIf="/@if (/g' "$file"
  sed -i 's/<div \*ngFor="let /@for (/g' "$file"
  
  echo "Processado: $file"
done
```

### migrate-inject.sh
```bash
#!/bin/bash
# Migra constructor injection para inject()

find src/app -name "*.ts" -type f | while read file; do
  # Detecta e converte constructors
  # (Requer processamento mais complexo)
  echo "Analisando: $file"
done
```

## 🧪 Validação Pós-Correção

### Checklist
- [ ] `npm run lint` sem erros
- [ ] `npm run build` bem-sucedido
- [ ] `npm test` todos os testes passando
- [ ] Aplicação funciona em dev (`ng serve`)
- [ ] Aplicação funciona em prod (`ng build --configuration=production`)

### Testes Manuais
1. Login/Logout
2. Navegação entre rotas
3. CRUD de eventos/tarefas
4. Sidebar collapse/expand
5. Tema claro/escuro

## 📊 Progresso Estimado

| Fase | Erros | Tempo | Status |
|------|-------|-------|--------|
| Tipos Inferíveis | 50 | 10min | ✅ Concluído |
| Unused Vars | 20 | 5min | ✅ Concluído |
| hasOwnProperty | 15 | 5min | ✅ Concluído |
| Case Declarations | 10 | 5min | ✅ Concluído |
| Control Flow | 120 | 2h | ⏳ Pendente |
| Inject() | 50 | 1h | ⏳ Pendente |
| TypeScript Any | 165 | 3h | ⏳ Pendente |
| Empty Functions | 20 | 30min | ⏳ Pendente |
| Outros | 659 | 4h | ⏳ Pendente |

**Total:** ~11 horas de trabalho

## 🚀 Execução Recomendada

### Dia 1 (4h)
1. ✅ Correções automáticas (concluído)
2. Control Flow nos componentes principais
3. Inject() nos serviços core

### Dia 2 (4h)
1. TypeScript Any - criar interfaces
2. TypeScript Any - substituir nos componentes
3. Empty Functions

### Dia 3 (3h)
1. Correções restantes
2. Testes completos
3. Documentação

## 📞 Comandos Úteis

```bash
# Ver erros por categoria
npm run lint | grep "@angular-eslint/template/prefer-control-flow" | wc -l

# Ver erros por arquivo
npm run lint | grep "\.ts:" | sort | uniq -c | sort -rn

# Executar lint em arquivo específico
ng lint --files="src/app/app.ts"

# Executar correção automática
npm run lint -- --fix
```

## 🔗 Referências

- [Angular Control Flow](https://angular.io/guide/control-flow)
- [Angular inject()](https://angular.io/api/core/inject)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [ESLint Angular](https://github.com/angular-eslint/angular-eslint)

---

**Última Atualização:** 2025-01-15
**Próxima Revisão:** Após migração Control Flow
