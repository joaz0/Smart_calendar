# API Reference - Smart Calendar

## Base URL
```
Development: http://localhost:3000/api
Production: https://smart-calendar-backend.onrender.com/api
```

## Autenticação
Todas rotas protegidas requerem header:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth

### POST /auth/register
Registrar novo usuário
```json
Request:
{
  "email": "user@example.com",
  "password": "senha123",
  "name": "Nome Usuário"
}

Response: 201
{
  "token": "jwt-token",
  "refreshToken": "refresh-token",
  "user": { "id": 1, "email": "...", "name": "..." }
}
```

### POST /auth/login
Login
```json
Request:
{
  "email": "user@example.com",
  "password": "senha123"
}

Response: 200
{
  "token": "jwt-token",
  "refreshToken": "refresh-token",
  "user": { "id": 1, "email": "...", "name": "..." }
}
```

### POST /auth/refresh
Renovar token
```json
Request:
{
  "refreshToken": "refresh-token"
}

Response: 200
{
  "token": "new-jwt-token"
}
```

---

## 📅 Events

### GET /events
Listar eventos
```
Query params:
  ?start_date=2025-01-01T00:00:00Z
  &end_date=2025-01-31T23:59:59Z
  &category_id=1
  &page=1
  &limit=20

Response: 200
{
  "events": [...],
  "pagination": { "page": 1, "limit": 20, "total": 50 }
}
```

### POST /events
Criar evento
```json
Request:
{
  "title": "Reunião",
  "description": "Descrição",
  "start_date": "2025-01-15T10:00:00Z",
  "end_date": "2025-01-15T11:00:00Z",
  "category_id": 1,
  "location": "Sala 5",
  "is_recurring": false
}

Response: 201
{
  "id": 1,
  "title": "Reunião",
  ...
}
```

### PUT /events/:id
Atualizar evento

### DELETE /events/:id
Deletar evento

---

## ✅ Tasks

### GET /tasks
Listar tarefas
```
Query params:
  ?status=pending|completed
  &priority=low|medium|high
  &due_date=2025-01-31
  &page=1
  &limit=20
```

### POST /tasks
Criar tarefa
```json
Request:
{
  "title": "Comprar mantimentos",
  "description": "Lista de compras",
  "due_date": "2025-01-20T18:00:00Z",
  "priority": "high",
  "category_id": 2
}
```

### PATCH /tasks/:id/complete
Marcar como completa

---

## 🤖 AI

### GET /ai-suggestions
Obter sugestões de IA
```
Response: 200
{
  "suggestions": [
    {
      "type": "schedule",
      "title": "Melhor horário para reunião",
      "description": "...",
      "confidence": 0.85
    }
  ]
}
```

### POST /ai-commands
Executar comando de IA
```json
Request:
{
  "command": "agendar reunião amanhã às 14h"
}

Response: 200
{
  "action": "create_event",
  "data": { "title": "Reunião", "start_date": "..." }
}
```

---

## 📊 Productivity

### GET /productivity/stats
Estatísticas de produtividade
```
Response: 200
{
  "weekly_focus": 75,
  "completed_tasks": 12,
  "pending_tasks": 5,
  "productivity_score": 82
}
```

---

## 💚 Wellness

### GET /burnout/status
Status de burnout
```
Response: 200
{
  "score": 45,
  "level": "moderate",
  "recommendations": [...]
}
```

### POST /breaks/schedule
Agendar pausa
```json
Request:
{
  "type": "active",
  "duration": 15,
  "scheduled_at": "2025-01-15T15:00:00Z"
}
```

---

## 🔗 N8N Integration

### POST /n8n/webhook
Trigger webhook
```json
Request:
{
  "webhookUrl": "https://n8n.example.com/webhook/...",
  "data": { "event": "task_completed", "task_id": 1 }
}
```

### POST /n8n/workflow/:workflowId/execute
Executar workflow

---

## Rate Limits
- Auth endpoints: 5 req/15min
- API endpoints: 100 req/15min

## Error Responses
```json
400 Bad Request:
{
  "error": "Validation error",
  "details": [...]
}

401 Unauthorized:
{
  "error": "Invalid token"
}

429 Too Many Requests:
{
  "error": "Rate limit exceeded"
}

500 Internal Server Error:
{
  "error": "Internal server error"
}
```
