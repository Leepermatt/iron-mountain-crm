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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  get currentUser() {
    return this.currentUserSubject.value;
  }

  private api = environment.apiUrl;

constructor() {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  if (token && userRaw) {
    try {
      this.currentUserSubject.next(JSON.parse(userRaw));
      return;
    } catch {
      localStorage.removeItem('user');
    }
  }

  if (token) {
    const payload = this.parseJwt(token);
    const id = payload?.sub ?? '';
    const email = payload?.email ?? '';
    if (id && email) this.currentUserSubject.next({ id, email });
  }
}


  login(email: string, password: string) {
    return this.http
      .post<{ token: string; user: User }>(`${this.api}/auth/login`, { email, password })
      .pipe(
tap((res) => {
  localStorage.setItem('token', res.token);
  localStorage.setItem('user', JSON.stringify(res.user));
  this.currentUserSubject.next(res.user);
})
      );
  }

logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.currentUserSubject.next(null);
}


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(requiredRole: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    if (!user.roles || user.roles.length === 0) return true;
    return user.roles.includes(requiredRole);
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(escape(atob(base64))));
    } catch {
      return null;
    }
  }
}
