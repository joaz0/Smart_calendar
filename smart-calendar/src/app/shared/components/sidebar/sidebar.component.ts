import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface SidebarTab {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() collapsed = false;

  isCollapsed = false;
  activeTab = 'calendar';

  tabs: SidebarTab[] = [
    { id: 'calendar', label: 'Calendário', icon: 'calendar_today' },
    { id: 'projects', label: 'Projetos', icon: 'task_alt' },
    { id: 'graph', label: 'Grafo', icon: 'device_hub' },
    { id: 'search', label: 'Buscar', icon: 'search' }
  ];

  setActiveTab(tabId: string): void {
    if (this.activeTab === tabId && !this.isCollapsed) {
      this.isCollapsed = true;
    } else {
      this.activeTab = tabId;
      this.isCollapsed = false;
    }
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  getActiveLabel(): string {
    return this.tabs.find((t) => t.id === this.activeTab)?.label || '';
  }
}
