import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-redirect',
  imports: [],
  templateUrl: './role-redirect.component.html',
  styleUrl: './role-redirect.component.scss'
})
export class RoleRedirectComponent {
  constructor(private authService: AuthService, private router: Router) {
    this.redirectUser();
  }

  private redirectUser() {
    this.authService.redirectBasedOnRole();
  }
}
