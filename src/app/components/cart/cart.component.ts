import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-container">
      <h2>Carrito de Compras</h2>
      @if (cartItems$ | async; as items) {
        @if (items.length > 0) {
          <div class="cart-items">
            @for (item of items; track item.id) {
              <div class="cart-item">
                <img [src]="item.imageUrl" [alt]="item.title">
                <div class="item-details">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.type === 'rental' ? 'Alquiler' : 'Compra' }}</p>
                  <p class="price">{{ item.price | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
                </div>
                <button class="remove-btn" (click)="removeFromCart(item.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            }
            <div class="cart-summary">
              <p>Total: {{ calculateTotal(items) | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
              <button class="checkout-btn" (click)="checkout()">
                Finalizar Compra
              </button>
            </div>
          </div>
        } @else {
          <p class="empty-cart">Tu carrito está vacío</p>
        }
      }
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    h2 {
      margin-bottom: 2rem;
      color: #333;
    }
    .cart-items {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .cart-item {
      display: flex;
      padding: 1rem;
      border-bottom: 1px solid #eee;
      align-items: center;
    }
    .cart-item img {
      width: 100px;
      height: 150px;
      object-fit: cover;
      border-radius: 4px;
    }
    .item-details {
      flex-grow: 1;
      padding: 0 1rem;
    }
    .item-details h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }
    .price {
      font-weight: bold;
      color: #2563eb;
    }
    .remove-btn {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      padding: 0.5rem;
      font-size: 1.25rem;
    }
    .remove-btn:hover {
      color: #dc2626;
    }
    .cart-summary {
      padding: 1rem;
      background-color: #f8fafc;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cart-summary p {
      font-size: 1.25rem;
      font-weight: bold;
      color: #333;
    }
    .checkout-btn {
      background-color: #2563eb;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    .checkout-btn:hover {
      background-color: #1d4ed8;
    }
    .empty-cart {
      text-align: center;
      color: #666;
      font-size: 1.1rem;
      padding: 2rem;
      background: white;
      border-radius: 8px;
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems$ = this.cartService.cartItems$;

  constructor(private cartService: CartService) {}

  ngOnInit() {}

  removeFromCart(movieId: number): void {
    this.cartService.removeFromCart(movieId);
  }

  calculateTotal(items: Movie[]): number {
    return items.reduce((total, item) => total + (item.price || 0), 0);
  }

  checkout(): void {
    alert('¡Gracias por tu compra!');
    this.cartService.clearCart();
  }
}