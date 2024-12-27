import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../shared/header/header.component";
import { ApiService } from '../services/api.service';
import { User } from '../services/responses.model';
import { UserService } from '../services/user.service';
import { SignalRService } from '../services/signalr.service';

@Component({
  selector: 'app-admin',
  imports: [SidebarComponent, RouterOutlet, RouterLink, HeaderComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  currentUserData?: User;
  userService: UserService = inject(UserService);
  signalRService: SignalRService = inject(SignalRService);
  ngOnInit(): void {

    // Ensure the user data is fetched
    this.userService.fetchCurrentUserData();

    // Subscribe to the user data
    this.userService.currentUserData$.subscribe((data) => {
      if (data) {
        this.currentUserData = data;
        console.log('Current User Data:', data);
      }
    });
    this.signalRService.startConnection();

   
    
  }
  
}
