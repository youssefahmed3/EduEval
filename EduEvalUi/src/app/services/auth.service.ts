import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private router: Router) { }

  // Store JWT token in localStorage
  login(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  register(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Clear the JWT token from localStorage
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Get JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Check if the user is authenticated by checking the token existence and validity
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && this.isTokenValid(token);
  }

  // Decode JWT token and get the user role
  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = this.decodeToken(token);
      return payload ? payload.role : null; // role will be part of JWT payload
    }
    return null;
  }

  // Decode JWT token (without verifying it)
  private decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length === 3) {
      const decoded = atob(parts[1]);
      return JSON.parse(decoded);
    }
    return null;
  }

  // Check if the token is valid (this can include expiry check)
  private isTokenValid(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (decoded && decoded.exp) {
      // Expiration check: token is valid if current time is less than expiration time
      return Date.now() < decoded.exp * 1000;
    }
    return false;
  }

  redirectBasedOnRole() {
    if (this.isAuthenticated()) {
      const userRole = this.getUserRole();
      if (userRole === 'Admin') {
        this.router.navigate(['/admin']);
      } else if (userRole === 'Student') {
        this.router.navigate(['/student']);
      } else {
        this.router.navigate(['/not-authorized']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
