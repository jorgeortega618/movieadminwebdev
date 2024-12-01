import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters-container">
      <div class="genre-filter">
        <select 
          (change)="onGenreChange($event)"
          class="filter-select"
          [value]="selectedGenre">
          <option value="">Todos los Géneros</option>
          @for (genre of genres; track genre) {
            <option [value]="genre">{{ genre }}</option>
          }
        </select>
      </div>
      <div class="sort-controls">
        <button 
          class="sort-btn" 
          [class.active]="sortField === 'title'"
          (click)="onSortChange('title')">
          Título
          <i class="fas" [class]="getSortIcon('title')"></i>
        </button>
        <button 
          class="sort-btn" 
          [class.active]="sortField === 'releaseYear'"
          (click)="onSortChange('releaseYear')">
          Año
          <i class="fas" [class]="getSortIcon('releaseYear')"></i>
        </button>
        <button 
          class="sort-btn" 
          [class.active]="sortField === 'rating'"
          (click)="onSortChange('rating')">
          Calificación
          <i class="fas" [class]="getSortIcon('rating')"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .filters-container {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .filter-select {
      padding: 0.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      min-width: 150px;
      font-size: 0.875rem;
      color: #374151;
      background-color: white;
      cursor: pointer;
    }
    .filter-select:focus {
      outline: none;
      border-color: #2563eb;
      ring: 2px;
      ring-color: #93c5fd;
    }
    .sort-controls {
      display: flex;
      gap: 0.5rem;
    }
    .sort-btn {
      padding: 0.5rem 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      background: white;
      color: #374151;
      font-size: 0.875rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    .sort-btn:hover {
      background: #f3f4f6;
    }
    .sort-btn.active {
      background: #2563eb;
      color: white;
      border-color: #2563eb;
    }
    .sort-btn i {
      font-size: 0.75rem;
    }
  `]
})
export class MovieFiltersComponent {
  @Input() genres: string[] = [];
  @Input() selectedGenre: string = '';
  @Input() sortField: string = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  
  @Output() genreChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<{field: string, direction: 'asc' | 'desc'}>();

  onGenreChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.genreChange.emit(select.value);
  }

  onSortChange(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortChange.emit({ field, direction: this.sortDirection });
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'fa-sort';
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }
}