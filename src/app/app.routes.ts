import { Routes } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { LoginComponent } from './components/login/login.component';
import { AdminMoviesComponent } from './components/admin/admin-movies.component';
import { CartComponent } from './components/cart/cart.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: MovieListComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin/movies', 
    component: AdminMoviesComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];