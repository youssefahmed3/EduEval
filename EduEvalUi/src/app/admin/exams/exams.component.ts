import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { ApiService } from '../../services/api.service';
import { Exam } from '../../services/responses.model';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from "../../shared/button/button.component";

@Component({
  selector: 'app-exams',
  imports: [HeaderComponent, DatePipe, ButtonComponent],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.scss'
})
export class ExamsComponent implements OnInit {
  exams?: Exam[];
  apiService: ApiService = inject(ApiService);

  ngOnInit(): void {
    this.apiService.getAllExams().subscribe({
      next: (response) => {
        this.exams = response;
        console.log(response);
      },

      error: (error) => {
        console.error('Fetch Failed:', error);
      }
    })
  }
}
