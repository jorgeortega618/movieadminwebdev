import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieFiltersComponent } from '../movie-filters/movie-filters.component';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, MovieFiltersComponent],
  template: `
    <section class="movie-list-container">
      <h2 class="section-title">Películas Populares</h2>
      
      <app-movie-filters
        [genres]="genres"
        [selectedGenre]="selectedGenre"
        [sortField]="sortField"
        [sortDirection]="sortDirection"
        (genreChange)="onGenreChange($event)"
        (sortChange)="onSortChange($event)"
      />

      <div class="movie-grid">
        @for (movie of filteredAndSortedMovies; track movie.id) {
          <app-movie-card [movie]="movie" />
        }
      </div>
    </section>
  `,
  styles: [`
    .movie-list-container {
      padding: 1rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .section-title {
      font-size: 1.75rem;
      font-weight: bold;
      margin-bottom: 1.25rem;
      color: #333;
    }
    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.25rem;
    }
  `]
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  filteredAndSortedMovies: Movie[] = [];
  genres: string[] = [];
  selectedGenre: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movieService.getMovies().subscribe(movies => {
      this.movies = movies;
      this.extractGenres();
      this.applyFiltersAndSort();
    });
  }

  private extractGenres() {
    const genreSet = new Set(this.movies.map(movie => movie.genre));
    this.genres = Array.from(genreSet).sort();
  }

  onGenreChange(genre: string) {
    this.selectedGenre = genre;
    this.applyFiltersAndSort();
  }

  onSortChange(sort: { field: string, direction: 'asc' | 'desc' }) {
    this.sortField = sort.field;
    this.sortDirection = sort.direction;
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort() {
    let filtered = this.selectedGenre
      ? this.movies.filter(movie => movie.genre === this.selectedGenre)
      : [...this.movies];

    if (this.sortField) {
      filtered.sort((a, b) => {
        const aValue = a[this.sortField as keyof Movie];
        const bValue = b[this.sortField as keyof Movie];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return this.sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return this.sortDirection === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
        
        return 0;
      });
    }

    this.filteredAndSortedMovies = filtered;
  }
}