import { Component, EventEmitter, Output, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventService } from '../../../core/services/event.service';
import { TaskService } from '../../../core/services/task.service';
import { CalendarEvent } from '../../../core/models/event.model';
import { Task } from '../../../core/models/task.model';

import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    DatePipe, 
    CommonModule, 
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss']
})
export class SearchBar implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  searchText: string = '';
  searchTerm: string = '';
  showResults: boolean = false;
  showFilters: boolean = false;
  filtersOpen: boolean = false;
  enableVoiceSearch: boolean = false;
  enableDateFilter: boolean = false;
  enableCreateFromSearch: boolean = true;
  showRecentSearches: boolean = true;
  isListening: boolean = false;
  isSearching: boolean = false;
  loadingMore: boolean = false;
  hasMoreResults: boolean = false;
  selectedIndex: number = -1;
  
  eventResults: CalendarEvent[] = [];
  taskResults: Task[] = [];
  searchResults: any[] = [];
  selectedTypes: string[] = [];
  recentSearches: string[] = [];
  
  searchTypes = [
    { value: 'events', label: 'Eventos', icon: 'event' },
    { value: 'tasks', label: 'Tarefas', icon: 'task' }
  ];
  
  dateRange = {
    start: null,
    end: null
  };

  private searchSubject = new Subject<string>();
  private allEvents: CalendarEvent[] = [];
  private allTasks: Task[] = [];

  @Output() search = new EventEmitter<string>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();
  @Output() eventSelected = new EventEmitter<CalendarEvent>(); // Corrigido para CalendarEvent
  @Output() taskSelected = new EventEmitter<Task>();
  @Output() eventCreate = new EventEmitter<void>();
  @Output() taskCreate = new EventEmitter<void>();

  constructor(
    private eventService: EventService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    // Carregar dados iniciais
    this.eventService.events$.subscribe(events => {
      this.allEvents = events;
    });

    this.taskService.tasks$.subscribe(tasks => {
      this.allTasks = tasks;
    });

    // Debounce na busca
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(query => {
      this.performSearch(query);
    });

    // Atalho de teclado
    document.addEventListener('keydown', this.handleKeyboardShortcut.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyboardShortcut.bind(this));
    this.searchSubject.complete();
  }

  private handleKeyboardShortcut(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
    }

    if (event.key === 'Escape') {
      this.showResults = false;
      this.searchInput?.nativeElement.blur();
    }
  }

  onSearch(domEvent: Event) {
    const target = domEvent.target as HTMLInputElement;
    this.searchText = target.value;
    this.searchTerm = this.searchText;

    if (this.searchText.trim().length > 0) {
      this.searchSubject.next(this.searchText);
      this.showResults = true;
    } else {
      this.eventResults = [];
      this.taskResults = [];
      this.showResults = false;
    }

    this.search.emit(this.searchText);
  }
  
  toggleFilters() {
    this.filtersOpen = !this.filtersOpen;
  }
  
  startVoiceSearch() {
    this.isListening = !this.isListening;
  }
  
  toggleType(type: string) {
    const index = this.selectedTypes.indexOf(type);
    if (index > -1) {
      this.selectedTypes.splice(index, 1);
    } else {
      this.selectedTypes.push(type);
    }
  }
  
  clearFilters() {
    this.selectedTypes = [];
    this.dateRange = { start: null, end: null };
  }
  
  applyFilters() {
    this.performSearch(this.searchText);
    this.filtersOpen = false;
  }
  
  closeResults() {
    this.showResults = false;
  }
  
  selectResult(result: any, index: number) {
    this.selectedIndex = index;
    if (result.type === 'event') {
      this.selectEvent(result);
    } else {
      this.selectTask(result);
    }
  }
  
  trackByResult(index: number, result: any) {
    return result.id;
  }
  
  getResultIcon(type: string): string {
    return type === 'event' ? 'event' : 'task';
  }
  
  highlightSearchTerm(text: string): string {
    if (!this.searchTerm) return text;
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  getTypeLabel(type: string): string {
    const typeObj = this.searchTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }
  
  quickAction(result: any, event: Event) {
    event.stopPropagation();
    // Implementar ação rápida
  }
  
  getQuickActionIcon(type: string): string {
    return type === 'event' ? 'edit' : 'check';
  }
  
  loadMoreResults() {
    this.loadingMore = true;
    // Implementar carregamento de mais resultados
    setTimeout(() => {
      this.loadingMore = false;
    }, 1000);
  }
  
  createFromSearch() {
    if (this.searchTerm) {
      this.createEvent();
    }
  }
  
  clearRecentSearches() {
    this.recentSearches = [];
  }
  
  selectRecentSearch(search: string) {
    this.searchText = search;
    this.searchTerm = search;
    this.performSearch(search);
  }
  
  removeRecentSearch(search: string, event: Event) {
    event.stopPropagation();
    const index = this.recentSearches.indexOf(search);
    if (index > -1) {
      this.recentSearches.splice(index, 1);
    }
  }
  
  trackByRecent(index: number, search: string) {
    return search;
  }

  private performSearch(query: string) {
    const searchTerm = query.toLowerCase().trim();
    this.isSearching = true;
    this.searchResults = [];

    this.eventService.searchEvents(searchTerm).subscribe(events => {
      this.eventResults = events.slice(0, 5);
      this.searchResults = [...this.searchResults, ...events.map(e => ({...e, type: 'event'})).slice(0, 5)];
      this.isSearching = false;
    });
    
    this.taskService.searchTasks(searchTerm).subscribe(tasks => {
      this.taskResults = tasks.slice(0, 5);
      this.searchResults = [...this.searchResults, ...tasks.map(t => ({...t, type: 'task'})).slice(0, 5)];
      this.isSearching = false;
    });
  }

  onFocus() {
    if (this.searchText.trim().length > 0) {
      this.showResults = true;
    }
    this.focus.emit();
  }

  onBlur() {
    setTimeout(() => {
      this.showResults = false;
      this.blur.emit();
    }, 200);
  }

  clearSearch() {
    this.searchText = '';
    this.eventResults = [];
    this.taskResults = [];
    this.showResults = false;
    this.search.emit('');
    this.searchInput?.nativeElement.focus();
  }

  selectEvent(event: CalendarEvent) {
    this.eventSelected.emit(event);
    this.showResults = false;
    this.searchText = '';
  }

  selectTask(task: Task) {
    this.taskSelected.emit(task);
    this.showResults = false;
    this.searchText = '';
  }

  createEvent() {
    this.eventCreate.emit();
    this.showResults = false;
    this.searchText = '';
  }

  createTask() {
    this.taskCreate.emit();
    this.showResults = false;
    this.searchText = '';
  }
}
