# Smart Calendar - Guia de Design UX/UI

## 📐 Visão Geral da Nova Arquitetura

O design foi completamente reimaginado com foco em **simplicidade, clareza e eficiência**.

### 🎯 Princípios de Design

1. **Minimalismo Funcional** - Apenas o essencial, sem distrações
2. **Hierarquia Visual Clara** - Informações importantes se destacam naturalmente
3. **Micro-interações Suaves** - Feedback visual imediato e agradável
4. **Responsividade Inteligente** - Adapta-se perfeitamente a qualquer tela
5. **Acessibilidade First** - Suporte a dark mode, motion reduce, etc.

---

## 🎨 Sistema de Cores

### Dark Mode (Padrão)
```scss
Background: linear-gradient(135deg, #000000 0%, #5b0bdc 100%)
Primary: #5b0bdc
Accent: #8b3dff
Text Primary: rgba(255, 255, 255, 0.95)
Text Secondary: rgba(255, 255, 255, 0.7)
Text Tertiary: rgba(255, 255, 255, 0.5)
Border: rgba(91, 11, 220, 0.3)
Surface Glass: rgba(255, 255, 255, 0.05)
```

### Light Mode
```scss
Background: #ffffff
Primary: #5b0bdc
Accent: #8b3dff
Text Primary: rgba(0, 0, 0, 0.87)
Text Secondary: rgba(0, 0, 0, 0.6)
Text Tertiary: rgba(0, 0, 0, 0.38)
Border: rgba(0, 0, 0, 0.12)
Surface Glass: rgba(0, 0, 0, 0.02)
```

---

## 📱 Nova Estrutura da Sidebar

### O que foi REMOVIDO (movido para o header):
- ❌ Notificações (agora no header como botão com badge)
- ❌ Perfil do usuário (agora no header como avatar clicável)
- ❌ Quick Stats (pode virar widget do dashboard)
- ❌ Busca (já estava no header)

### O que PERMANECEU:
- ✅ Logo/Branding
- ✅ Navegação principal com seções
- ✅ Submenus colapsáveis
- ✅ Toggle button para expandir/colapsar

### Exemplo de Estrutura HTML:

```html
<!-- SIDEBAR -->
<aside class="sidebar" [class.collapsed]="isCollapsed" [class.open]="isMobileOpen">
  
  <!-- Header -->
  <div class="sidebar-header">
    <a href="/" class="brand">
      <div class="brand-icon">
        <mat-icon>calendar_today</mat-icon>
      </div>
      <span class="brand-text">SmartCalendar</span>
    </a>
    <button class="toggle-btn" (click)="toggleSidebar()">
      <mat-icon>{{ isCollapsed ? 'menu' : 'close' }}</mat-icon>
    </button>
  </div>

  <!-- Navigation -->
  <nav class="sidebar-nav">
    
    <!-- Seção: Principal -->
    <div class="nav-section">
      <div class="section-label">Principal</div>
      
      <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
        <span class="nav-icon"><mat-icon>dashboard</mat-icon></span>
        <span class="nav-text">Dashboard</span>
      </a>
      
      <a routerLink="/calendar" routerLinkActive="active" class="nav-item">
        <span class="nav-icon"><mat-icon>event</mat-icon></span>
        <span class="nav-text">Calendário</span>
        <span class="nav-badge">3</span>
      </a>
      
      <!-- Item com submenu -->
      <button class="nav-item" (click)="toggleSubmenu('tasks')">
        <span class="nav-icon"><mat-icon>task_alt</mat-icon></span>
        <span class="nav-text">Tarefas</span>
        <span class="nav-arrow" [class.expanded]="submenuOpen['tasks']">
          <mat-icon>expand_more</mat-icon>
        </span>
      </button>
      
      <!-- Submenu -->
      <div class="submenu" *ngIf="submenuOpen['tasks']">
        <a routerLink="/tasks/inbox" class="submenu-item">
          <span class="submenu-icon"><mat-icon>inbox</mat-icon></span>
          <span class="submenu-text">Inbox</span>
        </a>
        <a routerLink="/tasks/today" class="submenu-item">
          <span class="submenu-icon"><mat-icon>today</mat-icon></span>
          <span class="submenu-text">Hoje</span>
        </a>
      </div>
    </div>

    <!-- Seção: Organização -->
    <div class="nav-section">
      <div class="section-label">Organização</div>
      
      <a routerLink="/projects" class="nav-item">
        <span class="nav-icon"><mat-icon>folder</mat-icon></span>
        <span class="nav-text">Projetos</span>
      </a>
      
      <a routerLink="/tags" class="nav-item">
        <span class="nav-icon"><mat-icon>label</mat-icon></span>
        <span class="nav-text">Tags</span>
      </a>
    </div>

    <!-- Seção: Insights -->
    <div class="nav-section">
      <div class="section-label">Insights</div>
      
      <a routerLink="/analytics" class="nav-item">
        <span class="nav-icon"><mat-icon>analytics</mat-icon></span>
        <span class="nav-text">Análises</span>
      </a>
      
      <a routerLink="/reports" class="nav-item">
        <span class="nav-icon"><mat-icon>assessment</mat-icon></span>
        <span class="nav-text">Relatórios</span>
      </a>
    </div>
  </nav>

  <!-- Footer (opcional) -->
  <div class="sidebar-footer">
    <a href="/settings" class="footer-item">
      <mat-icon>settings</mat-icon>
      <span>Configurações</span>
    </a>
  </div>
</aside>

<!-- Overlay para mobile -->
<div class="sidebar-overlay" 
     [class.active]="isMobileOpen" 
     (click)="closeSidebar()">
</div>
```

---

## 🎯 Nova Estrutura do Header

### O que foi ADICIONADO:
- ✅ Notificações com badge
- ✅ Botão de tema (dark/light mode)
- ✅ Perfil do usuário completo
- ✅ Divisor visual entre ações e perfil

### Exemplo de Estrutura HTML:

```html
<header class="app-header" [class.scrolled]="isScrolled">
  
  <!-- Left: Logo + Breadcrumb -->
  <div class="header-left">
    <button class="sidebar-toggle" (click)="toggleSidebar()">
      <mat-icon>menu</mat-icon>
    </button>
    
    <a routerLink="/" class="header-logo">
      <img src="/assets/logo.svg" alt="Logo">
      <span class="logo-text">SmartCalendar</span>
    </a>
    
    <nav class="breadcrumb">
      <a routerLink="/dashboard" class="breadcrumb-item">
        <mat-icon>home</mat-icon>
        <span>Dashboard</span>
      </a>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item current">Calendário</span>
    </nav>
  </div>

  <!-- Center: Search -->
  <div class="header-center">
    <app-search-bar></app-search-bar>
  </div>

  <!-- Right: Actions + User -->
  <div class="header-right">
    
    <!-- Action Buttons -->
    <div class="header-actions">
      <button class="header-btn theme-toggle" (click)="toggleTheme()">
        <mat-icon>{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>
      
      <button class="header-btn notifications-btn" [matMenuTriggerFor]="notificationsMenu">
        <mat-icon>notifications</mat-icon>
        <span class="notification-badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
      </button>
    </div>

    <!-- Divider -->
    <div class="divider"></div>

    <!-- User Menu -->
    <button class="user-menu-btn" [matMenuTriggerFor]="userMenu">
      <div class="user-avatar">
        <img src="{{ user.avatar }}" *ngIf="user.avatar" alt="{{ user.name }}">
        <span *ngIf="!user.avatar">{{ user.initials }}</span>
        <span class="user-status" [class]="user.status"></span>
      </div>
      <div class="user-info">
        <span class="user-name">{{ user.name }}</span>
        <span class="user-role">{{ user.role }}</span>
      </div>
      <mat-icon>expand_more</mat-icon>
    </button>
  </div>
</header>

<!-- User Menu -->
<mat-menu #userMenu="matMenu" class="user-menu">
  <div class="user-menu-header">
    <div class="user-avatar-large">{{ user.initials }}</div>
    <div class="user-details">
      <strong>{{ user.name }}</strong>
      <small>{{ user.email }}</small>
    </div>
  </div>
  <mat-divider></mat-divider>
  <button mat-menu-item>
    <mat-icon>person</mat-icon>
    <span>Meu Perfil</span>
  </button>
  <button mat-menu-item>
    <mat-icon>settings</mat-icon>
    <span>Configurações</span>
  </button>
  <mat-divider></mat-divider>
  <button mat-menu-item (click)="logout()">
    <mat-icon>logout</mat-icon>
    <span>Sair</span>
  </button>
</mat-menu>

<!-- Notifications Menu -->
<mat-menu #notificationsMenu="matMenu" class="notifications-panel">
  <div class="notifications-header">
    <strong>Notificações</strong>
  </div>
  <div class="notifications-list">
    <!-- Notification items here -->
  </div>
</mat-menu>
```

---

## 🎭 Estados e Interações

### Sidebar
- **Default**: 240px de largura
- **Collapsed**: 72px (ícones centralizados)
- **Mobile**: Slide-in overlay
- **Hover**: Background sutil + escala do ícone
- **Active**: Gradiente + barra lateral colorida

### Header
- **Normal**: Background translúcido com blur
- **Scrolled**: Background mais opaco + shadow
- **Buttons hover**: Background sutil
- **Notifications**: Badge animado com pulse

### Animações
```scss
// Fade in
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

// Slide in (submenus)
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Badge pulse
@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

---

## 📏 Dimensões e Espaçamentos

### Sidebar
- Width: 240px (collapsed: 72px)
- Header padding: 1.25rem 1rem
- Nav padding: 1rem 0.75rem
- Nav item height: 40px
- Border radius: 8px (items), 6px (submenus)
- Gap entre seções: 1.5rem

### Header
- Min height: 64px (mobile: 56px)
- Padding: 0.75rem 1.5rem
- Avatar: 32px (mobile: 28px)
- Button: 40px × 40px (mobile: 36px)
- Notification badge: 18px

---

## 🎯 Melhorias de UX Implementadas

### 1. **Hierarquia Visual Melhorada**
- Labels de seção em uppercase pequeno
- Espaçamento generoso entre seções
- Cores mais sutis para elementos secundários

### 2. **Feedback Tátil**
- Todos os botões têm `:active { transform: scale(0.95) }`
- Hover states claros e consistentes
- Animações suaves (0.2s)

### 3. **Acessibilidade**
- Suporte nativo a dark mode (`prefers-color-scheme`)
- Suporte a `prefers-reduced-motion`
- Tamanhos de toque adequados (min 40px)
- Alto contraste de cores

### 4. **Responsividade Inteligente**
- Sidebar vira overlay no mobile
- Header esconde elementos menos importantes
- Breadcrumb some em telas pequenas
- User info esconde em tablets

### 5. **Performance**
- Backdrop filter otimizado
- Animações com GPU (transform, opacity)
- Transições apenas nas propriedades necessárias

---

## 🚀 Próximos Passos Sugeridos

1. ✅ Implementar tema dark/light toggle funcional
2. ✅ Adicionar panel de notificações completo
3. ✅ Criar search bar com autocomplete
4. ✅ Adicionar quick actions no header
5. ✅ Implementar breadcrumb dinâmico
6. ✅ Adicionar tooltips nos ícones (collapsed state)

---

## 💡 Dicas de Implementação

### TypeScript Component
```typescript
export class SidebarComponent {
  isCollapsed = false;
  isMobileOpen = false;
  submenuOpen: { [key: string]: boolean } = {};

  toggleSidebar() {
    if (window.innerWidth < 992) {
      this.isMobileOpen = !this.isMobileOpen;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  toggleSubmenu(key: string) {
    this.submenuOpen[key] = !this.submenuOpen[key];
  }

  closeSidebar() {
    this.isMobileOpen = false;
  }
}
```

### Dica de Performance
```typescript
// Use ChangeDetectionStrategy.OnPush para melhor performance
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

---

**Criado com ❤️ para o SmartCalendar**
