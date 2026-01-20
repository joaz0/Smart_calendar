# Guia de Deploy - Smart Calendar

## 🚀 Deploy Backend (Render.com)

### 1. Criar conta no Render
- Acesse https://render.com
- Conecte sua conta GitHub

### 2. Criar PostgreSQL Database
1. New → PostgreSQL
2. Name: `smart-calendar-db`
3. Database: `smart_calendar`
4. User: `smart_calendar_user`
5. Region: Oregon (Free)
6. Plan: Free
7. Copie o `DATABASE_URL` interno

### 3. Criar Web Service
1. New → Web Service
2. Connect repository: `smart-calendar`
3. Name: `smart-calendar-backend`
4. Region: Oregon
5. Branch: `master`
6. Root Directory: `smart-calendar/backend`
7. Environment: Node
8. Build Command: `npm install && npm run build`
9. Start Command: `npm start`

### 4. Configurar Environment Variables
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=[copiado do PostgreSQL]
JWT_SECRET=[gerar: openssl rand -base64 32]
JWT_REFRESH_SECRET=[gerar: openssl rand -base64 32]
CORS_ORIGIN=https://smart-calendar.netlify.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. Deploy
- Click "Create Web Service"
- Aguarde build (~5 min)
- Acesse: https://smart-calendar-backend.onrender.com/health

---

## 🌐 Deploy Frontend (Netlify)

### 1. Criar conta no Netlify
- Acesse https://netlify.com
- Conecte sua conta GitHub

### 2. Criar novo site
1. Add new site → Import existing project
2. Connect to Git provider: GitHub
3. Pick repository: `smart-calendar`
4. Configure:
   - Base directory: `smart-calendar`
   - Build command: `npm install && npx ng build --configuration=production`
   - Publish directory: `smart-calendar/dist/smart-calendar/browser`

### 3. Configurar Environment Variables
```bash
NODE_VERSION=20
NPM_VERSION=10
```

### 4. Deploy
- Click "Deploy site"
- Aguarde build (~3 min)
- Acesse: https://smart-calendar.netlify.app

### 5. Configurar domínio customizado (Opcional)
1. Site settings → Domain management
2. Add custom domain
3. Configure DNS

---

## 🔧 Pós-Deploy

### Backend (Render)
1. Executar migrações:
   - Shell → `npm run migrate`

2. Criar usuário teste:
   - Shell → `npm run create-test-user`

3. Verificar logs:
   - Logs tab → Verificar erros

### Frontend (Netlify)
1. Atualizar environment.prod.ts:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://smart-calendar-backend.onrender.com/api'
};
```

2. Commit e push para re-deploy

---

## 📊 Monitoramento

### Render
- Dashboard → Metrics
- Logs em tempo real
- Health checks automáticos

### Netlify
- Analytics (se habilitado)
- Deploy logs
- Function logs

---

## 🐛 Troubleshooting

### Backend não inicia
- Verificar DATABASE_URL
- Verificar logs no Render
- Testar conexão PostgreSQL

### Frontend não conecta
- Verificar CORS_ORIGIN no backend
- Verificar apiUrl no environment.prod.ts
- Verificar network tab no browser

### Migrações falham
- Conectar via Shell no Render
- Executar manualmente: `npm run migrate`
- Verificar permissões do usuário PostgreSQL

---

## 🔄 CI/CD Automático

Ambos Render e Netlify fazem deploy automático quando você faz push para `master`:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin master
```

- Render: Auto-deploy backend
- Netlify: Auto-deploy frontend
