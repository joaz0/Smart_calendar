import { Component } from '@angular/core';


@Component({
  selector: 'app-quick-links-manager',
  standalone: true,
  imports: [],
  templateUrl: './quick-links-manager.html',
  styleUrl: './quick-links-manager.scss',
})
export class QuickLinksManagerComponent {
  links: { title: string; url: string }[] = [];

  constructor() {
    // placeholder data
    this.links = [
      { title: 'Calendário', url: '/calendar' },
      { title: 'Tarefas', url: '/tasks' },
    ];
  }
}
