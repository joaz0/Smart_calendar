# 📚 Backend - Documentação da Estrutura

## 📁 Estrutura do Projeto

```
backend/src/
├── config/              # Configurações centralizadas
│   ├── database.ts     # Pool de conexão PostgreSQL
│   ├── jwt.ts          # Configuração JWT
│   └── constants.ts    # Constantes globais
├── middleware/         # Middlewares Express
│   ├── auth.ts         # Autenticação JWT
│   ├── error-middleware.ts  # Tratamento de erros
│   └── request-logger.ts    # Logging de requisições
├── routes/             # Rotas da API
│   ├── auth.routes.ts
│   ├── event.routes.ts
│   ├── task.routes.ts
│   └── ...
├── controllers/        # Lógica de negócio
│   ├── auth.controller.ts
│   ├── event.controller.ts
│   └── ...
├── services/           # Serviços e lógica reutilizável
├── utils/              # Utilitários
│   ├── error-handler.ts    # Tratamento de erros customizado
│   ├── logger.ts           # Logger estruturado
│   ├── validators.ts       # Validadores Express
│   └── response-formatter.ts # Formatação de respostas
├── types/              # TypeScript types globais
│   └── index.ts
└── server.ts           # Arquivo principal
```

## 🛡️ Tratamento de Erros

### Usando ApiError

```typescript
import { createErrors } from '../utils/error-handler';

// Validação
throw createErrors.validationError('Email inválido', { field: 'email' });

// Autenticação
throw createErrors.authenticationError('Token expirado');

// Não encontrado
throw createErrors.notFoundError('Usuário');

// Conflito
throw createErrors.conflictError('Email já cadastrado');
```

## 📝 Validação de Dados

### Express Validator

```typescript
import { validateEmail, validatePassword, validateName } from '../utils/validators';
import { Router } from 'express';

const router = Router();

router.post('/register', [
  validateName(),
  validateEmail(),
  validatePassword(8)
], (req, res) => {
  // Implementação
});
```

## 📊 Logging Estruturado

```typescript
import { logger } from '../utils/logger';

// Info
logger.info('Usuário criado', { userId: 123 });

// Warning
logger.warn('Tentativa de acesso não autorizado', { userId: 456 });

// Error
logger.error('Erro ao conectar BD', { host: 'localhost' }, error);

// Debug (apenas em development)
logger.debug('Valor da variável', { value: someValue });
```

## ✅ Respostas Formatadas

```typescript
import { sendSuccess, sendError, sendPaginated } from '../utils/response-formatter';

// Sucesso simples
sendSuccess(res, { id: 1, name: 'João' }, 201);

// Com paginação
sendPaginated(res, events, 50, 1, 20);

// Erro
sendError(res, 'Usuário não encontrado', 404);
```

## 🔐 Autenticação

### Middleware de Autenticação

```typescript
import { authenticateToken } from '../middleware/auth';

router.get('/me', authenticateToken, async (req, res) => {
  const user = req.user; // Usuário autenticado
});
```

## ⚙️ Variáveis de Ambiente (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartcalendar
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_PRIVATE_KEY_PATH=./private_key.pem
JWT_PUBLIC_KEY_PATH=./public_key.pem
JWT_SECRET=fallback-secret

# CORS
CORS_ORIGIN=http://localhost:4200,http://localhost:3000
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Migrations
npm run migrate
npm run migrate-full

# Testes
npm test
npm run test:watch
npm run test:coverage
```

## 📊 Constantes Globais

Localizadas em `src/config/constants.ts`:

- **PAGINATION**: Padrões de paginação
- **JWT**: Configuração de tokens
- **RATE_LIMITS**: Limites de taxa de requisição
- **PASSWORD**: Configurações de senha
- **HTTP_STATUS**: Códigos HTTP

## 🔄 Tratamento de Requisições Assíncronas

```typescript
import { asyncHandler } from '../middleware/error-middleware';

router.get('/events', asyncHandler(async (req, res) => {
  const events = await getEvents();
  sendSuccess(res, events);
}));
```

## 💾 Padrão de Controlador

```typescript
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error-middleware';
import { sendSuccess, sendError } from '../utils/response-formatter';
import { createErrors } from '../utils/error-handler';

class EventController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    try {
      // Implementação
      sendSuccess(res, events);
    } catch (error) {
      throw createErrors.notFoundError('Eventos');
    }
  });
}
```

## 📈 Monitoramento e Health Check

```bash
# Health check
curl http://localhost:3000/health

# Resposta esperada
{
  "status": "OK",
  "timestamp": "2026-01-09T...",
  "database": "connected",
  "environment": "development"
}
```

## 🔒 Segurança

- ✅ Helmet: Proteção contra vulnerabilidades comuns
- ✅ CORS: Apenas origens configuradas
- ✅ Rate Limiting: Proteção contra força bruta
- ✅ JWT: Autenticação segura com chaves RSA
- ✅ bcryptjs: Hash de senhas seguro
- ✅ express-validator: Validação e sanitização

## 🐛 Debug

Habilitar logs de debug:

```bash
NODE_ENV=development npm run dev
```

Todos os logs de debug aparecerão no console durante desenvolvimento.

---

**Última atualização**: 9 de janeiro de 2026
