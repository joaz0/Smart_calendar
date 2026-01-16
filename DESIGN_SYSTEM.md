# 🎨 Design System - Smart Calendar

## Paleta de Cores

### Cores Principais
```scss
// Primary - Roxo
--primary-50: #f3e5f5;
--primary-100: #e1bee7;
--primary-200: #ce93d8;
--primary-300: #ba68c8;
--primary-400: #ab47bc;
--primary-500: #9c27b0;  // Main
--primary-600: #8e24aa;
--primary-700: #7b1fa2;
--primary-800: #6a1b9a;
--primary-900: #4a148c;

// Accent - Roxo Claro
--accent-50: #ede7f6;
--accent-100: #d1c4e9;
--accent-200: #b39ddb;
--accent-300: #9575cd;
--accent-400: #7e57c2;
--accent-500: #673ab7;  // Main
--accent-600: #5e35b1;
--accent-700: #512da8;
--accent-800: #4527a0;
--accent-900: #311b92;
```

### Cores Neutras
```scss
// Light Theme
--bg-light: #ffffff;
--surface-light: #f5f5f5;
--text-light: #212121;
--text-secondary-light: #757575;

// Dark Theme
--bg-dark: #121212;
--surface-dark: #1e1e1e;
--text-dark: #ffffff;
--text-secondary-dark: #b0b0b0;
```

### Cores Semânticas
```scss
--success: #4caf50;
--warning: #ff9800;
--error: #f44336;
--info: #2196f3;
```

## Tipografia

### Família de Fontes
```scss
--font-primary: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Roboto Mono', 'Courier New', monospace;
```

### Escala Tipográfica
```scss
--text-xs: 0.75rem;    // 12px
--text-sm: 0.875rem;   // 14px
--text-base: 1rem;     // 16px
--text-lg: 1.125rem;   // 18px
--text-xl: 1.25rem;    // 20px
--text-2xl: 1.5rem;    // 24px
--text-3xl: 1.875rem;  // 30px
--text-4xl: 2.25rem;   // 36px
```

### Pesos
```scss
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Espaçamento

```scss
--space-1: 0.25rem;   // 4px
--space-2: 0.5rem;    // 8px
--space-3: 0.75rem;   // 12px
--space-4: 1rem;      // 16px
--space-5: 1.25rem;   // 20px
--space-6: 1.5rem;    // 24px
--space-8: 2rem;      // 32px
--space-10: 2.5rem;   // 40px
--space-12: 3rem;     // 48px
--space-16: 4rem;     // 64px
```

## Bordas

### Raios
```scss
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

### Larguras
```scss
--border-thin: 1px;
--border-medium: 2px;
--border-thick: 4px;
```

## Sombras

```scss
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
```

## Glass Morphism

```scss
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-card-dark {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

## Animações

### Durações
```scss
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

### Easings
```scss
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

## Breakpoints

```scss
--breakpoint-xs: 0px;
--breakpoint-sm: 600px;
--breakpoint-md: 960px;
--breakpoint-lg: 1280px;
--breakpoint-xl: 1920px;
```

## Z-Index

```scss
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

## Componentes

### Botões
```scss
.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  transition: all var(--duration-normal) var(--ease-out);
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Cards
```scss
.card {
  background: var(--surface-light);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}
```

### Inputs
```scss
.input {
  padding: var(--space-3) var(--space-4);
  border: var(--border-thin) solid rgba(0, 0, 0, 0.12);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  transition: border-color var(--duration-fast);
}

.input:focus {
  border-color: var(--primary-500);
  outline: none;
  box-shadow: 0 0 0 3px rgba(156, 39, 176, 0.1);
}
```

## Acessibilidade

### Contraste Mínimo
- Texto normal: 4.5:1
- Texto grande: 3:1
- Elementos UI: 3:1

### Focus States
```scss
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

## Uso

### SCSS
```scss
@import 'design-tokens';

.my-component {
  color: var(--primary-500);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}
```

### TypeScript
```typescript
import { COLORS, SPACING } from '@core/design-tokens';

const styles = {
  color: COLORS.primary[500],
  padding: SPACING[4]
};
```
