import { Component, inject } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../services/responses.model';

@Component({
  selector: 'app-student',
  imports: [SidebarComponent, RouterOutlet, RouterLink],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent {
  apiService: ApiService = inject(ApiService);
  currentUserData?: User;
  ngOnInit(): void {
    this.apiService.getCurrentUserData().subscribe(
      {
        next: (response) => {
          this.currentUserData = response;
          console.log(response);
        },

        error: (error) => {
          console.error('Fetch Failed:', error);
        }
      }
    );
  }
}
