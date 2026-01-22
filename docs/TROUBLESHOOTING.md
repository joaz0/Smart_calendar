# Troubleshooting - Smart Calendar

## 🔧 Problemas Comuns

### Backend não inicia

#### Erro: "Cannot connect to database"
```bash
# Verificar PostgreSQL rodando
sudo systemctl status postgresql

# Verificar DATABASE_URL no .env
echo $DATABASE_URL

# Testar conexão
psql -U postgres -d smart_calendar
```

#### Erro: "Port 3000 already in use"
```bash
# Encontrar processo
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou usar outra porta
PORT=3001 npm run dev
```

#### Erro: "JWT_SECRET not defined"
```bash
# Gerar secret
openssl rand -base64 32

# Adicionar ao .env
echo "JWT_SECRET=<generated-secret>" >> .env
```

---

### Frontend não conecta ao backend

#### Erro: "CORS policy blocked"
```typescript
// Verificar CORS_ORIGIN no backend .env
CORS_ORIGIN=http://localhost:4200

// Verificar apiUrl no frontend
// src/environments/environment.ts
apiUrl: 'http://localhost:3000/api'
```

#### Erro: "401 Unauthorized"
```typescript
// Verificar token no localStorage
localStorage.getItem('token')

// Fazer login novamente
// Verificar interceptor de auth
```

#### Erro: "Network Error"
```bash
# Verificar backend rodando
curl http://localhost:3000/health

# Verificar firewall
sudo ufw status
```

---

### Migrações falham

#### Erro: "relation already exists"
```bash
# Dropar banco e recriar
dropdb smart_calendar
createdb smart_calendar

# Rodar migrações
npm run migrate
```

#### Erro: "permission denied"
```sql
-- Dar permissões ao usuário
GRANT ALL PRIVILEGES ON DATABASE smart_calendar TO smart_calendar_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO smart_calendar_user;
```

---

### Build falha

#### Frontend
```bash
# Limpar cache
rm -rf .angular/cache
rm -rf node_modules
npm install

# Build novamente
npm run build
```

#### Backend
```bash
# Limpar dist
rm -rf dist
npm run build

# Verificar erros TypeScript
npx tsc --noEmit
```

---

### Deploy falha

#### Render
```bash
# Verificar logs
# Dashboard → Logs

# Verificar variáveis de ambiente
# Dashboard → Environment

# Rodar migrações manualmente
# Shell → npm run migrate
```

#### Netlify
```bash
# Verificar build logs
# Deploys → Deploy log

# Verificar publish directory
# dist/smart-calendar/browser

# Limpar cache e rebuild
# Deploys → Trigger deploy → Clear cache
```

---

### Performance

#### Frontend lento
```typescript
// Usar trackBy em *ngFor
<div *ngFor="let item of items; trackBy: trackById">

trackById(index: number, item: any) {
  return item.id;
}

// Lazy loading de módulos
loadChildren: () => import('./module').then(m => m.Module)

// OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

#### Backend lento
```sql
-- Adicionar índices
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_start_date ON events(start_date);

-- Verificar queries lentas
EXPLAIN ANALYZE SELECT * FROM events WHERE user_id = 1;
```

---

### Testes falham

#### Frontend
```bash
# Atualizar snapshots
npm test -- -u

# Rodar teste específico
npm test -- --testNamePattern="ComponentName"
```

#### Backend
```bash
# Usar banco de teste
NODE_ENV=test npm test

# Coverage
npm run test:coverage
```

---

### PWA não funciona

#### Service Worker não registra
```typescript
// Verificar em production build
cd smart-calendar/frontend
ng build --configuration=production

// Servir localmente
npx http-server dist/smart-calendar/browser -p 8080

// Verificar em DevTools → Application → Service Workers
```

#### Offline não funciona
```typescript
// Verificar cache strategy no service-worker.js
// Limpar cache
// DevTools → Application → Clear storage
```

---

### N8N Integration

#### Webhook não dispara
```bash
# Verificar URL do webhook
curl -X POST https://n8n.example.com/webhook/test

# Verificar logs do n8n
# n8n logs

# Testar localmente
N8N_URL=http://localhost:5678 npm run dev
```

---

## 🆘 Ainda com problemas?

1. Verificar logs:
   - Backend: `npm run dev` (console)
   - Frontend: DevTools → Console
   - Render: Dashboard → Logs
   - Netlify: Deploys → Deploy log

2. Verificar issues no GitHub:
   - https://github.com/joaz0/smart-calendar/issues

3. Criar nova issue:
   - Descrever problema
   - Incluir logs
   - Passos para reproduzir
   - Ambiente (OS, Node version, etc)

4. Contato:
   - Email: joaz.rodrigues@example.com
   - GitHub Discussions
