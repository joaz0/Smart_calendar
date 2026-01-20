# 📱 Guia de Responsividade - Smart Calendar

## Breakpoints

### Sistema de Breakpoints
```scss
$breakpoints: (
  xs: 0px,      // Mobile portrait
  sm: 600px,    // Mobile landscape
  md: 960px,    // Tablet
  lg: 1280px,   // Desktop
  xl: 1920px    // Large desktop
);
```

### Media Queries
```scss
// Mobile First
@mixin mobile {
  @media (max-width: 599px) { @content; }
}

@mixin tablet {
  @media (min-width: 600px) and (max-width: 959px) { @content; }
}

@mixin desktop {
  @media (min-width: 960px) { @content; }
}

@mixin large-desktop {
  @media (min-width: 1280px) { @content; }
}
```

## Grid System

### Container
```scss
.container {
  width: 100%;
  padding: 0 16px;
  margin: 0 auto;

  @media (min-width: 600px) { max-width: 600px; }
  @media (min-width: 960px) { max-width: 960px; }
  @media (min-width: 1280px) { max-width: 1280px; }
  @media (min-width: 1920px) { max-width: 1920px; }
}
```

### Grid
```scss
.grid {
  display: grid;
  gap: 16px;
  
  // Mobile: 1 coluna
  grid-template-columns: 1fr;
  
  // Tablet: 2 colunas
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  // Desktop: 3 colunas
  @media (min-width: 960px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  // Large: 4 colunas
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

## Componentes Responsivos

### Calendário

#### Mobile (< 600px)
```scss
.calendar-view {
  // Agenda list view
  display: flex;
  flex-direction: column;
  
  .calendar-header {
    padding: 12px;
    font-size: 18px;
  }
  
  .calendar-grid {
    display: none; // Esconde grid no mobile
  }
  
  .agenda-list {
    display: block;
  }
}
```

#### Tablet (600px - 959px)
```scss
@media (min-width: 600px) {
  .calendar-view {
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
    
    .day-cell {
      min-height: 80px;
      font-size: 14px;
    }
  }
}
```

#### Desktop (≥ 960px)
```scss
@media (min-width: 960px) {
  .calendar-view {
    display: grid;
    grid-template-columns: 250px 1fr;
    
    .sidebar {
      display: block;
    }
    
    .day-cell {
      min-height: 120px;
      font-size: 16px;
    }
  }
}
```

### Sidebar

```scss
.sidebar {
  // Mobile: drawer overlay
  @media (max-width: 959px) {
    position: fixed;
    top: 0;
    left: -280px;
    width: 280px;
    height: 100vh;
    background: white;
    transition: left 0.3s;
    z-index: 1000;
    
    &.open {
      left: 0;
    }
  }
  
  // Desktop: sempre visível
  @media (min-width: 960px) {
    position: relative;
    width: 280px;
    left: 0;
  }
}
```

### Dialogs/Modals

```scss
.dialog {
  // Mobile: fullscreen
  @media (max-width: 599px) {
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
  }
  
  // Tablet: 80% width
  @media (min-width: 600px) and (max-width: 959px) {
    width: 80vw;
    max-width: 600px;
    border-radius: 12px;
  }
  
  // Desktop: fixed width
  @media (min-width: 960px) {
    width: 600px;
    max-width: 90vw;
  }
}
```

### Tabelas

```scss
.table-responsive {
  // Mobile: cards
  @media (max-width: 599px) {
    .table {
      display: none;
    }
    
    .card-list {
      display: block;
      
      .card-item {
        margin-bottom: 12px;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
    }
  }
  
  // Tablet+: table normal
  @media (min-width: 600px) {
    .table {
      display: table;
    }
    
    .card-list {
      display: none;
    }
  }
}
```

## Tipografia Responsiva

```scss
.heading-1 {
  font-size: 24px;
  
  @media (min-width: 600px) { font-size: 30px; }
  @media (min-width: 960px) { font-size: 36px; }
}

.heading-2 {
  font-size: 20px;
  
  @media (min-width: 600px) { font-size: 24px; }
  @media (min-width: 960px) { font-size: 28px; }
}

.body-text {
  font-size: 14px;
  line-height: 1.5;
  
  @media (min-width: 960px) {
    font-size: 16px;
    line-height: 1.6;
  }
}
```

## Espaçamento Responsivo

```scss
.section {
  padding: 16px;
  
  @media (min-width: 600px) { padding: 24px; }
  @media (min-width: 960px) { padding: 32px; }
  @media (min-width: 1280px) { padding: 48px; }
}
```

## Imagens Responsivas

```scss
.responsive-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  
  // Mobile: aspect ratio 16:9
  @media (max-width: 599px) {
    aspect-ratio: 16/9;
  }
  
  // Desktop: aspect ratio 21:9
  @media (min-width: 960px) {
    aspect-ratio: 21/9;
  }
}
```

## Touch Targets

```scss
// Mínimo 44x44px para touch
.btn-mobile {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
  
  @media (min-width: 960px) {
    min-height: 36px;
    min-width: auto;
    padding: 8px 16px;
  }
}
```

## Navegação Responsiva

```scss
.nav {
  // Mobile: bottom navigation
  @media (max-width: 599px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    padding: 8px;
    background: white;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
    
    .nav-item {
      flex-direction: column;
      font-size: 12px;
      
      .icon {
        font-size: 24px;
      }
    }
  }
  
  // Desktop: top navigation
  @media (min-width: 960px) {
    position: relative;
    display: flex;
    gap: 24px;
    
    .nav-item {
      flex-direction: row;
      font-size: 16px;
    }
  }
}
```

## Utilities

### Display
```scss
.hide-mobile { @media (max-width: 599px) { display: none !important; } }
.hide-tablet { @media (min-width: 600px) and (max-width: 959px) { display: none !important; } }
.hide-desktop { @media (min-width: 960px) { display: none !important; } }

.show-mobile { @media (min-width: 600px) { display: none !important; } }
.show-tablet { @media (max-width: 599px), (min-width: 960px) { display: none !important; } }
.show-desktop { @media (max-width: 959px) { display: none !important; } }
```

## Boas Práticas

### 1. Mobile First
```scss
// ✅ Correto
.element {
  width: 100%;
  
  @media (min-width: 960px) {
    width: 50%;
  }
}

// ❌ Evitar
.element {
  width: 50%;
  
  @media (max-width: 959px) {
    width: 100%;
  }
}
```

### 2. Viewport Units
```scss
// Altura mínima considerando mobile browsers
.full-height {
  min-height: 100vh;
  min-height: -webkit-fill-available;
}
```

### 3. Flexbox/Grid
```scss
// Preferir flexbox/grid ao invés de floats
.layout {
  display: flex;
  flex-direction: column;
  
  @media (min-width: 960px) {
    flex-direction: row;
  }
}
```

### 4. Performance
```scss
// Usar transform ao invés de position para animações
.animated {
  transform: translateX(0);
  transition: transform 0.3s;
  
  &.active {
    transform: translateX(100%);
  }
}
```

## Testing

### Dispositivos para Testar
- 📱 iPhone SE (375px)
- 📱 iPhone 12/13/14 (390px)
- 📱 iPhone 14 Pro Max (430px)
- 📱 Samsung Galaxy S21 (360px)
- 📱 iPad Mini (768px)
- 📱 iPad Pro (1024px)
- 💻 Desktop 1280px
- 💻 Desktop 1920px

### Chrome DevTools
```bash
# Testar diferentes viewports
Cmd/Ctrl + Shift + M (Toggle device toolbar)
```

## Angular Material Breakpoints

```typescript
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

constructor(private breakpointObserver: BreakpointObserver) {
  this.breakpointObserver.observe([
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge
  ]).subscribe(result => {
    this.isMobile = result.breakpoints[Breakpoints.XSmall];
    this.isTablet = result.breakpoints[Breakpoints.Small];
    this.isDesktop = result.breakpoints[Breakpoints.Medium];
  });
}
```
