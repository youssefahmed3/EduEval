import { Component, inject, Input, NgModule, OnInit } from '@angular/core';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { ButtonComponent } from "../shared/button/button.component";
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../services/responses.model';

@Component({
  selector: 'app-sidebar',
  imports: [SidebarMenuComponent, ButtonComponent, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  @Input({required: true}) userData?: User;

  userRole = this.authService.getUserRole();
  // private userDataSubscription: any; // To store the subscription (if needed)

/*   fullName = '';
  email = '';
  firstName = '';
  lastName = '';
  role = '';
  isActive = true; */

  /* ngOnInit() {
    // Fetch user data when the component initializes
    this.userDataSubscription = this.apiService.getCurrentUserData().subscribe(
      (data) => {
        console.log(data); // Log the data from the API
        this.currentUserData = data; // Store the full user data
        this.fullName = data.fullName; // Access specific properties (replace `username` with your API structure)
        this.email = data.email; // Access specific properties (replace `username` with your API structure)
        this.firstName = data.firstName; // Access specific properties (replace `username` with your API structure)
        this.lastName = data.lastName; // Access specific properties (replace `username` with your API structure)
        this.role = data.role; // Access specific properties (replace `username` with your API structure)
        this.isActive = data.isActive; // Access specific properties (replace `username` with your API structure)
      },
      (error) => {
        console.error('Error fetching user data:', error); // Handle errors
      }
    );
  } */

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}
