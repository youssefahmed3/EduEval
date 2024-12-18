import { Component, Inject, inject, OnInit } from '@angular/core';
import { TextareaComponent } from "../../../shared/textarea/textarea.component";
import { SelectComponent } from "../../../shared/select/select.component";
import { ButtonComponent } from "../../../shared/button/button.component";
import { InputComponent } from "../../../shared/input/input.component";
import { FormsModule } from '@angular/forms';
import { AddChoice, Choice, Subject } from '../../../services/responses.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-new-question',
  imports: [TextareaComponent, SelectComponent, ButtonComponent, InputComponent, FormsModule],
  templateUrl: './add-new-question.component.html',
  styleUrl: './add-new-question.component.scss'
})
export class AddNewQuestionComponent implements OnInit {
  apiService: ApiService = inject(ApiService)

  QuestionText!: string;
  selectedDifficulty?: string = 'Difficulty';
  selectedSubjectId?: number = 0;
  AllChoices: AddChoice[] = [];
  subjects?: Subject[];
  choiceText: string = '';
  isCorrect: boolean = false;
  errorQuestionSubmission?: string;
  errorChoicesSubmission?: string;
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
  }

  onSubmitQuestion() {
    if (!this.isValidFormQuestion()) {
      this.errorQuestionSubmission = "Please make sure all fields are filled and there are at least 4 choices with one correct."
      console.log(this.errorQuestionSubmission);

      return;
    }
    console.log('Question:', this.QuestionText);
    console.log('selectedDiff:', this.selectedDifficulty);
    console.log('selectedSubject:', this.selectedSubjectId);
    console.log('AllChoices:', this.AllChoices);
    var playload =  {
      questionText: this.QuestionText,
      difficulty: this.selectedDifficulty!,
      subjectId: this.selectedSubjectId!,
      choices: this.AllChoices
    }
    this.apiService.CreateQuestion(playload).subscribe({
      next: (response) => {
        console.log('Post Success:', response);
        this.errorQuestionSubmission = undefined;
        this.QuestionText = '';
        this.selectedDifficulty = 'Difficulty';
        this.selectedSubjectId = 0;
        this.AllChoices = [];
      },
      error: (error) => {
        console.error('Fetch Failed:', error);
        this.errorQuestionSubmission = "An error occurred while submitting the question. Please try again later.";
      }
    })

  }


  // Validate the form and choices before submitting
  isValidFormQuestion(): boolean {
    // Check if the question, difficulty, and subject are selected
    const isFormValid = this.QuestionText !== undefined && this.selectedDifficulty !== 'Difficulty' && this.selectedSubjectId !== 0;

    // Check if there are at least 4 choices and one is marked as correct
    const hasValidChoices = this.AllChoices !== undefined && this.AllChoices.length >= 4 && this.AllChoices.some(choice => choice.isCorrect);

    return isFormValid && hasValidChoices;
  }

  isValidFormChoices() {
    // Check if the choice text is not empty
    const hasValidChoiceText = this.choiceText !== undefined && this.choiceText.trim() !== '';

    // Check if the isCorrect field is checked

    return hasValidChoiceText;
  }


  onSubmitChoice() {
    if (this.isValidFormChoices()) {
      console.log('choiceText:', this.choiceText);
      console.log('isCorrect:', this.isCorrect);


      if(this.AllChoices == null) {
        this.AllChoices = [];
        this.AllChoices.push({ choiceText: this.choiceText, isCorrect: this.isCorrect });
      }
      else {
        this.AllChoices.push({ choiceText: this.choiceText, isCorrect: this.isCorrect });
      }

    }
    else {
      this.errorChoicesSubmission = "Please Make sure That All Fields Are Filled And Checked"
      console.log(this.errorChoicesSubmission);
      
    }
  }

}
