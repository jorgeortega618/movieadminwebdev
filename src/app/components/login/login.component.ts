import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Iniciar Sesión</h2>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Usuario:</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              class="form-control"
            />
          </div>
          <button type="submit" [disabled]="!loginForm.form.valid">
            Ingresar
          </button>
          @if (error) {
            <div class="error-message">
              Usuario o contraseña inválidos
            </div>
          }
        </form>

        <div class="credentials-info">
          <h3>Cuentas Disponibles:</h3>
          <div class="credential-box">
            <h4>Usuario Administrador</h4>
            <p>Usuario: <span class="highlight">admin</span></p>
            <p>Contraseña: <span class="highlight">admin123</span></p>
          </div>
          <div class="credential-box">
            <h4>Usuario Regular</h4>
            <p>Usuario: <span class="highlight">user</span></p>
            <p>Contraseña: <span class="highlight">user123</span></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }
    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 {
      margin-bottom: 1.5rem;
      text-align: center;
      color: #333;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-bottom: 1.5rem;
    }
    button:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
    .error-message {
      color: #dc2626;
      margin-top: 1rem;
      text-align: center;
    }
    .credentials-info {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
    }
    .credentials-info h3 {
      color: #333;
      font-size: 1.1rem;
      margin-bottom: 1rem;
      text-align: center;
    }
    .credential-box {
      background-color: #f8fafc;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .credential-box h4 {
      color: #2563eb;
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
    }
    .credential-box p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
      color: #666;
    }
    .highlight {
      color: #2563eb;
      font-weight: 500;
      font-family: monospace;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      success => {
        if (success) {
          this.router.navigate(['/']);
        } else {
          this.error = true;
        }
      }
    );
  }
}