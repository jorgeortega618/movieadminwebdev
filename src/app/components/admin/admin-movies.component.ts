import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Movie, NewMovie } from '../../models/movie.model';

@Component({
  selector: 'app-admin-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <h2>Administrar Películas</h2>
      
      <div class="add-movie-form">
        <h3>Agregar Nueva Película</h3>
        <form (ngSubmit)="addMovie()" #movieForm="ngForm">
          <div class="form-group">
            <label for="title">Título:</label>
            <input type="text" id="title" [(ngModel)]="newMovie.title" name="title" required>
          </div>
          <div class="form-group">
            <label for="description">Descripción:</label>
            <textarea id="description" [(ngModel)]="newMovie.description" name="description" required></textarea>
          </div>
          <div class="form-group">
            <label for="director">Director:</label>
            <input type="text" id="director" [(ngModel)]="newMovie.director" name="director" required>
          </div>
          <div class="form-group">
            <label for="actors">Actores (separados por comas):</label>
            <input type="text" id="actors" [(ngModel)]="newMovie.actorsInput" name="actorsInput" required>
          </div>
          <div class="form-group">
            <label for="duration">Duración (minutos):</label>
            <input type="number" id="duration" [(ngModel)]="newMovie.duration" name="duration" required>
          </div>
          <div class="form-group">
            <label for="releaseYear">Año de Lanzamiento:</label>
            <input type="number" id="releaseYear" [(ngModel)]="newMovie.releaseYear" name="releaseYear" required>
          </div>
          <div class="form-group">
            <label for="genre">Género:</label>
            <input type="text" id="genre" [(ngModel)]="newMovie.genre" name="genre" required>
          </div>
          <div class="form-group">
            <label for="rating">Calificación:</label>
            <input type="number" id="rating" [(ngModel)]="newMovie.rating" name="rating" min="0" max="10" step="0.1" required>
          </div>
          <div class="form-group">
            <label for="imageUrl">URL de la Imagen:</label>
            <input type="url" id="imageUrl" [(ngModel)]="newMovie.imageUrl" name="imageUrl" required>
          </div>
          <button type="submit" [disabled]="!movieForm.form.valid">Agregar Película</button>
        </form>
      </div>

      <div class="movie-list">
        <h3>Películas Actuales</h3>
        <div class="movie-grid">
          @for (movie of movies; track movie.id) {
            <div class="movie-item">
              <img [src]="movie.imageUrl" [alt]="movie.title">
              <div class="movie-details">
                <h4>{{ movie.title }}</h4>
                <p>{{ movie.genre }} ({{ movie.releaseYear }})</p>
                <p><strong>Director:</strong> {{ movie.director }}</p>
                <p><strong>Duración:</strong> {{ formatDuration(movie.duration) }}</p>
                <button class="delete-btn" (click)="deleteMovie(movie.id)">Eliminar</button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .add-movie-form {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }
    input, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    textarea {
      height: 100px;
    }
    button {
      padding: 0.75rem 1.5rem;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    .movie-item {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .movie-item img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .movie-details {
      padding: 1rem;
    }
    .movie-details h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }
    .delete-btn {
      background-color: #dc2626;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
    .delete-btn:hover {
      background-color: #b91c1c;
    }
  `]
})
export class AdminMoviesComponent {
  movies: Movie[] = [];
  newMovie: NewMovie = {
    title: '',
    description: '',
    director: '',
    actorsInput: '',
    duration: 120,
    releaseYear: new Date().getFullYear(),
    genre: '',
    rating: 0,
    imageUrl: ''
  };

  constructor(private movieService: MovieService) {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getMovies().subscribe(
      movies => this.movies = movies
    );
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }

  addMovie() {
    if (this.isValidMovie(this.newMovie)) {
      const movieToAdd: Movie = {
        ...this.newMovie,
        id: Math.max(...this.movies.map(m => m.id)) + 1,
        actors: this.newMovie.actorsInput.split(',').map(actor => actor.trim())
      };

      this.movieService.addMovie(movieToAdd).subscribe(() => {
        this.loadMovies();
        this.resetForm();
      });
    }
  }

  deleteMovie(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta película?')) {
      this.movieService.deleteMovie(id).subscribe(() => {
        this.loadMovies();
      });
    }
  }

  private isValidMovie(movie: NewMovie): boolean {
    return !!(movie.title && movie.description && movie.director && 
             movie.actorsInput && movie.duration && movie.releaseYear &&
             movie.genre && movie.rating !== undefined && movie.imageUrl);
  }

  private resetForm() {
    this.newMovie = {
      title: '',
      description: '',
      director: '',
      actorsInput: '',
      duration: 120,
      releaseYear: new Date().getFullYear(),
      genre: '',
      rating: 0,
      imageUrl: ''
    };
  }
}