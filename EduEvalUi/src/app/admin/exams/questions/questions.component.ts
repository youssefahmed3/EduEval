import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AllExamQuestionsPaginated, Choice, ExamQuestions, Subject } from '../../../services/responses.model';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from "../../../shared/header/header.component";
import { TableComponent } from "../../../shared/table/table.component";
import { DatePipe } from '@angular/common';
import { ButtonComponent } from "../../../shared/button/button.component";
/* َCommits */
@Component({
  selector: 'app-questions',
  imports: [HeaderComponent, TableComponent, RouterLink, DatePipe, ButtonComponent],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss'
})
export class QuestionsComponent {
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
  

    // If you expect changes in the route parameters during navigation
    this.route.paramMap.subscribe((params) => {
      this.examId = params.get('examId');
    });

    this.loadExamQuestions(this.currentPage);
  }
  
  loadExamQuestions(pageNumber: number): void {
    
    this.apiService.getPaginatiedExamQuestions(pageNumber, 5, this.examId!).subscribe({
      next: (response: AllExamQuestionsPaginated) => {
        this.Questions = response.questions;
        this.currentPage = response.currentPage;
        this.paginationNumbers = Array.from({ length: response.totalPages }, (_, i) => i + 1);
        this.subjectId = response.questions[0].questionsLibrary.subjectId.toString();
        console.log("exams: ");
        console.log(response);

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
      },
      error: (error) => {
        console.error('Fetch Failed:', error);

      }
    })

    
  }
  onPageClick(pageNumber: number): void {
    this.loadExamQuestions(pageNumber);  // Fetch the data for the selected page
  }

  deleteQuestionFromExam(questionId: number) {
    this.apiService.deleteQuestionFromExam(this.examId!, questionId.toString()!).subscribe({
      next: (response) => {
        console.log("Question Deleted From Exam:", response);
        this.router.navigate([`/admin/exams/${this.examId}/questions`]);
      },
      error: (error) => {
        console.error("Delete Question From Exam Failed:", error);
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
}
