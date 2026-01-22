# 📚 Backend - Documentação Consolidada

## 🚀 Quick Start (5 minutos)

```bash
# 1. Instalar dependências
cd smart-calendar/backend
npm install

# 2. Configurar .env
cp .env.example .env
# Editar: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET, PORT

# 3. Iniciar em desenvolvimento
npm run dev
# Backend rodará em http://localhost:3000

# 4. Verificar health
curl http://localhost:3000/health
```

**Variáveis de Ambiente Necessárias:**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_calendar
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=10d
PORT=3000
NODE_ENV=development
```

---

## 📁 Estrutura do Projeto

```
backend/src/
├── config/
│   ├── database.ts      # Pool PostgreSQL
│   ├── jwt.ts           # Configuração JWT
│   └── constants.ts     # Constantes globais
├── middleware/
│   ├── auth.ts          # Autenticação JWT
│   ├── error.ts         # Tratamento de erros
│   └── logger.ts        # Logging de requisições
├── routes/              # Rotas da API
│   ├── auth.routes.ts
│   ├── event.routes.ts
│   ├── task.routes.ts
│   └── ...
├── controllers/         # Lógica de negócio
│   ├── auth.controller.ts
│   ├── event.controller.ts
│   ├── task.controller.ts
│   └── ...
├── services/            # Lógica reutilizável
│   ├── auth.service.ts
│   ├── event.service.ts
│   └── ...
├── utils/
│   ├── error-handler.ts     # Tratamento de erros
│   ├── logger.ts            # Logger estruturado
│   ├── validators.ts        # Validadores
│   └── response-formatter.ts # Formatação de respostas
├── types/               # TypeScript types
│   └── index.ts
└── server.ts            # Entry point
```

---

## 🎯 Principais Padrões

### 1. Tratamento de Erros com ApiError

Centraliza erros com mensagens consistentes e status HTTP corretos.

```typescript
// controllers/auth.controller.ts
import { createErrors } from '../utils/error-handler';

export class AuthController {
  async register(req: any, res: any) {
    try {
      const { email, password, name } = req.body;
      
      // Validação
      if (!email) {
        throw createErrors.validationError('Email é obrigatório', { field: 'email' });
      }
      
      // Verificar duplicata
      const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        throw createErrors.conflictError('Email já cadastrado');
      }
      
      // Criar usuário...
      sendSuccess(res, { id: 1, email, name }, 201);
    } catch (error) {
      sendError(res, error);
    }
  }
}
```

**Tipos de Erro Disponíveis:**
- `validationError(message, metadata)` → 400
- `authenticationError(message)` → 401
- `authorizationError(message)` → 403
- `notFoundError(resource)` → 404
- `conflictError(message)` → 409
- `serverError(message)` → 500

### 2. Logging Estruturado

```typescript
import { logger } from '../utils/logger';

logger.info('Usuário criado com sucesso', { userId: 123, email: 'user@example.com' });
logger.warn('Tentativa de acesso não autorizado', { userId: 456 });
logger.error('Erro ao conectar no banco', { host: 'localhost' }, error);
logger.debug('Valor em debug', { value: someValue }); // Apenas em dev
```

**Níveis:** `info`, `warn`, `error`, `debug`

### 3. Respostas Formatadas

Padroniza todas as respostas HTTP com estrutura uniforme.

```typescript
import { sendSuccess, sendError, sendPaginated } from '../utils/response-formatter';

// Sucesso simples
sendSuccess(res, { id: 1, name: 'Categoria' }, 201);

// Com paginação
sendPaginated(res, items, page, pageSize, totalCount);

// Erro (tratado automaticamente pelo middleware)
sendError(res, error);
```

**Formato de Resposta:**
```typescript
{
  success: boolean;
  data?: T | T[];
  error?: string;
  meta?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}
```

### 4. Validação de Entrada

Express validators reutilizáveis para inputs.

```typescript
// routes/auth.routes.ts
import { validateEmail, validatePassword, validateName } from '../utils/validators';

router.post('/register', [
  validateName(),
  validateEmail(),
  validatePassword(8) // Mínimo 8 caracteres
], authController.register);

router.post('/login', [
  validateEmail(),
  validatePassword(1) // Apenas existe
], authController.login);
```

**Validadores Disponíveis:**
- `validateEmail()`
- `validatePassword(minLength)`
- `validateName()`
- `validatePhone()`
- `validateUrl()`
- `validateCPF()`
- `validateCNPJ()`

### 5. Padrão de Middleware

```typescript
// middleware/auth.ts
import { verify } from 'jsonwebtoken';

export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw createErrors.authenticationError('Token não fornecido');
  }
  
  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    throw createErrors.authenticationError('Token inválido');
  }
};
```

---

## 📡 Endpoints Principais

### Autenticação

```
POST   /api/auth/register        # Registrar novo usuário
POST   /api/auth/login           # Fazer login
GET    /api/auth/me              # Obter dados do usuário (requer token)
POST   /api/auth/logout          # Fazer logout
POST   /api/auth/refresh         # Renovar token
POST   /api/auth/forgot-password # Solicitar reset de senha
POST   /api/auth/reset-password  # Resetar senha com token
```

### Eventos

```
GET    /api/events               # Listar eventos (com paginação)
GET    /api/events/:id           # Obter evento específico
POST   /api/events               # Criar evento
PUT    /api/events/:id           # Atualizar evento
DELETE /api/events/:id           # Deletar evento
GET    /api/events/search?q=term # Buscar eventos
GET    /api/events/date-range    # Listar por intervalo
```

### Tarefas

```
GET    /api/tasks                # Listar tarefas (com paginação)
GET    /api/tasks/:id            # Obter tarefa específica
POST   /api/tasks                # Criar tarefa
PUT    /api/tasks/:id            # Atualizar tarefa
DELETE /api/tasks/:id            # Deletar tarefa
GET    /api/tasks?status=pending # Filtrar por status
```

### Categorias (exemplo implementado no frontend)

```
GET    /api/categories           # Listar categorias
GET    /api/categories/:id       # Obter categoria específica
POST   /api/categories           # Criar categoria
PUT    /api/categories/:id       # Atualizar categoria
DELETE /api/categories/:id       # Deletar categoria
```

---

## 🛠️ Como Adicionar Novo Endpoint

### Passo 1: Criar Controller

```typescript
// controllers/category.controller.ts
import { sendSuccess, sendError, sendPaginated } from '../utils/response-formatter';
import { createErrors } from '../utils/error-handler';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

export class CategoryController {
  async getAll(req: any, res: any) {
    try {
      const page = parseInt(req.query.page || '1');
      const pageSize = parseInt(req.query.pageSize || '10');
      const offset = (page - 1) * pageSize;
      
      logger.info('Fetching categories', { page, pageSize });
      
      const result = await pool.query(
        'SELECT * FROM categories ORDER BY name ASC LIMIT $1 OFFSET $2',
        [pageSize, offset]
      );
      
      const countResult = await pool.query('SELECT COUNT(*) FROM categories');
      const totalCount = parseInt(countResult.rows[0].count);
      
      sendPaginated(res, result.rows, page, pageSize, totalCount);
    } catch (error) {
      logger.error('Error fetching categories', {}, error as Error);
      sendError(res, error);
    }
  }
  
  async create(req: any, res: any) {
    try {
      const { name, color } = req.body;
      
      if (!name) {
        throw createErrors.validationError('Nome é obrigatório', { field: 'name' });
      }
      
      const result = await pool.query(
        'INSERT INTO categories (name, color, user_id) VALUES ($1, $2, $3) RETURNING *',
        [name, color, req.user.id]
      );
      
      logger.info('Category created', { categoryId: result.rows[0].id });
      sendSuccess(res, result.rows[0], 201);
    } catch (error) {
      sendError(res, error);
    }
  }
}
```

### Passo 2: Criar Rotas

```typescript
// routes/category.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateName } from '../utils/validators';
import { CategoryController } from '../controllers/category.controller';

const router = Router();
const controller = new CategoryController();

router.get('/', authMiddleware, (req, res) => controller.getAll(req, res));
router.post('/', authMiddleware, [validateName()], (req, res) => controller.create(req, res));

export default router;
```

### Passo 3: Registrar Rotas no Server

```typescript
// server.ts
import categoryRoutes from './routes/category.routes';

app.use('/api/categories', categoryRoutes);
```

---

## 🧪 Teste de Integração

### Testar um Endpoint

```bash
# 1. Login e obter token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.data.token')

# 2. Usar token em requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/events

# 3. Criar evento
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Reunião","startTime":"2024-01-15T10:00:00Z"}'
```

---

## 📊 Scripts Úteis

```bash
# Backend
npm run dev           # Rodar em desenvolvimento (tsx watch)
npm run build        # Compilar TypeScript
npm start            # Rodar build compilado (produção)
npm run db:setup     # Criar tabelas e fixtures
npm test             # Rodar testes (se configurados)

# Migração de banco (se usar)
npm run migrate:latest
npm run migrate:rollback
```

---

## 🔐 Segurança

### Token JWT

- Expiração: `JWT_EXPIRES_IN=10d`
- Algoritmo: HS256
- Injetado em `Authorization: Bearer <token>`

### Password

- Hashing: bcrypt
- Salt rounds: 10

### Variáveis Sensíveis

- Nunca commitar `.env`
- Usar `.env.example` como template
- Todas as variáveis devem ter valores padrão seguros

---

## 🚀 Deploy & Produção

### Build

```bash
cd smart-calendar/backend
npm run build
```

Gera `dist/` com código compilado.

### Rodando em Produção

```bash
NODE_ENV=production node dist/server.js
```

**Checklist:**
- [ ] `DB_HOST`, `DB_USER`, `DB_PASSWORD` configurados
- [ ] `JWT_SECRET` é uma string longa e aleatória
- [ ] `NODE_ENV=production`
- [ ] CORS configurado apenas para domínio permitido
- [ ] Logs configurados para arquivo
- [ ] Backup do banco automático

---

## 📈 Métricas & Health Check

```bash
# Verificar saúde do backend
curl http://localhost:3000/health

# Response esperado:
{
  "success": true,
  "data": {
    "status": "OK",
    "uptime": 1234567,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| ECONNREFUSED (banco) | Verificar se PostgreSQL está rodando: `sudo service postgresql status` |
| JWT token inválido | Verificar se `JWT_SECRET` é o mesmo em prod/dev |
| CORS error | Adicionar frontend URL em `server.ts` CORS config |
| 404 em rotas | Verificar se rota foi registrada em `server.ts` |
| Timeout em queries | Aumentar `pool.idleTimeoutMillis` em `database.ts` |

---

## 📚 Referências Rápidas

**Arquivo** | **Responsabilidade** | **Modificar quando?**
--- | --- | ---
`server.ts` | Middlewares, CORS, error handler | Novo middleware ou rota global
`config/database.ts` | Pool PostgreSQL | Adicionar/remover pool settings
`config/jwt.ts` | Configuração JWT | Mudar algoritmo ou expiração
`utils/error-handler.ts` | Tipos de erro | Novo tipo de erro
`utils/logger.ts` | Logging | Adicionar novo nível ou formato
`utils/validators.ts` | Validadores Express | Novo tipo de validação
`middleware/auth.ts` | Autenticação JWT | Mudar lógica de autenticação

---

## 🎯 Próximos Passos

1. ✅ Backend estruturado com padrões
2. 🔄 Implementar endpoint Categories (exemplo na seção "Como Adicionar Novo Endpoint")
3. 🔄 Conectar frontend Categories com backend
4. 🔄 Adicionar testes unitários para controllers
5. 🔄 Implementar CI/CD com GitHub Actions

---

**Última atualização:** 2024-01-15
**Versão:** 1.0
**Status:** 100% Consolidado
