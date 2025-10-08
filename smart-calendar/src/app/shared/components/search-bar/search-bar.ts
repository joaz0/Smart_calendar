import { Component, EventEmitter, Output, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { TaskService } from '../../../core/services/task.service';
import { CalendarEvent } from '../../../core/models/event.model';
import { Task } from '../../../core/models/task.model';

import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss']
})
export class SearchBar implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  searchText: string = '';
  showResults: boolean = false;
  eventResults: CalendarEvent[] = []; // Corrigido para CalendarEvent[]
  taskResults: Task[] = [];

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

  onSearch(domEvent: Event) { // Renomeado para domEvent para evitar conflito
    const target = domEvent.target as HTMLInputElement;
    this.searchText = target.value;

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

  private performSearch(query: string) {
    const searchTerm = query.toLowerCase().trim();

     this.eventService.searchEvents(searchTerm).subscribe(events => {
       this.eventResults = events.slice(0, 5);
     });
     this.taskService.searchTasks(searchTerm).subscribe(tasks => {
       this.taskResults = tasks.slice(0, 5);
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
