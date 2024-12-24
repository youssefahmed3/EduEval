import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from "../../../shared/header/header.component";
import { TableComponent } from "../../../shared/table/table.component";
import { AllExamsWithSameSubject, Exam, QuestionLibrary, StudentExams, Subject, User } from '../../../services/responses.model';
import { ApiService } from '../../../services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-subject',
  imports: [HeaderComponent, TableComponent, DatePipe, RouterLink],
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.scss'
})
export class SubjectComponent {
  subjectId: string | null = null;
  subject: Subject | null = null;
  exams?: Exam[];
  currentPage: number = 1;
  paginationNumbers: number[] = [];
  apiService: ApiService = inject(ApiService)
  // Reference for the Modal Dialog
  @ViewChild('questionsModal') questionsModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('attendedStudentsModal') attendedStudentsModal!: ElementRef<HTMLDialogElement>;

  // Selected Student for Modal Content
  SelectedExamQuestions?: QuestionLibrary[];
  attendedStudents?: StudentExams[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // Retrieve the dynamic route parameter
    this.subjectId = this.route.snapshot.paramMap.get('subjectId');

    // If you expect changes in the route parameters during navigation
    this.route.paramMap.subscribe((params) => {
      this.subjectId = params.get('subjectId');
    });

    this.loadExamsBySubjectId(this.currentPage);
  }

  loadExamsBySubjectId(pageNumber: number): void {
    this.apiService.getSubjectById(this.subjectId!).subscribe({
      next: (response) => {
        this.subject = response;
        console.log("Subject: ");
        console.log(response);
      },
      error: (error) => {
        console.error('Fetch Failed:', error);

      }
    })

    this.apiService.getPaginatiedExamsWithSubjectId(pageNumber, 5, this.subjectId!).subscribe({
      next: (response: AllExamsWithSameSubject) => {
        this.exams = response.exams;
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


  // Open Modal for a Specific Student
  openModalQuestion(Questions: any): void {
    this.SelectedExamQuestions = Questions;
    if (this.questionsModal?.nativeElement) {
      this.questionsModal.nativeElement.showModal();
    }
  }

  // Close Modal
  closeModalQuestion(): void {
    if (this.questionsModal?.nativeElement) {
      this.questionsModal.nativeElement.close();
    }
  }

  openModalAttendedStudents(students: any): void {
    this.attendedStudents = students;
    if (this.attendedStudentsModal?.nativeElement) {
      this.attendedStudentsModal.nativeElement.showModal();
    }
  }

  // Close Modal
  closeModalAttendedStudents(): void {
    if (this.attendedStudentsModal?.nativeElement) {
      this.attendedStudentsModal.nativeElement.close();
    }
  }




  onPageClick(pageNumber: number): void {
    this.loadExamsBySubjectId(pageNumber);  // Fetch the data for the selected page
  }
}
