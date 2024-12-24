import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../../../shared/header/header.component";
import { TableComponent } from "../../../../shared/table/table.component";
import { DatePipe } from '@angular/common';
import { AllExamQuestionsPaginated, AllExamsWithSameSubject, Choice, Exam, ExamQuestions, QuestionLibrary, Subject } from '../../../../services/responses.model';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-exam-questions',
  imports: [HeaderComponent, TableComponent, DatePipe, RouterLink],
  templateUrl: './exam-questions.component.html',
  styleUrl: './exam-questions.component.scss'
})
export class ExamQuestionsComponent {
  examId: string | null = null;
  subjectId: string | null = null;
  Questions!: ExamQuestions[];
  examSubject: Subject | null = null;
  choices: Choice[] = [];
  currentPage: number = 1;
  paginationNumbers: number[] = [];
  @ViewChild('ChoicesModal') ChoicesModal!: ElementRef<HTMLDialogElement>;
  apiService: ApiService = inject(ApiService)
  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    // Retrieve the dynamic route parameter
    this.examId = this.route.snapshot.paramMap.get('examId');
    this.subjectId = this.route.snapshot.paramMap.get('subjectId');

    // If you expect changes in the route parameters during navigation
    this.route.paramMap.subscribe((params) => {
      this.examId = params.get('examId');
      this.subjectId = params.get('subjectId');
    });

    /* this.apiService.getExamQuestions(this.examId!).subscribe({
      next: (response) => {
        this.Questions = response;
        console.log("Questions: ");
        console.log(response);
      },
      error: (error) => {
        console.error('Fetch Failed:', error);

      }
    }) */

    this.loadExamQuestions(this.currentPage);
  }
  
  loadExamQuestions(pageNumber: number): void {
    this.apiService.getSubjectById(this.subjectId!).subscribe({
      next: (response) => {
        this.examSubject = response;
        console.log("Subject: ");
        console.log(response);
      },
      error: (error) => {
        console.error('Fetch Failed:', error);

      }
    })

    this.apiService.getPaginatiedExamQuestions(pageNumber, 5, this.examId!).subscribe({
      next: (response: AllExamQuestionsPaginated) => {
        this.Questions = response.questions;
        this.currentPage = response.currentPage;
        this.paginationNumbers = Array.from({ length: response.totalPages }, (_, i) => i + 1);
        console.log("exams: ");
        console.log(response);
      },
      error: (error) => {
        console.error('Fetch Failed:', error);

      }
    })
  }

  openModalChoices(choices: any): void {
    this.choices = choices;
    if (this.ChoicesModal?.nativeElement) {
      this.ChoicesModal.nativeElement.showModal();
    }
  }

  // Close Modal
  closeModalQuestion(): void {
    if (this.ChoicesModal?.nativeElement) {
      this.ChoicesModal.nativeElement.close();
    }
  }

  navigateBack(): void {
    this.router.navigate(['/dashboard']); // Navigate to the '/dashboard' route
  }

  onPageClick(pageNumber: number): void {
    this.loadExamQuestions(pageNumber);  // Fetch the data for the selected page
  }
}
