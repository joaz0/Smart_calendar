# ♿ Checklist de Acessibilidade - WCAG 2.1 AA

## Princípios WCAG

### 1. Perceptível
Informação e componentes da interface devem ser apresentados de forma perceptível.

### 2. Operável
Componentes da interface e navegação devem ser operáveis.

### 3. Compreensível
Informação e operação da interface devem ser compreensíveis.

### 4. Robusto
Conteúdo deve ser robusto o suficiente para ser interpretado por tecnologias assistivas.

---

## ✅ Checklist de Implementação

### Texto e Conteúdo

- [ ] **1.1.1** Alternativas em texto para conteúdo não textual
- [ ] **1.3.1** Informação e relacionamentos preservados
- [ ] **1.3.2** Sequência significativa de leitura
- [ ] **1.4.1** Uso de cor não é o único meio visual
- [ ] **1.4.3** Contraste mínimo de 4.5:1 para texto normal
- [ ] **1.4.4** Texto pode ser redimensionado até 200%
- [ ] **1.4.10** Reflow sem scroll horizontal até 320px
- [ ] **1.4.11** Contraste de 3:1 para componentes UI
- [ ] **1.4.12** Espaçamento de texto ajustável

### Navegação e Interação

- [ ] **2.1.1** Toda funcionalidade acessível via teclado
- [ ] **2.1.2** Sem armadilhas de teclado
- [ ] **2.4.1** Mecanismo para pular blocos repetidos
- [ ] **2.4.2** Páginas têm títulos descritivos
- [ ] **2.4.3** Ordem de foco lógica
- [ ] **2.4.4** Propósito dos links claro pelo contexto
- [ ] **2.4.7** Indicador de foco visível
- [ ] **2.5.1** Gestos complexos têm alternativas simples
- [ ] **2.5.2** Cancelamento de pointer events
- [ ] **2.5.3** Label visível corresponde ao nome acessível
- [ ] **2.5.4** Motion actuation tem alternativa

### Tempo e Mídia

- [ ] **2.2.1** Tempo ajustável para conteúdo com limite
- [ ] **2.2.2** Pausar, parar ou ocultar conteúdo em movimento
- [ ] **1.2.1** Alternativa para mídia apenas áudio/vídeo
- [ ] **1.2.2** Legendas para conteúdo de áudio
- [ ] **1.2.3** Audiodescrição ou alternativa para vídeo

### Formulários

- [ ] **3.2.1** Foco não causa mudança de contexto
- [ ] **3.2.2** Input não causa mudança de contexto
- [ ] **3.3.1** Erros identificados e descritos
- [ ] **3.3.2** Labels ou instruções fornecidas
- [ ] **3.3.3** Sugestões de correção de erros
- [ ] **3.3.4** Prevenção de erros em dados importantes
- [ ] **4.1.3** Mensagens de status programaticamente determinadas

### Semântica e Estrutura

- [ ] **1.3.1** Uso correto de headings (h1-h6)
- [ ] **1.3.1** Landmarks ARIA (main, nav, aside, etc)
- [ ] **1.3.5** Autocomplete apropriado em inputs
- [ ] **4.1.1** HTML válido e bem formado
- [ ] **4.1.2** Nome, função e valor de componentes UI

---

## 🎯 Implementação no Smart Calendar

### Componentes

#### Botões
```html
<!-- ✅ Correto -->
<button 
  type="button"
  aria-label="Adicionar evento"
  [attr.aria-pressed]="isActive">
  <mat-icon aria-hidden="true">add</mat-icon>
  <span>Adicionar</span>
</button>

<!-- ❌ Evitar -->
<div (click)="add()">
  <mat-icon>add</mat-icon>
</div>
```

#### Formulários
```html
<!-- ✅ Correto -->
<mat-form-field>
  <mat-label>Título do Evento</mat-label>
  <input 
    matInput
    id="event-title"
    [(ngModel)]="event.title"
    required
    aria-required="true"
    aria-describedby="title-error">
  <mat-error id="title-error">
    Título é obrigatório
  </mat-error>
</mat-form-field>
```

#### Dialogs
```html
<!-- ✅ Correto -->
<div 
  role="dialog"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
  aria-modal="true">
  <h2 id="dialog-title">Criar Evento</h2>
  <p id="dialog-description">Preencha os dados do evento</p>
</div>
```

#### Calendário
```html
<!-- ✅ Correto -->
<table role="grid" aria-label="Calendário de Janeiro 2025">
  <thead>
    <tr>
      <th scope="col" abbr="Dom">Domingo</th>
      <th scope="col" abbr="Seg">Segunda</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td role="gridcell" 
          [attr.aria-selected]="isSelected"
          [attr.aria-label]="getDayLabel(day)">
        {{ day }}
      </td>
    </tr>
  </tbody>
</table>
```

### Navegação por Teclado

#### Atalhos Implementados
```typescript
// Navegação global
Alt + H     // Home/Dashboard
Alt + C     // Calendário
Alt + T     // Tarefas
Alt + S     // Configurações
Esc         // Fechar modal/dialog

// Calendário
Arrow Keys  // Navegar entre dias
Enter       // Selecionar dia
Space       // Abrir detalhes
N           // Novo evento
/           // Buscar

// Formulários
Tab         // Próximo campo
Shift+Tab   // Campo anterior
Enter       // Submit
Esc         // Cancelar
```

### Focus Management

```typescript
@Component({...})
export class EventDialogComponent implements AfterViewInit {
  @ViewChild('firstInput') firstInput!: ElementRef;

  ngAfterViewInit() {
    // Foco automático no primeiro campo
    setTimeout(() => {
      this.firstInput.nativeElement.focus();
    }, 100);
  }

  onClose() {
    // Retornar foco ao elemento que abriu o dialog
    this.previousFocusElement?.focus();
  }
}
```

### Anúncios para Screen Readers

```typescript
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({...})
export class CalendarComponent {
  constructor(private announcer: LiveAnnouncer) {}

  onEventCreated(event: Event) {
    this.announcer.announce(
      `Evento "${event.title}" criado com sucesso`,
      'polite'
    );
  }

  onError(message: string) {
    this.announcer.announce(message, 'assertive');
  }
}
```

### Contraste de Cores

```scss
// Texto normal: mínimo 4.5:1
.text-primary {
  color: #212121; // Contraste 16:1 com branco
}

// Texto grande (18px+): mínimo 3:1
.heading {
  color: #424242; // Contraste 11:1 com branco
}

// Componentes UI: mínimo 3:1
.button-primary {
  background: #9c27b0; // Contraste 4.6:1 com branco
  color: #ffffff;
}

// Estados de foco
:focus-visible {
  outline: 2px solid #9c27b0;
  outline-offset: 2px;
}
```

---

## 🧪 Testes de Acessibilidade

### Ferramentas

#### Automáticas
- **axe DevTools** - Extensão Chrome/Firefox
- **WAVE** - Web Accessibility Evaluation Tool
- **Lighthouse** - Audit do Chrome DevTools
- **Pa11y** - CLI para testes automatizados

#### Manuais
- **NVDA** (Windows) - Screen reader gratuito
- **JAWS** (Windows) - Screen reader comercial
- **VoiceOver** (macOS/iOS) - Screen reader nativo
- **TalkBack** (Android) - Screen reader nativo

### Comandos de Teste

```bash
# Lighthouse CI
npm run lighthouse

# axe-core
npm run test:a11y

# Pa11y
pa11y http://localhost:4200
```

### Checklist de Teste Manual

- [ ] Navegar toda aplicação apenas com teclado
- [ ] Testar com screen reader (NVDA/VoiceOver)
- [ ] Verificar contraste com ferramentas
- [ ] Testar zoom até 200%
- [ ] Testar com modo de alto contraste
- [ ] Verificar ordem de foco
- [ ] Testar formulários com validação
- [ ] Verificar anúncios de mudanças dinâmicas

---

## 📊 Métricas de Sucesso

### Lighthouse Score
- **Acessibilidade**: ≥ 95
- **Melhores Práticas**: ≥ 90
- **SEO**: ≥ 90

### Cobertura
- **Componentes testados**: 100%
- **Páginas auditadas**: 100%
- **Violações críticas**: 0

---

## 📚 Recursos

### Documentação
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Angular CDK A11y](https://material.angular.io/cdk/a11y/overview)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Cursos
- [Web Accessibility by Google](https://www.udacity.com/course/web-accessibility--ud891)
- [Deque University](https://dequeuniversity.com/)

### Comunidade
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)
