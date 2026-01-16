# 🚀 Guia de Implementação - Melhorias Smart Calendar

## ✅ Arquivos Criados

### 1. OpenAPI Specification
**Arquivo:** `backend/openapi.yaml`
- Especificação completa dos endpoints
- Schemas de dados
- Respostas de erro padronizadas

### 2. Retry Logic com Exponential Backoff
**Arquivo:** `src/app/utils/retry-utils.ts`

**Uso:**
```typescript
import { retryWithBackoff } from '@/utils/retry-utils';

this.http.get('/api/data').pipe(
  retryWithBackoff({ maxRetries: 3, delay: 1000, backoffMultiplier: 2 })
).subscribe();
```

### 3. Cache Service
**Arquivo:** `src/app/core/services/cache.service.ts`

**Uso:**
```typescript
// Salvar
cacheService.set('userProfile', data, 10); // 10 minutos

// Recuperar
const cached = cacheService.get<UserProfile>('userProfile');

// Limpar
cacheService.clear('userProfile');
```

### 4. Skeleton Loader Component
**Arquivo:** `src/app/shared/components/skeleton-loader/skeleton-loader.component.ts`

**Uso:**
```html
<app-skeleton-loader width="100%" height="60px"></app-skeleton-loader>
<app-skeleton-loader width="40px" height="40px" [circle]="true"></app-skeleton-loader>
```

### 5. Main-Layout Unit Tests
**Arquivo:** `src/app/layouts/main-layout/main-layout.spec.ts`

**Executar:**
```bash
npm test
```

## 📋 Próximos Passos

### 1. Integrar Cache no Main-Layout
```typescript
// Em main-layout.ts, adicionar:
import { CacheService } from '../../core/services/cache.service';
import { retryWithBackoff } from '../../utils/retry-utils';

constructor(
  // ... outros serviços
  private cacheService: CacheService
) {}

private loadUserData() {
  const cached = this.cacheService.get<UserProfile>('userProfile');
  if (cached) {
    this.user = cached;
    return;
  }

  this.userService.getProfile().pipe(
    retryWithBackoff({ maxRetries: 3 }),
    // ...
  ).subscribe(profile => {
    this.cacheService.set('userProfile', profile, 10);
  });
}
```

### 2. Usar Skeleton Loader
```html
<!-- Em main-layout.html -->
@if (isLoading) {
  <app-skeleton-loader width="100%" height="60px"></app-skeleton-loader>
} @else {
  <app-header [user]="currentUser"></app-header>
}
```

### 3. Implementar Endpoints Backend
```typescript
// Em backend/src/routes/user.routes.ts
router.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const profile = await getUserProfile(userId);
  res.json({ success: true, data: profile });
});

router.get('/stats', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const stats = await getUserStats(userId);
  res.json({ success: true, data: stats });
});
```

### 4. Migrar para Signals (Opcional)
```typescript
// Substituir BehaviorSubject por signal
import { signal } from '@angular/core';

// Antes
private userSubject = new BehaviorSubject<User | null>(null);
user$ = this.userSubject.asObservable();

// Depois
user = signal<User | null>(null);
```

## 🧪 Testes

### Executar Testes Unitários
```bash
npm test
```

### Executar Testes E2E
```bash
npm run e2e
```

### Coverage
```bash
npm run test:coverage
```

## 📊 Monitoramento

### Adicionar Sentry (Opcional)
```bash
npm install @sentry/angular
```

```typescript
// Em app.config.ts
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: "YOUR_DSN",
  environment: environment.production ? 'production' : 'development'
});
```

## 🔧 Comandos Úteis

```bash
# Gerar componente com testes
ng generate component nome --standalone

# Executar lint
npm run lint

# Build de produção
npm run build

# Servir aplicação
npm start
```

## 📚 Referências

- [Angular Signals](https://angular.io/guide/signals)
- [RxJS Retry Strategies](https://rxjs.dev/api/operators/retryWhen)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Angular Testing](https://angular.io/guide/testing)

---

**Status:** ✅ Implementações base concluídas
**Próximo:** Integrar nos componentes existentes
