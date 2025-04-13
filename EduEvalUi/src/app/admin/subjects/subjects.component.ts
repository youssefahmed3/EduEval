import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { TableComponent } from "../../shared/table/table.component";
import { AllSubjectsPaginated, Subject } from '../../services/responses.model';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subjects',
  imports: [HeaderComponent, TableComponent, RouterLink],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss'
})
export class SubjectsComponent implements OnInit {
  subjects?: Subject[];
  currentPage: number = 1;
  paginationNumbers: number[] = [];
  apiService: ApiService = inject(ApiService);
  ngOnInit(): void {
    this.loadSubjects(this.currentPage);  // Initial load
  }

  loadSubjects(pageNumber: number): void {
    this.apiService.getPaginatiedSubjects(pageNumber, 5).subscribe({
      next: (response: AllSubjectsPaginated) => {
        this.subjects = response.subjects;
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
    this.loadSubjects(pageNumber);  // Fetch the data for the selected page
  }
}
