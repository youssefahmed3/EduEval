import { Component, inject } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../services/responses.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-student',
  imports: [SidebarComponent, RouterOutlet, RouterLink],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent {
  apiService: ApiService = inject(ApiService);
  currentUserData?: User;

  userService: UserService = inject(UserService);
  ngOnInit(): void {
    this.userService.fetchCurrentUserData();

    // Subscribe to the user data
    this.userService.currentUserData$.subscribe((data) => {
      if (data) {
        this.currentUserData = data;
        console.log('Current User Data:', data);
      }
    });
  }
}
