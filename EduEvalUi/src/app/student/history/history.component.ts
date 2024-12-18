import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { ButtonComponent } from "../../shared/button/button.component";
import { ApiService } from '../../services/api.service';
import { StudentExams, User } from '../../services/responses.model';

@Component({
  selector: 'app-history',
  imports: [HeaderComponent, ButtonComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  apiService: ApiService = inject(ApiService);
  studentHistory?: StudentExams[];
  ngOnInit(): void {
    this.apiService.getStudentExams().subscribe(
      {
        next: (response) => {
          this.studentHistory = response;
          console.log("student History");
          console.log(this.studentHistory);
        },

        error: (error) => {
          console.error('Fetch Failed:', error);
        }
      }
    );
  }
}
