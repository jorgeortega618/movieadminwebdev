import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { id: 1, username: 'admin', password: 'admin123', isAdmin: true },
    { id: 2, username: 'user', password: 'user123', isAdmin: false }
  ];

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  login(username: string, password: string): Observable<boolean> {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.currentUserSubject.next(user);
      return of(true);
    }
    return of(false);
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.isAdmin || false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}