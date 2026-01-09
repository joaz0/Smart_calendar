# 🔌 Integração Frontend ↔ Backend

## 📡 Serviços de API

### 1. **ApiService** (Serviço Base)
Centraliza todas as requisições HTTP com:
- ✅ Tratamento de erros padronizado
- ✅ Retry automático
- ✅ Timeout de 30s
- ✅ Headers de autenticação automáticos
- ✅ Indicador de carregamento

```typescript
import { ApiService } from '@core/services/api.service';

constructor(private api: ApiService) {}

// GET
this.api.get<User>('/api/users/1').subscribe(response => {
  const user = response.data;
});

// POST
this.api.post('/api/events', eventData).subscribe(response => {
  const event = response.data;
});

// PATCH
this.api.patch('/api/events/1', updateData).subscribe(response => {
  const updated = response.data;
});

// DELETE
this.api.delete('/api/events/1').subscribe(response => {
  // Sucesso
});
```

### 2. **AuthApiService**
Gerencia autenticação:

```typescript
import { AuthApiService } from '@core/services/auth-api.service';

constructor(private auth: AuthApiService) {}

// Login
this.auth.login({ email: 'user@example.com', password: 'senha123' })
  .subscribe(response => {
    localStorage.setItem('token', response.token);
  });

// Registro
this.auth.register({
  email: 'novo@example.com',
  password: 'senha123',
  name: 'João Silva'
}).subscribe(response => {
  // Usuário criado
});

// Usuário atual
this.auth.getCurrentUser().subscribe(user => {
  console.log(user);
});

// Reset de senha
this.auth.forgotPassword({ email: 'user@example.com' })
  .subscribe(response => {
    console.log(response.message);
  });
```

### 3. **EventApiService**
Gerencia eventos:

```typescript
import { EventApiService } from '@core/services/event-api.service';

constructor(private events: EventApiService) {}

// Buscar por intervalo
const start = new Date();
const end = new Date();
end.setMonth(end.getMonth() + 1);

this.events.getEventsByDateRange(start, end).subscribe(response => {
  console.log(response.data);
  console.log(response.meta);
});

// Criar
this.events.createEvent({
  title: 'Reunião',
  description: 'Planejamento',
  startDate: '2026-01-15T10:00:00Z',
  endDate: '2026-01-15T11:00:00Z',
  color: '#7c3aed'
}).subscribe(event => {
  console.log('Evento criado:', event.id);
});

// Atualizar
this.events.updateEvent(1, {
  title: 'Reunião atualizada'
}).subscribe(updated => {
  console.log('Atualizado');
});

// Deletar
this.events.deleteEvent(1).subscribe(() => {
  console.log('Deletado');
});

// Buscar
this.events.searchEvents('reunião').subscribe(response => {
  console.log(response.data);
});
```

### 4. **TaskApiService**
Gerencia tarefas:

```typescript
import { TaskApiService } from '@core/services/task-api.service';

constructor(private tasks: TaskApiService) {}

// Listar
this.tasks.getAllTasks().subscribe(response => {
  console.log(response.data);
});

// Por status
this.tasks.getTasksByStatus('pending').subscribe(response => {
  console.log(response.data);
});

// Criar
this.tasks.createTask({
  title: 'Fazer compras',
  priority: 'high',
  status: 'pending'
}).subscribe(task => {
  console.log('Tarefa criada:', task.id);
});

// Atualizar
this.tasks.updateTask(1, {
  status: 'completed'
}).subscribe(updated => {
  console.log('Concluída');
});
```

## 🔐 Autenticação

### Token no localStorage

O token é automaticamente enviado em todas as requisições via header `Authorization`:

```typescript
// Salvar token (feito automaticamente após login)
localStorage.setItem('token', response.token);

// Token é enviado automaticamente em cada request
// Authorization: Bearer <token>
```

### Logout

```typescript
this.auth.logout(); // Remove token e redireciona para login
```

## 📊 Respostas Padronizadas

Todas as respostas seguem este padrão:

```typescript
// Sucesso com dados
{
  "success": true,
  "data": { /* dados */ },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}

// Erro
{
  "success": false,
  "error": "Descrição do erro",
  "type": "VALIDATION_ERROR"
}
```

## 🚨 Tratamento de Erros

Os erros são automaticamente tratados:

```typescript
this.api.get('/api/events').subscribe(
  (response) => {
    // Sucesso
    console.log(response.data);
  },
  (error) => {
    // Erro tratado
    console.log(error.statusCode);
    console.log(error.message);
    
    if (error.statusCode === 401) {
      // Redirecion para login
    }
  }
);
```

## 📍 Endpoints Disponíveis

### Autenticação
- `POST /api/auth/register` - Criar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuário atual
- `POST /api/auth/forgot-password` - Solicitar reset
- `POST /api/auth/reset-password` - Resetar senha

### Eventos
- `GET /api/events` - Listar (com paginação)
- `GET /api/events/:id` - Obter por ID
- `GET /api/events/search?q=termo` - Buscar
- `POST /api/events` - Criar
- `PATCH /api/events/:id` - Atualizar
- `DELETE /api/events/:id` - Deletar

### Tarefas
- `GET /api/tasks` - Listar
- `GET /api/tasks/:id` - Obter por ID
- `GET /api/tasks/search?q=termo` - Buscar
- `POST /api/tasks` - Criar
- `PATCH /api/tasks/:id` - Atualizar
- `DELETE /api/tasks/:id` - Deletar

### Usuários
- `GET /api/users/:id` - Obter perfil
- `PUT /api/users/:id` - Atualizar perfil

## 🔍 Indicador de Carregamento

```typescript
constructor(private api: ApiService) {}

isLoading$ = this.api.isLoading();

// Em template
<app-spinner *ngIf="(isLoading$ | async)"></app-spinner>
```

## 📝 Exemplo Completo

```typescript
import { Component, OnInit } from '@angular/core';
import { EventApiService } from '@core/services/event-api.service';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-calendar',
  template: `
    <div *ngIf="(isLoading$ | async)" class="spinner"></div>
    <div *ngFor="let event of events" class="event">
      {{ event.title }}
    </div>
  `
})
export class CalendarComponent implements OnInit {
  events: any[] = [];
  isLoading$ = this.api.isLoading();

  constructor(
    private eventApi: EventApiService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    const start = new Date();
    const end = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

    this.eventApi.getEventsByDateRange(start, end).subscribe(
      (response) => {
        this.events = response.data;
      },
      (error) => {
        console.error('Erro ao carregar eventos:', error.message);
      }
    );
  }
}
```

## 🔧 Configuração do Ambiente

Arquivo: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

Arquivo: `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.smartcalendar.app'
};
```

---

**Última atualização**: 9 de janeiro de 2026
