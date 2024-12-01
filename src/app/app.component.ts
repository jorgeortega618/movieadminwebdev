import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <div class="app-container">
      <nav class="navbar">
        <div class="nav-brand">Catálogo de Películas</div>
        <div class="nav-links">
          <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inicio</a>
          @if (isAdmin()) {
            <a routerLink="/admin/movies" class="nav-link" routerLinkActive="active">Administrar Películas</a>
          }
          @if (!isLoggedIn()) {
            <a routerLink="/login" class="nav-link" routerLinkActive="active">Iniciar Sesión</a>
          } @else {
            <div class="cart-wrapper">
              <a class="cart-icon" [routerLink]="['/cart']">
                <i class="fas fa-shopping-cart"></i>
                @if (cartCount$ | async) {
                  <span class="cart-badge">{{ cartCount$ | async }}</span>
                }
              </a>
            </div>
            <button (click)="logout()" class="nav-link logout-btn">Cerrar Sesión</button>
          }
        </div>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .navbar {
      background-color: #2563eb;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }
    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }
    .nav-link {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    .nav-link:hover, .nav-link.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .logout-btn {
      background: none;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      color: white;
    }
    .main-content {
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }
    .cart-wrapper {
      position: relative;
      padding: 0.5rem;
    }
    .cart-icon {
      color: white;
      text-decoration: none;
      font-size: 1.25rem;
      position: relative;
      display: flex;
      align-items: center;
      padding: 0.5rem;
    }
    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: #ef4444;
      color: white;
      border-radius: 50%;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      min-width: 1.5rem;
      text-align: center;
    }
  `]
})
export class AppComponent implements OnInit {
  cartCount$ = this.cartService.getCartCount();

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.cartCount$ = this.cartService.getCartCount();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
  }
}