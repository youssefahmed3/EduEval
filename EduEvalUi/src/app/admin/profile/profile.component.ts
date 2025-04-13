import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { InputComponent } from "../../shared/input/input.component";
import { ButtonComponent } from "../../shared/button/button.component";
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User, UserEdit } from '../../services/responses.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, InputComponent, ButtonComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  firstName!:string
  lastName!:string
  email!:string
  username!:string
  error?: string;
  success?: string;
  apiService:ApiService = inject(ApiService)
  userService: UserService = inject(UserService)
  ngOnInit(): void {
    // Ensure the user data is fetched
    this.userService.fetchCurrentUserData();

    // Subscribe to the user data
    this.userService.currentUserData$.subscribe((data: User) => {
      if (data) {
        this.firstName = data.firstName!;
        this.lastName = data.lastName!;
        this.email = data.email;
        this.username = data.userName;
        console.log('Current User Data:', data);
      }
    });

  }

  onSubmit() {
    var payload : UserEdit = {
      email: this.email,
      userName: this.username,
      firstName: this.firstName,
      lastName: this.lastName
    }
    this.apiService.updateUserData(payload).subscribe({

      next: (response) => {
        console.log('User data updated successfully:', response);
        this.success = 'User data updated successfully';
      },
      error: (error) => {
        console.error('Error updating user data:', error);
        this.error = 'Error updating user data';
      }
    })
  }

}
/* .subscribe({
  next: (response) => {
    console.log('User data updated successfully:', response);
    this.success = 'User data updated successfully';
  },
  error: (error) => {
    console.error('Error updating user data:', error);
    this.error = 'Error updating user data';
  }
}) */