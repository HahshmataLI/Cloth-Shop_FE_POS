import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_ENDPOINTS } from '../constants'; 
import { LoginRequest, RegisterRequest } from '../Models/auth.model';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

interface DecodedToken {
  id: string;
  role: 'admin' | 'cashier';
  exp: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'cashier';
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.currentUserSubject.next(JSON.parse(userJson));
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return new Observable((observer) => {
      this.http
        .post<{ token: string; user: User }>(
          API_ENDPOINTS.AUTH.LOGIN,
          credentials
        )
        .subscribe({
          next: (res) => {
            this.saveAuth(res.token, res.user);
            observer.next(res);
            observer.complete();
          },
          error: (err) => observer.error(err),
        });
    });
  }

  register(data: RegisterRequest) {
    return this.http.post<{ token: string; user: User }>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
  }

  private saveAuth(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getUserRole() {
    return this.currentUserSubject.value?.role ?? null;
  }
getUserId(): string | null {
  return this.currentUserSubject.value?._id ?? null;
}

  getUserInfo() {
    return this.currentUserSubject.value;
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}