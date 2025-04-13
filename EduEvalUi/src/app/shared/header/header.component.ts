import { AfterViewInit, Component, ElementRef, inject, Input, Pipe, ViewChild } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { FormsModule } from '@angular/forms';
import { InputComponent } from "../input/input.component";
import { SelectComponent } from "../select/select.component";
import { ApiService } from '../../services/api.service';
import { CreateExam, Subject, User } from '../../services/responses.model';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-header',
  imports: [ButtonComponent, FormsModule, InputComponent, SelectComponent,DatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input({ required: false }) fullName?: string;
  SubjectTitle?: string;
  SubjectDescription?: string;
  subjects?: Subject[];
  currentUserData?: User;
  ExamTitle?: string;
  ExamDurationInMins?: number;
  currentDate = new Date(); // Uses today's date

  selectedSubjectId?: number = 0;
  apiService: ApiService = inject(ApiService);
  userService: UserService = inject(UserService);
  errorSubjectForm?: string;
  errorExamForm?: string;
  toastService: ToastService = inject(ToastService);

  ngOnInit(): void {
    this.apiService.getAllSubjects().subscribe(
      {
        next: (response) => {
          this.subjects = response;
          console.log(response);
        },
        error: (error) => {
          console.error('Fetch Failed:', error);
        }
      }
    )
    this.userService.fetchCurrentUserData();

    // Subscribe to the user data
    this.userService.currentUserData$.subscribe((data) => {
      if (data) {
        this.currentUserData = data;
        console.log('Current User Data:', data);
      }
    });
  }
  onSubmitSubject() {
    if (this.isValidFormSubjectCreation()) {
      console.log(this.SubjectTitle, this.SubjectDescription, this.selectedSubjectId);
      var payload = {
        subjectName: this.SubjectTitle!,
        subjectDescription: this.SubjectDescription!,
      }
      this.apiService.CreateSubject(payload).subscribe(
        {
          next: (response) => {
            console.log('Post Success:', response);
            this.errorSubjectForm = undefined;
            this.SubjectTitle = undefined;
            this.SubjectDescription = undefined;
          },
          error: (error) => {
            console.error('Fetch Failed:', error);
          }
        }
      )
    }
    else {
      this.errorSubjectForm = 'Please make sure all fields are filled and selected';
      console.log(this.errorSubjectForm);

    }
  }

  isValidFormSubjectCreation(): boolean {
    // Check if the question, difficulty, and subject are selected
    const isFormValid = this.SubjectTitle !== undefined && this.SubjectDescription !== undefined



    return isFormValid;
  }


  onSubmitExam() {
    if (this.isValidFormExamCreation()) {
      console.log(this.ExamTitle, this.ExamDurationInMins, this.selectedSubjectId);
      var payload : CreateExam = {
        examTitle: this.ExamTitle!,
        duration: this.ExamDurationInMins!,
        subjectId: this.selectedSubjectId!,
      }
      this.apiService.CreateExam(payload).subscribe(
        {
          next: (response) => {
            console.log('Post Success:', response);
            this.errorExamForm = undefined;
            this.ExamDurationInMins = undefined;
            this.selectedSubjectId = 0;
            this.ExamTitle = undefined;
            this.toastService.showToast(`Exam ${this.ExamTitle} Created Successfully`, 'info');
          },
          error: (error) => {
            console.error('Fetch Failed:', error);
          }
        }
      )
    }
    else {
      this.errorExamForm = 'Please make sure all fields are filled and selected';
      console.log(this.errorExamForm);

    }
    
  }
  isValidFormExamCreation(): boolean {
    // Check if the question, difficulty, and subject are selected
    const isFormValid = this.ExamTitle !== undefined && this.ExamDurationInMins !== undefined && this.selectedSubjectId !== 0;



    return isFormValid;
  }
}
