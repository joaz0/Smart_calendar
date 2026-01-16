Acessibilidade Obrigatória:

<!-- ❌ RUIM -->
<label>Nome</label>
<input type="text" [(ngModel)]="name">

<!-- ✅ BOM -->
<label for="nameInput">Nome</label>
<input id="nameInput" type="text" [(ngModel)]="name">

<!-- OU -->
<label>
  Nome
  <input type="text" [(ngModel)]="name">
</label>

Eventos DOM Personalizados:

// ❌ RUIM (usa nome padrão do DOM)
@Output() click = new EventEmitter();

// ✅ BOM (usa nome customizado)
@Output() itemClick = new EventEmitter();
@Output() confirmAction = new EventEmitter();
