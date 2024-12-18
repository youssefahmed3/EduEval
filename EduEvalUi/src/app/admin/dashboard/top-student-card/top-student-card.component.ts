import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-student-card',
  imports: [],
  templateUrl: './top-student-card.component.html',
  styleUrl: './top-student-card.component.scss'
})
export class TopStudentCardComponent {
  @Input({required: true}) StudentName!: string;
  @Input({required: true}) AvgScore!: number;
}
