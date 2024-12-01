import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Movie } from '../models/movie.model';
import { MOVIES } from '../data/movies.data';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movies: Movie[] = MOVIES;

  getMovies(): Observable<Movie[]> {
    return of(this.movies);
  }

  addMovie(movie: Movie): Observable<Movie> {
    movie.id = Math.max(...this.movies.map(m => m.id)) + 1;
    this.movies.push(movie);
    return of(movie);
  }

  deleteMovie(id: number): Observable<boolean> {
    const index = this.movies.findIndex(m => m.id === id);
    if (index !== -1) {
      this.movies.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}