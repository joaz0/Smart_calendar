# Guia de Instalação - Extensão N8N AgendaRapido

## Pré-requisitos
- Node.js 18+
- npm ou yarn

## Passo a Passo

### 1. Instalar N8N
```bash
npm install -g n8n
```

### 2. Preparar a extensão
```bash
cd n8n-nodes-agenda-rapido
npm install n8n-workflow typescript
npm run build
```

### 3. Publicar no npm (opcional)
```bash
npm publish
```

### 4. Instalar no N8N
```bash
# Se publicou no npm:
npm install -g n8n-nodes-agenda-rapido

# Ou usar localmente:
export N8N_CUSTOM_EXTENSIONS=/caminho/para/n8n-nodes-agenda-rapido
```

### 5. Configurar backend do AgendaRapido
Adicione endpoint para N8N no backend:

```javascript
// backend/src/routes/webhooks.js
app.post('/api/webhooks/n8n', async (req, res) => {
  // Processar dados do N8N
  const { eventData } = req.body;
  
  // Criar evento no calendário
  const event = await createEvent(eventData);
  
  res.json({ success: true, event });
});
```

### 6. Iniciar N8N
```bash
n8n start
```

### 7. Configurar credenciais
1. Abra N8N (http://localhost:5678)
2. Vá em Credentials
3. Adicione "AgendaRapido API"
4. Configure:
   - API URL: sua URL do backend
   - Email/Password: suas credenciais

### 8. Criar workflow
1. Novo workflow
2. Adicionar nó "AgendaRapido"
3. Configurar operação desejada
4. Testar conexão

## Exemplos de Uso

### Sincronizar com Google Calendar
```
Google Calendar Trigger → AgendaRapido Create Event
```

### Webhook para criar eventos
```
Webhook → AgendaRapido Create Event → Email Notification
```

### Backup automático
```
Schedule Trigger → AgendaRapido Get All Events → Save to File
```