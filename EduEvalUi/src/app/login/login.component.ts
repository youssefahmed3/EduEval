import { Component, inject } from '@angular/core';
import { InputComponent } from "../shared/input/input.component";
import { ButtonComponent } from "../shared/button/button.component";
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [InputComponent, ButtonComponent,RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email:string = "";
  password:string = "";
  errors:[] = [];
  private apiService = inject(ApiService);
  private router = inject(Router);
  private authService: AuthService = inject(AuthService);

  onSubmit() {
    

    const credentials = { email: this.email, password: this.password };
    this.apiService.loginUser(credentials).subscribe(
      (response) => {
        console.log('Login Success:', response);
        this.authService.login(response.token);
        // Navigate to the dashboard or another page
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Login Failed:', error);
        this.errors = error.error.errors;
        console.log(this.errors);
      }
    );

    this.formReset();
  }

  formReset() {
    this.email = "";
    this.password = "";
    // this.errors = "";
  }
}
