import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.model';
import { AuthService } from '../../services/auth.service';
import { UserMoviesService } from '../../services/user-movies.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="movie-card">
      <img [src]="movie.imageUrl" [alt]="movie.title" class="movie-image">
      <div class="movie-info">
        <h3 class="movie-title">{{ movie.title }}</h3>
        <div class="movie-meta">
          <span class="movie-year">{{ movie.releaseYear }}</span>
          <span class="movie-genre">{{ movie.genre }}</span>
          <span class="movie-rating">⭐ {{ movie.rating.toFixed(1) }}</span>
          <span class="movie-duration">{{ formatDuration(movie.duration) }}</span>
        </div>
        <div class="movie-crew">
          <p class="director"><strong>Director:</strong> {{ movie.director }}</p>
          <p class="actors"><strong>Actores:</strong> {{ movie.actors.join(', ') }}</p>
        </div>
        <p class="movie-description">{{ movie.description | slice:0:100 }}...</p>
        
        @if (isLoggedIn() && !isAdmin()) {
          <div class="movie-actions">
            @if (!movieStatus.purchased) {
              <button 
                class="action-btn purchase" 
                (click)="purchaseMovie()"
                [disabled]="movieStatus.purchased">
                <i class="fas fa-shopping-cart"></i> Comprar $45.000
              </button>
            }
            @if (!movieStatus.rented && !movieStatus.purchased) {
              <button 
                class="action-btn rent" 
                (click)="rentMovie()"
                [disabled]="movieStatus.rented">
                <i class="fas fa-clock"></i> Rentar $15.000
              </button>
            }
            @if (movieStatus.purchased) {
              <span class="status purchased">
                <i class="fas fa-check-circle"></i> Comprada
              </span>
            } @else if (movieStatus.rented) {
              <span class="status rented">
                <i class="fas fa-check-circle"></i> Rentada
              </span>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .movie-card {
      background: white;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.2s;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .movie-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    .movie-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }
    .movie-info {
      padding: 0.75rem;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    .movie-title {
      font-size: 1rem;
      font-weight: bold;
      margin: 0 0 0.5rem 0;
      color: #1a1a1a;
      line-height: 1.2;
    }
    .movie-meta {
      display: flex;
      gap: 0.75rem;
      font-size: 0.75rem;
      color: #666;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
    }
    .movie-crew {
      font-size: 0.813rem;
      margin-bottom: 0.5rem;
      color: #444;
    }
    .movie-crew p {
      margin: 0.25rem 0;
    }
    .movie-crew strong {
      color: #1a1a1a;
    }
    .movie-duration {
      color: #666;
      font-size: 0.75rem;
    }
    .movie-description {
      font-size: 0.813rem;
      line-height: 1.4;
      color: #444;
      flex-grow: 1;
      margin: 0 0 0.75rem 0;
    }
    .movie-rating {
      color: #f59e0b;
      font-weight: 500;
    }
    .movie-genre {
      background-color: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .movie-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .action-btn {
      padding: 0.375rem 0.75rem;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.813rem;
    }
    .action-btn i {
      font-size: 0.875rem;
    }
    .action-btn.purchase {
      background-color: #2563eb;
      color: white;
    }
    .action-btn.purchase:hover {
      background-color: #1d4ed8;
    }
    .action-btn.rent {
      background-color: #059669;
      color: white;
    }
    .action-btn.rent:hover {
      background-color: #047857;
    }
    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .status {
      padding: 0.375rem 0.75rem;
      border-radius: 4px;
      font-weight: 500;
      text-align: center;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.813rem;
    }
    .status i {
      font-size: 0.875rem;
    }
    .status.purchased {
      background-color: #dbeafe;
      color: #1e40af;
    }
    .status.rented {
      background-color: #d1fae5;
      color: #065f46;
    }
  `]
})
export class MovieCardComponent implements OnInit {
  @Input() movie!: Movie;
  movieStatus = { rented: false, purchased: false };

  constructor(
    private authService: AuthService,
    private userMoviesService: UserMoviesService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.checkMovieStatus();
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  checkMovieStatus() {
    this.userMoviesService.hasMovie(this.movie.id).subscribe(
      status => this.movieStatus = status
    );
  }

  rentMovie() {
    const movieWithPrice = { 
      ...this.movie, 
      price: 15000, 
      type: 'rental' as const
    };
    this.cartService.addToCart(movieWithPrice);
  }

  purchaseMovie() {
    const movieWithPrice = { 
      ...this.movie, 
      price: 45000, 
      type: 'purchase' as const
    };
    this.cartService.addToCart(movieWithPrice);
  }
}