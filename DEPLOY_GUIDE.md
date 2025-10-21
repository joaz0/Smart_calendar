# 🚀 Guia de Deploy - Smart Calendar

## 📋 Pré-requisitos
- Conta no [Render.com](https://render.com)
- Conta no [Netlify](https://netlify.com) ou [Vercel](https://vercel.com)
- Repositório Git (GitHub/GitLab)

## 🔧 1. Deploy do Backend (Render.com)

### Passo 1: Preparar Repositório
```bash
git add .
git commit -m "feat: Ready for Render deployment"
git push origin main
```

### Passo 2: Criar Serviço no Render
1. Acesse [Render.com](https://render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório Git
4. Configure:
   - **Name**: `smart-calendar-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd smart-calendar/backend && npm install --include=dev && npm run build`
   - **Start Command**: `cd smart-calendar/backend && npm start`

### Passo 3: Configurar Variáveis de Ambiente
```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
CORS_ORIGIN=https://your-frontend-domain.netlify.app
```

### Passo 4: Criar Banco PostgreSQL
1. No Render, clique **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `smart-calendar-db`
   - **Database**: `smart_calendar`
   - **User**: `smart_calendar_user`
3. Copie a **DATABASE_URL** gerada
4. Adicione como variável de ambiente no Web Service

### Passo 5: Executar Migração
Após deploy, execute no terminal do Render:
```bash
npm run migrate
```

## 🌐 2. Deploy do Frontend (Netlify)

### Passo 1: Build Local (Opcional)
```bash
cd smart-calendar
ng build --configuration=production
```

### Passo 2: Deploy no Netlify
1. Acesse [Netlify](https://netlify.com)
2. Clique **"Add new site"** → **"Import from Git"**
3. Conecte seu repositório
4. Configure:
   - **Base directory**: `smart-calendar`
   - **Build command**: `npm install && npm install -g @angular/cli && ng build --configuration=production`
   - **Publish directory**: `dist/smart-calendar`

### Passo 3: Configurar Domínio
1. Anote a URL gerada (ex: `https://amazing-app-123.netlify.app`)
2. Atualize `CORS_ORIGIN` no backend com esta URL

## ✅ 3. Verificação do Deploy

### Backend (Render)
- ✅ Acesse: `https://your-backend.onrender.com/health`
- ✅ Deve retornar: `{"status":"OK","timestamp":"..."}`

### Frontend (Netlify)
- ✅ Acesse sua URL do Netlify
- ✅ Teste login/registro
- ✅ Verifique OAuth (Google/Microsoft)

## 🔐 4. Configuração de Segurança

### Chaves RSA (Produção)
```bash
# No servidor Render, gere novas chaves:
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

### Variáveis de Ambiente Finais
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
CORS_ORIGIN=https://smartcallendar.netlify.app
```

## 🚨 5. Troubleshooting

### Erro de Build
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erro de CORS
- Verifique se `CORS_ORIGIN` está correto
- Deve ser a URL exata do frontend

### Erro de Banco
- Verifique `DATABASE_URL`
- Execute `npm run migrate`
- Verifique logs no Render

## 📱 6. URLs Finais

### Produção
- **Backend**: `https://smart-calendar-backend-nzkf.onrender.com`
- **Frontend**: `https://smartcallendar.netlify.app`
- **API Docs**: `https://smart-calendar-backend-nzkf.onrender.com/health`

### Desenvolvimento
- **Backend**: `http://localhost:3000`
- **Frontend**: `http://localhost:4200`

## 🎉 Deploy Completo!

Seu Smart Calendar está agora rodando em produção com:
- ✅ Backend seguro no Render.com
- ✅ Frontend otimizado no Netlify
- ✅ Banco PostgreSQL gerenciado
- ✅ SSL/HTTPS automático
- ✅ OAuth funcional
- ✅ Monitoramento integrado