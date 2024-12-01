import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserMovie } from '../models/movie.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserMoviesService {
  private userMovies: UserMovie[] = [];

  constructor(private authService: AuthService) {}

  getUserMovies(): Observable<UserMovie[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return of([]);
    
    return of(this.userMovies.filter(um => um.userId === currentUser.id));
  }

  rentMovie(movieId: number): Observable<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return of(false);

    this.userMovies.push({
      movieId,
      userId: currentUser.id,
      type: 'rental',
      date: new Date()
    });
    return of(true);
  }

  purchaseMovie(movieId: number): Observable<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return of(false);

    this.userMovies.push({
      movieId,
      userId: currentUser.id,
      type: 'purchase',
      date: new Date()
    });
    return of(true);
  }

  hasMovie(movieId: number): Observable<{rented: boolean; purchased: boolean}> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return of({rented: false, purchased: false});

    const userMovies = this.userMovies.filter(um => 
      um.userId === currentUser.id && um.movieId === movieId
    );

    return of({
      rented: userMovies.some(um => um.type === 'rental'),
      purchased: userMovies.some(um => um.type === 'purchase')
    });
  }
}