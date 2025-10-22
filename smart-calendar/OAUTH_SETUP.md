# 🔐 Configuração OAuth - Google e Microsoft

## 📋 Onde Configurar suas Credenciais

### 1. **Arquivo de Configuração**
```
📁 src/environments/oauth.config.ts
```

**Substitua as credenciais:**
```typescript
export const oauthConfig = {
  google: {
    clientId: 'SEU_GOOGLE_CLIENT_ID_AQUI', // ← SUBSTITUA AQUI
    redirectUri: 'http://localhost:4200/auth/callback/google'
  },
  microsoft: {
    clientId: 'SEU_MICROSOFT_CLIENT_ID_AQUI', // ← SUBSTITUA AQUI
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: 'http://localhost:4200/auth/callback/microsoft'
  }
};
```

---

## 🔧 Como Obter as Credenciais

### **Google OAuth Setup**

1. **Acesse:** [Google Cloud Console](https://console.cloud.google.com/)
2. **Crie um projeto** ou selecione um existente
3. **Ative a API:** Google+ API ou Google Identity
4. **Vá em:** Credenciais → Criar credenciais → ID do cliente OAuth 2.0
5. **Configure:**
   - **Tipo:** Aplicação web
   - **URIs de redirecionamento autorizados:**
     ```
     http://localhost:4200/auth/callback/google
     http://localhost:4200
     ```
   - **Origens JavaScript autorizadas:**
     ```
     http://localhost:4200
     ```
6. **Copie o Client ID** e cole no arquivo `oauth.config.ts`

### **Microsoft OAuth Setup**

1. **Acesse:** [Azure Portal](https://portal.azure.com/)
2. **Vá em:** Azure Active Directory → Registros de aplicativo
3. **Clique:** Novo registro
4. **Configure:**
   - **Nome:** Smart Calendar
   - **Tipos de conta:** Contas em qualquer diretório organizacional e contas pessoais da Microsoft
   - **URI de redirecionamento:** Web → `http://localhost:4200/auth/callback/microsoft`
5. **Após criar:**
   - Vá em **Autenticação** → Adicionar plataforma → Web
   - **URLs de redirecionamento:**
     ```
     http://localhost:4200/auth/callback/microsoft
     http://localhost:4200
     ```
   - **Marque:** Tokens de acesso e tokens de ID
6. **Copie o Application (client) ID** da página Visão geral
7. **Cole no arquivo** `oauth.config.ts`

---

## 🚀 Funcionalidades Implementadas

### ✅ **Google Login**
- SDK oficial do Google
- Popup automático
- Fallback para token flow
- Tratamento de erros

### ✅ **Microsoft Login**
- Azure AD B2C
- Popup window
- Callback handling
- Error management

### ✅ **Backend Integration**
- Endpoints: `/auth/oauth/google` e `/auth/oauth/microsoft`
- Token validation
- User creation/login
- JWT generation

---

## 🔄 Fluxo de Autenticação

1. **Usuário clica** no botão social
2. **Popup abre** com provider OAuth
3. **Usuário autoriza** a aplicação
4. **Callback recebe** authorization code
5. **Frontend envia** para backend
6. **Backend valida** e retorna JWT
7. **Usuário é redirecionado** para `/app/calendar`

---

## 🛠️ Arquivos Criados/Modificados

```
📁 Novos arquivos:
├── src/environments/oauth.config.ts
├── src/app/core/services/oauth.service.ts
├── src/app/features/auth/callback/callback.component.ts
└── OAUTH_SETUP.md

📁 Arquivos modificados:
├── src/app/core/services/auth.service.ts
├── src/app/layouts/auth-layout/auth-layout.html
├── src/app/layouts/auth-layout/auth-layout.scss
└── src/app/app.routes.ts
```

---

## 🔐 Segurança

- **HTTPS obrigatório** em produção
- **Validação de tokens** no backend
- **CORS configurado** adequadamente
- **Redirect URIs** validados
- **State parameter** para CSRF protection

---

## 📝 Próximos Passos

1. **Configure suas credenciais** no arquivo `oauth.config.ts`
2. **Teste o login** em desenvolvimento
3. **Configure produção** com domínio real
4. **Implemente backend** OAuth endpoints
5. **Configure HTTPS** para produção