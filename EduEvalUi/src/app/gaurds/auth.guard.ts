import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role']; // Role defined in the route's metadata
    const userRole = this.authService.getUserRole();

    if (!this.authService.isAuthenticated()) {
      // User is not logged in or token is expired, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
/* 
    if (userRole === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (userRole === 'Student') {
      this.router.navigate(['/student']);
    }
 */
    if (expectedRole && userRole !== expectedRole) {
      // User role does not match the expected role, redirect to a "not authorized" page
      this.router.navigate(['/not-authorized']);
      return false;
    }

    // User is authenticated and has the correct role
    return true;
  }
}
