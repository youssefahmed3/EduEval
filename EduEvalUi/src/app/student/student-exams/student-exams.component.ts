import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { Exam, StudentExams } from '../../services/responses.model';
import { ApiService } from '../../services/api.service';
import { ButtonComponent } from "../../shared/button/button.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-exams',
  imports: [HeaderComponent, ButtonComponent, DatePipe],
  templateUrl: './student-exams.component.html',
  styleUrl: './student-exams.component.scss'
})
export class StudentExamsComponent {
  exams?: Exam[];
  apiService: ApiService = inject(ApiService);
  studentExams?: StudentExams[];
  ngOnInit(): void {
    this.apiService.getAllExams().subscribe({
      next: (response) => {
        this.exams = response;
        console.log(response);
        // Assuming you get student-specific exams, where you can check 'submittedAt'
        this.apiService.getStudentExams().subscribe({
          next: (studentExamsResponse) => {
            this.studentExams = studentExamsResponse;
          },
          error: (error) => {
            console.error('Error fetching student exams:', error);
          }
        });
      },

      error: (error) => {
        console.error('Fetch Failed:', error);
      }
    })
  }

  hasAttended(examId: number): boolean {
    // Check if the student has already attended the exam by verifying 'submittedAt'
    const studentExam = this.studentExams?.find(exam => exam.examId == examId);
    return studentExam?.submittedAt != null;
  }
}
