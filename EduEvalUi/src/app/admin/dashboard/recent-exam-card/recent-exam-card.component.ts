import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-exam-card',
  imports: [],
  templateUrl: './recent-exam-card.component.html',
  styleUrl: './recent-exam-card.component.scss'
})
export class RecentExamCardComponent {
  @Input({required: true}) ExamTitle!: string;
  @Input({required: true}) SubjectTitle!: string;
  @Input({required: true}) NumberOfQuestion!: string;
  @Input({required: true}) totalMinsOfExam!: string;
}
