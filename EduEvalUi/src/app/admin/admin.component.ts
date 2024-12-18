import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../shared/header/header.component";
import { ApiService } from '../services/api.service';
import { User } from '../services/responses.model';

@Component({
  selector: 'app-admin',
  imports: [SidebarComponent, RouterOutlet, RouterLink, HeaderComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
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
