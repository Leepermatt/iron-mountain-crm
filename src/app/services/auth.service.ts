import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserRole } from '../models/user.model';

const STORAGE_KEY = 'imcrm_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  private loadUser(): User | null {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : null;
  }

  private saveUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  login(email: string, password: string): Observable<User> {
    // TODO: replace with real HTTP call to Node/Express JWT endpoint
    const fakeUser: User = {
      id: 'u1',
      name: 'Matt Leeper',
      email,
      role: email.includes('admin') ? 'admin' : 'agent',
      token: 'fake-jwt-token'
    };

    this.currentUserSubject.next(fakeUser);
    this.saveUser(fakeUser);
    return of(fakeUser);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.saveUser(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser?.token;
  }

  hasRole(required: UserRole | UserRole[]): boolean {
    const user = this.currentUser;
    if (!user) return false;

    if (Array.isArray(required)) {
      return required.includes(user.role);
    }
    return user.role === required;
  }
}
