import { Component, inject, OnInit } from '@angular/core';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { SelectComponent } from '../../../shared/select/select.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputComponent } from '../../../shared/input/input.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../shared/header/header.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Exam, QuestionLibrary } from '../../../services/responses.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-question-to-exam',
  imports: [TextareaComponent, SelectComponent, ButtonComponent, InputComponent, FormsModule, HeaderComponent, RouterLink],
  templateUrl: './add-question-to-exam.component.html',
  styleUrl: './add-question-to-exam.component.scss'
})
export class AddQuestionToExamComponent implements OnInit {
  selectedQuestionId?: number = 0;
  currentQuestion!: QuestionLibrary | undefined;
  examId?: string | null;
  subjectId?: number | null;
  Questions: QuestionLibrary[] = [];
  exam!: Exam;
  apiService: ApiService = inject(ApiService);
  error?: string;
  constructor(private route: ActivatedRoute, private router: Router) { }


  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('examId');
    console.log(this.examId);

    this.route.paramMap.subscribe((params) => {
      this.examId = params.get('examId');
    });

    // First API Call: Fetch Exam By ID
    this.apiService.getExamById(this.examId!).subscribe({
      next: (response) => {
        this.exam = response;
        this.subjectId = response.subject.id;
        console.log("exam", response);

        // Second API Call: Fetch Questions using subjectId
        this.apiService.getAllQuestionsBySubjectId(this.subjectId!).subscribe({
          next: (questionsResponse) => {
            this.Questions = questionsResponse;
            console.log("Questions:", questionsResponse);

            // If a question is already selected, ensure it's set properly
            if (this.selectedQuestionId) {
              this.updateCurrentQuestion();
            }
          },
          error: (error) => {
            console.error("Fetch Questions Failed:", error);
          }
        });
      },
      error: (error) => {
        console.error("Fetch Exam Failed:", error);
      }
    });
  }

  updateCurrentQuestion() {
    // Update currentQuestion whenever selectedQuestionId changes
    this.currentQuestion = this.Questions.find(q => q.id == this.selectedQuestionId);
    console.log(this.currentQuestion);
  }



  isValidForm(): boolean {
    // Check if the selectedQuestionId already exists in exam.examQuestions
    const isUniqueQuestionId = !this.exam.examQuestions.some(q => q.questionId == this.selectedQuestionId);
    const vaildQuestionId = this.selectedQuestionId !== 0;
    // console.log("Is Unique Question ID: ", isUniqueQuestionId);
    
    return isUniqueQuestionId && vaildQuestionId;
  }


/*   deleteQuestionFromExam() {
    this.apiService.deleteQuestionFromExam(this.examId!, this.selectedQuestionId?.toString()!).subscribe({
      next: (response) => {
        console.log("Question Deleted From Exam:", response);
        this.router.navigate([`/admin/exams/${this.examId}/questions`]);
      },
      error: (error) => {
        console.error("Delete Question From Exam Failed:", error);
      }
    })
  } */

  onSubmit() {
    
    if(this.isValidForm()) {
      this.apiService.addQuestionToExam(this.examId!, this.selectedQuestionId!).subscribe({
        next: (response) => {
          console.log("Question Added To Exam:", response);
          this.router.navigate([`/admin/exams/${this.examId}/questions`]);
        },
        error: (error) => {
          console.error("Add Question To Exam Failed:", error);
        }
      });
    }else {
      this.error = "Please select a question Or, The Question already exists in the exam"
      console.log(this.error);
      
    }
    // console.log(this.selectedQuestionId);

    /* this.currentQuestion = this.Questions.find(q => q.id == this.selectedQuestionId);
    console.log(this.currentQuestion); */

    
  }
}
