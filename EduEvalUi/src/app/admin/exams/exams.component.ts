import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { ApiService } from '../../services/api.service';
import {AllExamsPaginated, Exam } from '../../services/responses.model';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from "../../shared/button/button.component";

@Component({
  selector: 'app-exams',
  imports: [HeaderComponent, DatePipe, ButtonComponent],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.scss'
})
export class ExamsComponent implements OnInit {
  exams?: Exam[];
  currentPage: number = 1;
  paginationNumbers: number[] = [];
  apiService: ApiService = inject(ApiService);

  ngOnInit(): void {
    this.loadExams(this.currentPage);  // Initial load
  }

  loadExams(pageNumber: number): void {
    this.apiService.getPaginatiedExams(pageNumber, 5).subscribe({
      next: (response: AllExamsPaginated) => {
        this.exams = response.exams;
        this.currentPage = response.currentPage;
        this.paginationNumbers = Array.from({ length: response.totalPages }, (_, i) => i + 1);
        console.log(response);  // For debugging
      },
      error: (error) => {
        console.error('Fetch Failed:', error);
      }
    });
  }

  onPageClick(pageNumber: number): void {
    this.loadExams(pageNumber);  // Fetch the data for the selected page
  }

}
