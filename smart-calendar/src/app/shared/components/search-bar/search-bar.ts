import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  meta?: string;
  icon?: string;
  route?: string;
  data?: any;
}

interface SearchGroup {
  name: string;
  icon: string;
  items: SearchResult[];
  count: number;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  callback: () => void;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatRippleModule
  ],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBar implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
  @ViewChild('resultsContainer') resultsContainer?: ElementRef<HTMLDivElement>;

  // Configurações
  @Input() placeholder: string = 'Buscar...';
  @Input() debounceTime: number = 300;
  @Input() minSearchLength: number = 2;
  @Input() maxResults: number = 50;
  @Input() showRecentSearches: boolean = true;
  @Input() showQuickActions: boolean = true;
  @Input() groupResults: boolean = true;
  @Input() highlightTerms: boolean = true;
  @Input() autoFocus: boolean = false;
  @Input() clearOnSelect: boolean = false;

  // Dados
  @Input() results: SearchResult[] = [];
  @Input() quickActions: QuickAction[] = [];
  @Input() recentSearches: string[] = [];

  // Estados
  @Input() isSearching: boolean = false;
  @Input() disabled: boolean = false;

  // Eventos
  @Output() searchQuery = new EventEmitter<string>();
  @Output() resultSelected = new EventEmitter<SearchResult>();
  @Output() actionExecuted = new EventEmitter<QuickAction>();
  @Output() recentSearchSelected = new EventEmitter<string>();
  @Output() searchCleared = new EventEmitter<void>();
  @Output() focusChanged = new EventEmitter<boolean>();

  // Estados internos
  searchTerm: string = '';
  showResults: boolean = false;
  groupedResults: SearchGroup[] = [];
  highlightedIndex: number = -1;
  highlightedGroupIndex: number = -1;

  private searchSubject$ = new Subject<string>();
  private destroy$ = new Subject<void>();
  private maxRecentSearches = 10;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadRecentSearches();

    if (this.autoFocus) {
      setTimeout(() => this.focus(), 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject$
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => {
        if (term.length >= this.minSearchLength) {
          this.performSearch(term);
        } else if (term.length === 0) {
          this.clearResults();
        }
      });
  }

  private loadRecentSearches(): void {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        this.recentSearches = JSON.parse(saved);
        this.cdr.markForCheck();
      } catch (error) {
        console.error('Erro ao carregar buscas recentes:', error);
      }
    }
  }

  private saveRecentSearch(term: string): void {
    if (!term.trim()) return;

    // Remover se já existe
    this.recentSearches = this.recentSearches.filter(s => s !== term);

    // Adicionar no início
    this.recentSearches.unshift(term);

    // Limitar quantidade
    if (this.recentSearches.length > this.maxRecentSearches) {
      this.recentSearches = this.recentSearches.slice(0, this.maxRecentSearches);
    }

    // Salvar no localStorage
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    this.cdr.markForCheck();
  }

  // Busca
  onSearchInput(): void {
    this.searchSubject$.next(this.searchTerm);
    this.highlightedIndex = -1;
    this.highlightedGroupIndex = -1;
  }

  private performSearch(term: string): void {
    this.isSearching = true;
    this.searchQuery.emit(term);
    this.cdr.markForCheck();
  }

  private clearResults(): void {
    this.results = [];
    this.groupedResults = [];
    this.isSearching = false;
    this.cdr.markForCheck();
  }

  // Quando results são atualizados externamente
  ngOnChanges(changes: any): void {
    if (changes.results && this.results) {
      this.updateGroupedResults();
      this.isSearching = false;
      this.cdr.markForCheck();
    }
  }

  private updateGroupedResults(): void {
    if (!this.groupResults) {
      this.groupedResults = [{
        name: 'Resultados',
        icon: 'search',
        items: this.results.slice(0, this.maxResults),
        count: this.results.length
      }];
      return;
    }

    const groups = new Map<string, SearchResult[]>();

    this.results.forEach(result => {
      const type = result.type || 'outros';
      if (!groups.has(type)) {
        groups.set(type, []);
      }
      groups.get(type)!.push(result);
    });

    this.groupedResults = Array.from(groups.entries()).map(([type, items]) => ({
      name: this.getGroupName(type),
      icon: this.getGroupIcon(type),
      items: items.slice(0, this.maxResults),
      count: items.length
    }));
  }

  private getGroupName(type: string): string {
    const names: Record<string, string> = {
      event: 'Eventos',
      task: 'Tarefas',
      contact: 'Contatos',
      document: 'Documentos',
      page: 'Páginas',
      setting: 'Configurações'
    };
    return names[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }

  private getGroupIcon(type: string): string {
    const icons: Record<string, string> = {
      event: 'event',
      task: 'task_alt',
      contact: 'person',
      document: 'description',
      page: 'pages',
      setting: 'settings'
    };
    return icons[type] || 'label';
  }

  // Seleção
  selectResult(result: SearchResult, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.saveRecentSearch(this.searchTerm);
    this.resultSelected.emit(result);

    if (this.clearOnSelect) {
      this.clearSearch();
    } else {
      this.closeResults();
    }
  }

  selectRecentSearch(search: string): void {
    this.searchTerm = search;
    this.onSearchInput();
    this.recentSearchSelected.emit(search);
  }

  executeQuickAction(action: QuickAction, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    action.callback();
    this.actionExecuted.emit(action);
    this.closeResults();
  }

  // Limpeza
  clearSearch(): void {
    this.searchTerm = '';
    this.clearResults();
    this.closeResults();
    this.searchCleared.emit();
    this.cdr.markForCheck();
  }

  removeRecentSearch(search: string, event: Event): void {
    event.stopPropagation();
    this.recentSearches = this.recentSearches.filter(s => s !== search);
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    this.cdr.markForCheck();
  }

  clearRecentSearches(): void {
    this.recentSearches = [];
    localStorage.removeItem('recentSearches');
    this.cdr.markForCheck();
  }

  // Controles de foco
  onFocus(): void {
    this.showResults = true;
    this.focusChanged.emit(true);
    this.cdr.markForCheck();
  }

  onBlur(): void {
    // Delay para permitir cliques nos resultados
    setTimeout(() => {
      this.closeResults();
    }, 200);
  }

  focus(): void {
    this.searchInput?.nativeElement.focus();
  }

  closeResults(): void {
    this.showResults = false;
    this.highlightedIndex = -1;
    this.highlightedGroupIndex = -1;
    this.focusChanged.emit(false);
    this.cdr.markForCheck();
  }

  // Navegação por teclado
  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.showResults) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closeResults();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateDown();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateUp();
        break;
      case 'Enter':
        event.preventDefault();
        this.selectHighlighted();
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeResults();
    }
  }

  private navigateDown(): void {
    const totalItems = this.getTotalItems();
    if (totalItems === 0) return;

    this.highlightedIndex = (this.highlightedIndex + 1) % totalItems;
    this.updateHighlightedGroup();
    this.scrollToHighlighted();
    this.cdr.markForCheck();
  }

  private navigateUp(): void {
    const totalItems = this.getTotalItems();
    if (totalItems === 0) return;

    this.highlightedIndex = this.highlightedIndex <= 0
      ? totalItems - 1
      : this.highlightedIndex - 1;
    this.updateHighlightedGroup();
    this.scrollToHighlighted();
    this.cdr.markForCheck();
  }

  private getTotalItems(): number {
    return this.groupedResults.reduce((sum, group) => sum + group.items.length, 0);
  }

  private updateHighlightedGroup(): void {
    let count = 0;
    for (let i = 0; i < this.groupedResults.length; i++) {
      count += this.groupedResults[i].items.length;
      if (this.highlightedIndex < count) {
        this.highlightedGroupIndex = i;
        break;
      }
    }
  }

  private selectHighlighted(): void {
    if (this.highlightedIndex < 0) return;

    let count = 0;
    for (const group of this.groupedResults) {
      if (this.highlightedIndex < count + group.items.length) {
        const localIndex = this.highlightedIndex - count;
        this.selectResult(group.items[localIndex]);
        return;
      }
      count += group.items.length;
    }
  }

  private scrollToHighlighted(): void {
    setTimeout(() => {
      const highlighted = this.resultsContainer?.nativeElement
        .querySelector('.result-item.highlighted');
      if (highlighted) {
        highlighted.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  // Highlight de termos
  highlightSearchTerm(text: string): string {
    if (!this.highlightTerms || !this.searchTerm || !text) {
      return text;
    }

    const terms = this.searchTerm.split(' ').filter(t => t.length > 0);
    let result = text;

    terms.forEach(term => {
      const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
      result = result.replace(regex, '<mark>$1</mark>');
    });

    return result;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Helpers
  isItemHighlighted(groupIndex: number, itemIndex: number): boolean {
    if (this.highlightedGroupIndex !== groupIndex) return false;

    let count = 0;
    for (let i = 0; i < groupIndex; i++) {
      count += this.groupedResults[i].items.length;
    }

    return this.highlightedIndex === count + itemIndex;
  }

  get hasResults(): boolean {
    return this.groupedResults.some(group => group.items.length > 0);
  }

  get showNoResults(): boolean {
    return !this.isSearching &&
           this.searchTerm.length >= this.minSearchLength &&
           !this.hasResults;
  }

  get showEmptyState(): boolean {
    return !this.searchTerm &&
           this.showRecentSearches &&
           this.recentSearches.length === 0 &&
           (!this.showQuickActions || this.quickActions.length === 0);
  }

  // TrackBy
  trackByGroup(index: number, group: SearchGroup): string {
    return group.name;
  }

  trackByResult(index: number, result: SearchResult): string {
    return result.id;
  }

  trackByAction(index: number, action: QuickAction): string {
    return action.id;
  }

  trackBySearch(index: number, search: string): string {
    return search;
  }
}
