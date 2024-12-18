import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat',
  imports: [],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss'
})
export class StatComponent {
  @Input({required: true}) statTitle!: string;
  @Input({required: true}) statValue!: string;
  @Input({required: true}) statDesc!: string;


}
/* 21% more than last month */