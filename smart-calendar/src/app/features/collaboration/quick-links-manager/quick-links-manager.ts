import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quick-links-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-links-manager.html',
  styleUrl: './quick-links-manager.scss',
})
export class QuickLinksManager {
  links: Array<{ title: string; url: string }> = [];

  constructor() {
    // placeholder data
    this.links = [
      { title: 'Calendário', url: '/calendar' },
      { title: 'Tarefas', url: '/tasks' },
    ];
  }
}
