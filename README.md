# AgendaRapido - Smart Calendar

Sistema completo de agenda inteligente com Angular 18 e Node.js, pronto para deploy no Render.com.

## 🚀 Funcionalidades

### Frontend (Angular 18)
- ✅ Interface moderna e responsiva
- ✅ Calendário interativo (mês/semana/dia)
- ✅ Gerenciamento de eventos e tarefas
- ✅ Sistema de categorias com cores
- ✅ Autenticação completa
- ✅ Configurações de privacidade avançadas
- ✅ Tema claro/escuro
- ✅ PWA ready

### Backend (Node.js + PostgreSQL)
- ✅ API REST completa
- ✅ Autenticação JWT
- ✅ Banco de dados robusto
- ✅ Sistema de privacidade em camadas
- ✅ Rate limiting e segurança
- ✅ Pronto para produção

## 🛠️ Tecnologias

- **Frontend**: Angular 18, Angular Material, TypeScript, SCSS
- **Backend**: Node.js, Express, PostgreSQL, JWT
- **Deploy**: Render.com (backend), Netlify/Vercel (frontend)

## 📦 Estrutura do Projeto

```
Smart_calendar/
├── smart-calendar/          # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # Serviços, guards, interceptors
│   │   │   ├── features/   # Módulos de funcionalidades
│   │   │   ├── shared/     # Componentes compartilhados
│   │   │   └── layouts/    # Layouts da aplicação
│   │   └── environments/   # Configurações de ambiente
└── backend/                # Backend Node.js
    ├── src/
    │   ├── routes/         # Rotas da API
    │   ├── middleware/     # Middlewares
    │   ├── database/       # Schema e migrações
    │   └── config/         # Configurações
    └── render.yaml         # Config do Render.com
```

## 🚀 Deploy no Render.com

### Backend

1. **Criar conta no Render.com**
2. **Conectar repositório Git**
3. **Configurar serviço web**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

4. **Configurar banco PostgreSQL**:
   - Criar database no Render
   - Copiar DATABASE_URL

5. **Variáveis de ambiente**:
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

6. **Executar migração**:
```bash
npm run migrate
```

### Frontend

1. **Build para produção**:
```bash
cd smart-calendar
ng build --configuration=production
```

2. **Deploy no Netlify/Vercel**:
   - Conectar repositório
   - Build command: `ng build --configuration=production`
   - Publish directory: `dist/smart-calendar`

## 🔧 Desenvolvimento Local

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL no .env
npm run migrate
npm run dev
```

### Frontend
```bash
cd smart-calendar
npm install
ng serve
```

## 📊 Banco de Dados

### Tabelas Principais
- **users**: Usuários e preferências
- **events**: Eventos do calendário
- **tasks**: Tarefas e to-dos
- **categories**: Categorias personalizadas
- **privacy_settings**: Configurações de privacidade
- **wellness_data**: Dados de bem-estar
- **ai_insights**: Insights de IA

### Recursos Avançados
- Triggers automáticos
- Índices otimizados
- Sistema de privacidade em camadas
- Suporte a recorrência
- Integrações externas

## 🔐 Segurança

- Autenticação JWT
- Rate limiting
- Validação de entrada
- Hash de senhas (bcrypt)
- Headers de segurança (Helmet)
- CORS configurado

## 📱 PWA Features

- Service Worker
- Manifest.json
- Offline support
- Push notifications
- Installable app

## 🎨 Temas e Personalização

- Tema claro/escuro
- Cores personalizáveis
- Layout responsivo
- Acessibilidade (WCAG)

## 📈 Performance

- Lazy loading de módulos
- OnPush change detection
- Compressão gzip
- Bundle optimization
- CDN ready

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.