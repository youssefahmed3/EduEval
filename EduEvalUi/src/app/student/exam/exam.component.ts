import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam } from '../../services/responses.model';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [],
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {
  examId?: string | null;
  examDetails?: Exam;
  currentQuestionIndex: number = 0;
  selectedAnswers: { [key: number]: number | null } = {};
  timer: number = 0;
  timerInterval: any;
  progress: number = 0;

  apiService: ApiService = inject(ApiService);

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('examId');

    // Call EnterExam first to start the exam session
    this.apiService.EnterExam(this.examId!).subscribe({
      next: () => {
        console.log("Exam session started...");

        // Now, load the exam details
      },
      error: (error) => {
        console.error('Error entering the exam:', error);
        this.router.navigate(['/student/exams']);
      }
    });

    this.loadExamDetails();
  }

  loadExamDetails() {
    // Check if data is stored in localStorage
    const storedTimer = localStorage.getItem('examTimer');
    const storedAnswers = localStorage.getItem('selectedAnswers');

    if (storedTimer) {
      // Restore timer and selected answers if they exist
      this.timer = parseInt(storedTimer, 10);
    }

    if (storedAnswers) {
      // Restore selected answers if they exist
      this.selectedAnswers = JSON.parse(storedAnswers);
    }

    // Now, fetch the exam details from the server
    this.fetchExamDetails();
  }


  fetchExamDetails() {
    this.apiService.getExamById(this.examId!).subscribe({
      next: (response) => {
        this.examDetails = response;
  
        // Ensure that the exam details are valid before proceeding
        if (this.examDetails && this.examDetails.examQuestions) {
          console.log(this.examDetails);
  
          if (this.timer === 0) {
            this.timer = response.duration * 60; // Convert duration to seconds
          }
  
          // Proceed with randomizing choices and starting the timer
          this.randomizeChoices();
          this.startTimer();
        } else {
          console.error('Exam details or questions are missing');
        }
      },
      error: (error) => {
        console.error('Failed to fetch exam details:', error);
      }
    });
  }


  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer--;
      this.saveProgress(); // Save progress to localStorage

      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.submitExam();
      }
    }, 1000);
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  randomizeChoices() {
    this.examDetails?.examQuestions.forEach((question) => {
      const correctChoice = question.questionsLibrary.choices.find((c) => c.isCorrect);
      let incorrectChoices = question.questionsLibrary.choices.filter((choice) => !choice.isCorrect);
      
      // If there are more than 4 choices, we limit to 3 incorrect choices
      if (incorrectChoices.length > 3) {
        incorrectChoices = incorrectChoices.slice(0, 3);
      }
  
      // Now we combine the 3 incorrect choices with the correct one
      const finalChoices = [...incorrectChoices, correctChoice!];
  
      // Shuffle the choices to randomize their order (optional)
      question.questionsLibrary.choices = finalChoices.sort(() => 0.5 - Math.random());
    });
  }
  
  
  

  nextQuestion() {
    if (this.currentQuestionIndex < (this.examDetails?.examQuestions.length ?? 0) - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  updateAnswer(choiceId: number) {
    const currentQuestionId = this.examDetails?.examQuestions[this.currentQuestionIndex].questionId;
    if (currentQuestionId) {
      this.selectedAnswers[currentQuestionId] = choiceId;
      this.updateProgress();
      this.saveProgress(); // Save the selected answers to localStorage
    }
  }


  updateProgress() {
    const totalQuestions = this.examDetails?.examQuestions.length ?? 0;
    const answered = Object.keys(this.selectedAnswers).length;
    this.progress = (answered / totalQuestions) * 100;
  }

  saveProgress() {
    // Save the timer and selected answers to localStorage
    localStorage.setItem('examTimer', this.timer.toString());
    localStorage.setItem('selectedAnswers', JSON.stringify(this.selectedAnswers));
  }

  submitExam() {
    console.log('Submitting Exam:', this.selectedAnswers);

    // Prepare the answers in the required format
    const formattedAnswers = Object.keys(this.selectedAnswers).map((questionId) => ({
      questionId: parseInt(questionId, 10),
      selectedChoiceId: this.selectedAnswers[parseInt(questionId, 10)]!,
    }));

    console.log('Formatted Answers:', formattedAnswers);

    // Now you can call the SubmitExam API with the formattedAnswers array
    this.apiService.SubmitExam(this.examId!, formattedAnswers).subscribe({
      next: (response) => {
        console.log('Exam Submitted Successfully:', response);
        // Optionally handle navigation or other logic after submission
      },
      error: (error) => {
        console.error('Submission Failed:', error);
      }
    });

    clearInterval(this.timerInterval); // Clear the timer
    localStorage.removeItem('examTimer');
    localStorage.removeItem('selectedAnswers');
    this.router.navigate([`/student/exams`]);
  }



}
