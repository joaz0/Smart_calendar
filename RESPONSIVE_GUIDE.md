# Guia de Responsividade - Smart Calendar

## 📱 Visão Geral

O Smart Calendar foi completamente otimizado para funcionar perfeitamente em todos os dispositivos, desde smartphones até desktops de alta resolução.

## 🎯 Breakpoints

### Definições
- **Mobile**: 0px - 767px
- **Tablet**: 768px - 991px  
- **Desktop**: 992px+

### Breakpoints Específicos
- `xs`: 0px
- `sm`: 576px
- `md`: 768px
- `lg`: 992px
- `xl`: 1200px
- `xxl`: 1400px

## 🛠️ Mixins Disponíveis

### Mixins de Breakpoint
```scss
@include mobile-only { /* estilos mobile */ }
@include tablet-only { /* estilos tablet */ }
@include desktop-only { /* estilos desktop */ }
@include mobile-tablet { /* mobile + tablet */ }

@include respond-to(md) { /* min-width: 768px */ }
@include respond-below(lg) { /* max-width: 991px */ }
@include respond-between(md, lg) { /* 768px - 991px */ }
```

### Container Responsivo
```scss
@include container-responsive;
```

## 📐 Componentes Responsivos

### Cards
```html
<div class="responsive-card">
  <!-- Conteúdo do card -->
</div>
```

### Grid de Dashboard
```html
<div class="dashboard-grid">
  <div class="responsive-card">Card 1</div>
  <div class="responsive-card">Card 2</div>
  <div class="responsive-card">Card 3</div>
  <div class="responsive-card">Card 4</div>
</div>
```

### Formulários
```html
<form class="responsive-form">
  <div class="form-row">
    <div class="form-group">
      <input class="form-control" type="text">
    </div>
    <div class="form-group">
      <input class="form-control" type="email">
    </div>
  </div>
  
  <div class="form-actions">
    <button class="btn btn-primary">Salvar</button>
    <button class="btn btn-secondary">Cancelar</button>
  </div>
</form>
```

### Modais
```html
<div class="responsive-modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Título do Modal</h2>
      <button class="close-btn">&times;</button>
    </div>
    <!-- Conteúdo do modal -->
  </div>
</div>
```

### Tabelas
```html
<div class="responsive-table">
  <table>
    <thead>
      <tr>
        <th>Coluna 1</th>
        <th>Coluna 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Dados 1</td>
        <td>Dados 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

## 🎨 Classes Utilitárias

### Visibilidade
```html
<div class="d-desktop">Visível apenas no desktop</div>
<div class="d-tablet">Visível apenas no tablet</div>
<div class="d-mobile">Visível apenas no mobile</div>
<div class="d-mobile-tablet">Visível no mobile e tablet</div>
```

### Espaçamento
```html
<div class="p-responsive">Padding responsivo</div>
<div class="m-responsive">Margin responsivo</div>
```

### Texto
```html
<p class="text-responsive">Texto com tamanho responsivo</p>
<h1 class="heading-responsive">Título responsivo</h1>
```

### Flexbox
```html
<div class="flex-responsive">
  <!-- Flex row no desktop, column no mobile -->
</div>
```

### Grid
```html
<div class="grid grid-3">
  <!-- 3 colunas no desktop, 2 no tablet, 1 no mobile -->
</div>
```

## 📱 Otimizações Mobile

### Prevenção de Zoom no iOS
- Inputs com `font-size: 16px` para prevenir zoom automático
- Meta tag viewport otimizada

### Touch-Friendly
- Botões com tamanho mínimo de 44px
- Áreas de toque adequadas
- Scroll suave com `-webkit-overflow-scrolling: touch`

### Performance
- Lazy loading de imagens
- Compressão de assets
- Otimização de animações

## 🎯 Componentes Específicos

### Header
- Menu hambúrguer no mobile/tablet
- Logo adaptável
- Ações condensadas em telas pequenas

### Sidebar
- Overlay no mobile/tablet
- Colapso automático
- Navegação touch-friendly

### Calendário
- Grid adaptável
- Eventos condensados no mobile
- Navegação otimizada

### Formulários
- Campos empilhados no mobile
- Botões full-width
- Validação visual clara

## 🔧 Configurações Importantes

### Meta Tags (index.html)
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#6d3bf7">
```

### CSS Reset
```css
* {
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## 📊 Testes de Responsividade

### Dispositivos Testados
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPad (768px)
- iPad Pro (1024px)
- Desktop HD (1920px)
- Desktop 4K (3840px)

### Ferramentas de Teste
- Chrome DevTools
- Firefox Responsive Design Mode
- Safari Web Inspector
- BrowserStack (recomendado)

## 🚀 Melhores Práticas

### CSS
1. Use sempre mobile-first approach
2. Prefira `rem` e `em` para tamanhos
3. Use `vw` e `vh` com cuidado
4. Evite `position: fixed` desnecessário

### JavaScript
1. Teste eventos touch
2. Considere orientação do dispositivo
3. Otimize performance para mobile

### Imagens
1. Use `srcset` para imagens responsivas
2. Comprima imagens adequadamente
3. Use formatos modernos (WebP, AVIF)

### Acessibilidade
1. Mantenha contraste adequado
2. Tamanhos de fonte legíveis
3. Navegação por teclado funcional

## 🐛 Problemas Comuns e Soluções

### Zoom Indesejado no iOS
```css
input, select, textarea {
  font-size: 16px !important;
}
```

### Scroll Horizontal
```css
body, html {
  overflow-x: hidden;
}
```

### Altura 100vh no Mobile
```css
.full-height {
  height: 100vh;
  height: -webkit-fill-available;
}
```

### Hover em Touch Devices
```css
@media (hover: hover) {
  .element:hover {
    /* estilos hover apenas para dispositivos com hover real */
  }
}
```

## 📈 Performance

### Métricas Alvo
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

### Otimizações Implementadas
- Lazy loading de componentes
- Tree shaking
- Compressão gzip/brotli
- Service Worker para cache
- Critical CSS inline

## 🔄 Atualizações Futuras

### Planejado
- Suporte a dobráveis (foldables)
- Otimizações para Apple Vision Pro
- Melhorias de acessibilidade
- Temas adaptativos por dispositivo

---

**Nota**: Este guia é atualizado regularmente. Consulte sempre a versão mais recente para as melhores práticas atuais.