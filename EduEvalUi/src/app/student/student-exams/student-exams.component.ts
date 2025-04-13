import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { AllExamsPaginated, Exam, StudentExams } from '../../services/responses.model';
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
  currentPage: number = 1;
  paginationNumbers: number[] = [];
  apiService: ApiService = inject(ApiService);
  studentExams?: StudentExams[];
  /*   ngOnInit(): void {
      this.apiService.getPaginatiedExams(this,currentPage, 5).subscribe({
        next: (response: AllExamsPaginated) => {
          this.exams = response.exams;
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
    } */

  ngOnInit(): void {
    this.loadExams(this.currentPage);  // Initial load
  }

  loadExams(pageNumber: number): void {
    this.apiService.getPaginatiedExams(pageNumber, 5).subscribe({
      next: (response: AllExamsPaginated) => {
        this.exams = response.exams;
        this.currentPage = response.currentPage;
        this.paginationNumbers = Array.from({ length: response.totalPages }, (_, i) => i + 1);
        console.log(response);  // For debugging

        this.apiService.getStudentExams().subscribe({
          next: (studentExamsResponse) => {
            this.studentExams = studentExamsResponse;
            console.log("user exams ");
            console.log(studentExamsResponse);
            
            
          },
          error: (error) => {
            console.error('Error fetching student exams:', error);
          }
        });

      },
      error: (error) => {
        console.error('Fetch Failed:', error);
      }
    });
  }

  onPageClick(pageNumber: number): void {
    this.loadExams(pageNumber);  // Fetch the data for the selected page
  }

  hasAttended(examId: number): boolean {
    // Check if the student is registered and has attended the exam
    const studentExam = this.studentExams?.find(exam => exam.examId === examId);
    if (!studentExam) {
      // If there's no record of the student for this exam, they are not registered
      return false;
    }
    // If there is a record, check if they've attended (submittedAt is not null)
    return studentExam.submittedAt != null;
  }
}
