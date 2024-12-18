import { Component, inject, Input } from '@angular/core';
import { ButtonComponent } from "../shared/button/button.component";
import { InputComponent } from "../shared/input/input.component";
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ButtonComponent, InputComponent, RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @Input({ required: true }) firstName!: string;
  @Input({ required: true }) lastName!: string;
  @Input({ required: true }) username!: string;
  @Input({ required: true }) email!: string;
  @Input({ required: true }) password!: string;
  @Input({ required: true }) confirmPassword!: string;
  errors: [] = [];
  private apiService = inject(ApiService);
  private router = inject(Router);
  private authService: AuthService = inject(AuthService);

  onSubmit() {


    const credentials = { firstName: this.firstName, lastName: this.lastName, username: this.username ,email: this.email, password: this.password };
    this.apiService.registerUser(credentials).subscribe(
      (response) => {
        console.log('Register Success:', response);
        this.authService.register(response.token);
        // Navigate to the dashboard or another page
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Register Failed:', error);
        this.errors = error.error.errors;
        console.log(this.errors);
      }
    );

    this.formReset();
  }


  formReset() {
    this.firstName = "";
    this.lastName = "";
    this.username = "";
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
    // this.errors = "";
  }
}
