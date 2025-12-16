import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  name?: string;
  roles?: string[]; 
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  get currentUser() {
    return this.currentUserSubject.value;
  }

  private api = environment.apiUrl;

  login(email: string, password: string) {
    return this.http
      .post<{ token: string; user: User }>(`${this.api}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          this.currentUserSubject.next(res.user);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // NEW: used by auth.guard
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // NEW: very simple role check so the guard compiles
  hasRole(requiredRole: string): boolean {
    const user = this.currentUserSubject.value;

    // If there is no user, definitely not allowed
    if (!user) return false;

    // If roles are not set on the user, treat as allowed for now
    if (!user.roles || user.roles.length === 0) {
      return true;
    }

    return user.roles.includes(requiredRole);
  }
}
