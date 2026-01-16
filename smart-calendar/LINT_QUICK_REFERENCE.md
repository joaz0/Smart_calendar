# 🚀 Comandos Rápidos - Correção de Lint

## 📊 Verificação

### Contar total de erros
```bash
npm run lint 2>&1 | grep "error" | wc -l
```

### Top 10 tipos de erros
```bash
npm run lint 2>&1 | grep -o "@[^/]*/[^ ]*" | sort | uniq -c | sort -nr | head -10
```

### Arquivos com mais erros
```bash
npm run lint 2>&1 | grep "error" | cut -d':' -f1 | sort | uniq -c | sort -nr | head -10
```

### Ver erros de um arquivo específico
```bash
npm run lint 2>&1 | grep "caminho/do/arquivo.ts"
```

## 🔧 Correções Automáticas

### Script de correção em lote (criado)
```bash
node fix-lint-batch.js
```

### Lint com auto-fix
```bash
npm run lint -- --fix
```

### Organizar imports (VSCode)
```
Ctrl+Shift+P → "Organize Imports"
```

## 🔄 Migrações do Angular

### Migrar para inject()
```bash
ng generate @angular/core:inject --path=src/app --defaults
```

### Migrar para control flow (já executado)
```bash
ng generate @angular/core:control-flow --path=src/app --defaults
```

## 🎯 Correções Específicas

### Substituir any por unknown em arquivo
```bash
sed -i 's/: any\b/: unknown/g' arquivo.ts
sed -i 's/Promise<any>/Promise<unknown>/g' arquivo.ts
sed -i 's/Observable<any>/Observable<unknown>/g' arquivo.ts
```

### Adicionar comentário em função vazia
```typescript
// ANTES
onInit() {}

// DEPOIS
onInit() {
  // Implementação vazia intencional
}
```

### Prefixar variável não utilizada
```typescript
// ANTES
function example(param: string) { ... }

// DEPOIS
function example(_param: string) { ... }
```

## 📝 Correções de Acessibilidade

### Adicionar eventos de teclado
```html
<!-- ANTES -->
<div (click)="action()">Click</div>

<!-- DEPOIS -->
<div 
  (click)="action()"
  (keyup.enter)="action()"
  (keyup.space)="action()"
  tabindex="0"
  role="button">
  Click
</div>
```

### Associar label com input
```html
<!-- ANTES -->
<label>Nome</label>
<input type="text">

<!-- DEPOIS -->
<label for="nome">Nome</label>
<input id="nome" type="text">
```

## 🛠️ Scripts Úteis

### Menu interativo
```bash
./lint-helper.sh
```

### Verificar progresso
```bash
echo "Erros antes: 500+"
echo "Erros agora: $(npm run lint 2>&1 | grep 'error' | wc -l)"
```

### Backup antes de correções
```bash
git add .
git commit -m "backup: antes de correções de lint"
```

## 📋 Checklist de Correção

- [x] Erros de parsing resolvidos
- [x] Script de correção automática criado
- [x] Migração de control flow executada
- [ ] Migração para inject()
- [ ] Correções de acessibilidade
- [ ] Substituir any restantes
- [ ] Remover imports não utilizados
- [ ] Verificação final

## 🎨 Configuração ESLint (Opcional)

### Desabilitar regra temporariamente
```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn", // error → warn
    "@angular-eslint/prefer-inject": "off" // desabilitar
  }
}
```

### Desabilitar em arquivo específico
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
// código aqui
/* eslint-enable @typescript-eslint/no-explicit-any */
```

### Desabilitar em linha específica
```typescript
const data: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
```

## 📚 Referências

- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript ESLint](https://typescript-eslint.io/rules/)
- [Angular ESLint](https://github.com/angular-eslint/angular-eslint)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 💡 Dicas

1. **Sempre faça backup antes de correções em massa**
   ```bash
   git commit -am "backup antes de lint fixes"
   ```

2. **Corrija por categoria, não por arquivo**
   - Mais eficiente
   - Menos conflitos
   - Melhor rastreamento

3. **Use migrações automáticas do Angular primeiro**
   - Maior impacto
   - Menos trabalho manual
   - Menos erros

4. **Teste após cada lote de correções**
   ```bash
   npm run build
   npm test
   ```

5. **Documente mudanças significativas**
   - Facilita revisão
   - Ajuda equipe
   - Histórico claro

## 🚨 Avisos

⚠️ **Não execute correções automáticas sem backup**
⚠️ **Teste o código após correções em massa**
⚠️ **Revise mudanças antes de commit**
⚠️ **Algumas correções podem quebrar funcionalidades**

## ✅ Validação Final

```bash
# 1. Verificar erros
npm run lint

# 2. Compilar
npm run build

# 3. Testar
npm test

# 4. Executar aplicação
npm start
```

---

**Criado em:** $(date)
**Versão:** 1.0
**Autor:** Amazon Q
