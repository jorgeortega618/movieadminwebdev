import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<Movie[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  addToCart(movie: Movie): void {
    const currentItems = this.cartItemsSubject.getValue();
    const exists = currentItems.some(item => 
      item.id === movie.id && item.type === movie.type
    );
    
    if (!exists) {
      const updatedItems = [...currentItems, movie];
      this.cartItemsSubject.next(updatedItems);
    }
  }

  removeFromCart(movieId: number): void {
    const currentItems = this.cartItemsSubject.getValue();
    const updatedItems = currentItems.filter(item => item.id !== movieId);
    this.cartItemsSubject.next(updatedItems);
  }

  getCartCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.length)
    );
  }

  getCartItems(): Movie[] {
    return this.cartItemsSubject.getValue();
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }
}