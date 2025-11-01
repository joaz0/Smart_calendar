# N8N AgendaRapido Extension

Extensão N8N para integração com o AgendaRapido Smart Calendar.

## Instalação

### 1. Instalar N8N
```bash
npm install -g n8n
```

### 2. Instalar a extensão
```bash
cd n8n-nodes-agenda-rapido
npm install
npm run build
```

### 3. Instalar no N8N
```bash
# Opção 1: Instalar globalmente
npm install -g n8n-nodes-agenda-rapido

# Opção 2: Usar variável de ambiente
export N8N_CUSTOM_EXTENSIONS=./n8n-nodes-agenda-rapido
```

### 4. Iniciar N8N
```bash
n8n start
```

## Configuração

1. **Credenciais**:
   - API URL: `https://your-backend-url.onrender.com`
   - Email: seu email do AgendaRapido
   - Password: sua senha

2. **Operações disponíveis**:
   - **Events**: Create, Get, Get All, Update, Delete
   - **Tasks**: Create, Get, Get All, Update, Delete

## Exemplo de Workflow

### Criar evento automaticamente
```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "name": "AgendaRapido",
      "type": "n8n-nodes-agenda-rapido.agendaRapido",
      "position": [450, 300],
      "parameters": {
        "resource": "event",
        "operation": "create",
        "title": "={{$json.title}}",
        "startDate": "={{$json.start}}",
        "endDate": "={{$json.end}}"
      }
    }
  ]
}
```

## Desenvolvimento

```bash
npm run dev    # Watch mode
npm run build  # Build para produção
```