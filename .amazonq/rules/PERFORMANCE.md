TrackBy obrigatório em *ngFor:

<!-- Template -->
<div *ngFor="let item of items; trackBy: trackByFn">

// Component
trackByFn(index: number, item: Item): number {
  return item.id || index;
}
