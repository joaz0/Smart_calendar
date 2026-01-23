import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { EventTemplateService, EventTemplate } from '../../../core/services/templates/event-template.service';
import { TEMPLATE_CATEGORY_COLORS } from '../../../shared/tokens/color-tokens';

@Component({
  standalone: true,
  selector: 'app-event-template-library',
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule
],
  templateUrl: './event-template-library.component.html',
  styleUrl: './event-template-library.component.scss'
})
export class EventTemplateLibraryComponent implements OnInit, OnDestroy {
  private templateService = inject(EventTemplateService);
  private dialog = inject(MatDialog);

  private destroy$ = new Subject<void>();

  templates: EventTemplate[] = [];
  filteredTemplates: EventTemplate[] = [];
  selectedCategory = 'all';
  searchTerm = '';

  categories = [
    { value: 'all', label: 'Todos' },
    { value: 'work', label: 'Trabalho' },
    { value: 'personal', label: 'Pessoal' },
    { value: 'health', label: 'Saúde' },
    { value: 'social', label: 'Social' },
    { value: 'education', label: 'Educação' },
    { value: 'other', label: 'Outro' }
  ];

  ngOnInit() {
    this.templateService.templates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(templates => {
        this.templates = templates;
        this.filterTemplates();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterTemplates() {
    let filtered = this.templates;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(term) ||
        t.description?.toLowerCase().includes(term)
      );
    }

    this.filteredTemplates = filtered.sort((a, b) => b.usageCount - a.usageCount);
  }

  onCategoryChange() {
    this.filterTemplates();
  }

  onSearch() {
    this.filterTemplates();
  }

  useTemplate(template: EventTemplate) {
    this.templateService.incrementUsage(template.id);
    alert(`Template "${template.name}" será usado para criar um novo evento`);
  }

  editTemplate(template: EventTemplate) {
    console.log('Edit template:', template);
  }

  deleteTemplate(template: EventTemplate) {
    if (confirm(`Tem certeza que deseja excluir o template "${template.name}"?`)) {
      this.templateService.deleteTemplate(template.id).subscribe();
    }
  }

  getCategoryLabel(category: string): string {
    return this.categories.find(c => c.value === category)?.label || category;
  }

  getCategoryColor(category: string): string {
    return TEMPLATE_CATEGORY_COLORS[category as keyof typeof TEMPLATE_CATEGORY_COLORS] || TEMPLATE_CATEGORY_COLORS.other;
  }

  trackByTemplate(index: number, template: EventTemplate): string {
    return template.id;
  }
}
