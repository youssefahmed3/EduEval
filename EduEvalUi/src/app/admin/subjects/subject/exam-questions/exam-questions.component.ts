import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../../../shared/header/header.component";
import { TableComponent } from "../../../../shared/table/table.component";
import { DatePipe } from '@angular/common';
import { Choice, Exam, ExamQuestions, QuestionLibrary, Subject } from '../../../../services/responses.model';
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

    

    this.apiService.getExamQuestions(this.examId!).subscribe({
      next: (response) => {
        this.Questions = response;
        console.log("Questions: ");
        console.log(response);
      },
      error: (error) => {
        console.error('Fetch Failed:', error);

      }
    })

    this.apiService.getSubjectById(this.subjectId!).subscribe({
      next: (response) => {
        this.examSubject = response;
        console.log("examSubject: ");
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
}