import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss']
})
export class SearchBar {
  @Input() placeholder = 'Buscar...';
  @Output() searchQuery = new EventEmitter<string>();

  searchTerm = '';
  showResults = false;
  isSearching = false;
  searchResults: any[] = [];
  groupedResults: any[] = [];
  selectedIndex = -1;
  showQuickActions = false;
  quickActions: any[] = [];
  recentSearches: string[] = [];
  showRecentSearches = false;

  onSearchInput(): void {
    this.searchQuery.emit(this.searchTerm);
  }

  onFocus(): void {
    this.showResults = true;
  }

  onBlur(): void {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.showResults = false;
  }

  selectResult(item: any): void {
    console.log('Resultado selecionado:', item);
  }

  highlightResult(index: number): void {
    this.selectedIndex = index;
  }

  highlightSearchTerm(text: string): string {
    if (!this.searchTerm) return text;
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  quickAction(item: any, event: Event): void {
    event.stopPropagation();
    console.log('Ação rápida:', item);
  }

  createFromSearch(): void {
    console.log('Criar a partir da busca:', this.searchTerm);
  }

  executeQuickAction(action: any): void {
    console.log('Executar ação rápida:', action);
  }

  selectRecentSearch(search: string): void {
    this.searchTerm = search;
    this.onSearchInput();
  }

  removeRecentSearch(search: string, event: Event): void {
    event.stopPropagation();
    this.recentSearches = this.recentSearches.filter(s => s !== search);
  }

  clearRecentSearches(): void {
    this.recentSearches = [];
  }

  closeResults(): void {
    this.showResults = false;
  }
}