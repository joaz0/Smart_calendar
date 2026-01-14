# 🎨 Sistema de Design - Smart Calendar

## Cores Principais

### Gradientes (Essência do Sistema)
- `--gradient-primary`: Gradiente principal (preto → roxo)
- `--gradient-card`: Gradiente para cards (preto transparente → roxo)
- `--gradient-button`: Gradiente para botões (roxo → roxo claro)

### Cores de Status
- `--success-500`: #43e97b (Verde)
- `--warning-500`: #ffa726 (Laranja)
- `--error-500`: #ef5350 (Vermelho)
- `--info-500`: #29b6f6 (Azul)

## Componentes Reutilizáveis

### Glass Card
```html
<app-glass-card title="Título" icon="event" iconColor="#5b0bdc">
  Conteúdo aqui
  <div footer>Rodapé opcional</div>
</app-glass-card>
```

### Botões
```html
<button class="btn-primary">Primário</button>
<button class="btn-secondary">Secundário</button>
```

### Inputs
```html
<input class="input-glow" placeholder="Digite...">
```

### Badges
```html
<span class="badge-success">Sucesso</span>
<span class="badge-warning">Aviso</span>
<span class="badge-error">Erro</span>
<span class="badge-info">Info</span>
```

## Mixins SCSS

### Card com Efeito Glass
```scss
.meu-card {
  @include glass-card;
}
```

### Grid Responsivo
```scss
.minha-grid {
  @include grid-responsive(300px); // min-width dos itens
}
```

### Container
```scss
.meu-container {
  @include container; // max-width 1400px, padding responsivo
}
```

### Scrollbar Customizado
```scss
.minha-area {
  @include custom-scrollbar;
}
```

## Classes Utilitárias

### Layout
- `.container` - Container responsivo
- `.grid-responsive` - Grid auto-fit
- `.flex` - Display flex
- `.flex-center` - Flex centralizado
- `.flex-between` - Flex space-between
- `.flex-col` - Flex column

### Espaçamento
- `.gap-2`, `.gap-4`, `.gap-6` - Gaps
- `.p-4`, `.p-6` - Padding
- `.m-4`, `.mb-4` - Margin

### Texto
- `.text-primary`, `.text-secondary` - Cores de texto
- `.text-center` - Texto centralizado
- `.font-bold`, `.font-semibold` - Pesos de fonte

### Animações
- `.fade-in` - Fade in suave
- `.animate-pulse` - Pulsação

## Tokens de Espaçamento
- `--space-1` a `--space-24` - Escala responsiva com clamp()

## Tokens de Tipografia
- `--font-size-xs` a `--font-size-5xl` - Tamanhos responsivos

## Exemplo Completo
```html
<div class="container">
  <div class="grid-responsive">
    <app-glass-card title="Card 1" icon="event">
      <p class="text-secondary">Conteúdo</p>
      <button class="btn-primary">Ação</button>
    </app-glass-card>
  </div>
</div>
```
