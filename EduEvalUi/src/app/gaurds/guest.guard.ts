import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // If the user is already authenticated, redirect to the dashboard or another page
      this.router.navigate(['/']);
      return false;
    }
    // Allow access to the route
    return true;
  }
}
