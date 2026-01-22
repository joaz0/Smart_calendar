# Guia de Contribuição - Smart Calendar

## 🚀 Como Contribuir

### 1. Fork e Clone
```bash
git clone https://github.com/seu-usuario/smart-calendar.git
cd smart-calendar
git checkout -b feature/nova-funcionalidade
```

### 2. Setup Local
```bash
# Backend
cd smart-calendar/backend
npm install
cp .env.example .env
npm run migrate
npm run dev

# Frontend
cd ../frontend
npm install
npm start
```

### 3. Padrões de Código

#### Commits Semânticos
```bash
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração
test: adiciona testes
chore: atualiza dependências
```

#### TypeScript
- Sempre tipar variáveis e funções
- Usar interfaces para objetos complexos
- Evitar `any`, preferir `unknown`

#### Angular
- Componentes standalone
- Signals para estado reativo
- Services injetáveis com `inject()`
- Lazy loading para rotas

#### Node.js
- Async/await ao invés de callbacks
- Try/catch para error handling
- Validação com Joi
- Logs estruturados

### 4. Estrutura de Arquivos

#### Frontend
```
src/app/
├── core/           # Serviços globais, guards, interceptors
├── features/       # Módulos de funcionalidades
├── shared/         # Componentes reutilizáveis
└── utils/          # Utilitários
```

#### Backend
```
src/
├── config/         # Configurações
├── controllers/    # Controllers
├── middleware/     # Middlewares
├── routes/         # Rotas
├── services/       # Lógica de negócio
└── utils/          # Utilitários
```

### 5. Testes

#### Frontend
```bash
npm test                    # Rodar testes
npm run test:coverage       # Coverage
```

#### Backend
```bash
npm test                    # Rodar testes
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage
```

### 6. Pull Request

#### Checklist
- [ ] Código segue padrões do projeto
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Commits semânticos
- [ ] Build passa sem erros
- [ ] Sem conflitos com main

#### Template
```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2

## Screenshots (se aplicável)

## Issues Relacionadas
Closes #123
```

### 7. Code Review

Seu PR será revisado considerando:
- Qualidade do código
- Testes adequados
- Documentação clara
- Performance
- Segurança

### 8. Áreas para Contribuir

#### 🐛 Bugs
Veja issues com label `bug`

#### ✨ Features
Veja issues com label `enhancement`

#### 📚 Documentação
Sempre bem-vinda!

#### 🧪 Testes
Aumentar coverage

#### 🌐 i18n
Traduções (PT, EN, ES)

### 9. Dúvidas?

- Abra uma issue
- Discussões no GitHub
- Email: joaz.rodrigues@example.com

## 📜 Código de Conduta

- Seja respeitoso
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia

## 🎉 Obrigado!

Toda contribuição é valiosa, desde correção de typos até grandes features!
