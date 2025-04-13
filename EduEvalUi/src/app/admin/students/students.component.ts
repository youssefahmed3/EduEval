import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { TableComponent } from "../../shared/table/table.component";

import { ApiService } from '../../services/api.service';
import { AllStudentsPagintated, AllSubjectsPaginated, Exam, User } from '../../services/responses.model';

@Component({
  selector: 'app-students',
  imports: [HeaderComponent, TableComponent],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
  allStudents!: User[];
  apiService: ApiService = inject(ApiService);
  currentPage: number = 1;
  paginationNumbers: number[] = [];

  // Reference for the Modal Dialog
  @ViewChild('examModal') examModal!: ElementRef<HTMLDialogElement>;

  // Selected Student for Modal Content
  selectedStudent?: User;

  // Open Modal for a Specific Student
  openModal(student: any): void {
    this.selectedStudent = student;
    if (this.examModal?.nativeElement) {
      this.examModal.nativeElement.showModal();
    }
  }

  // Close Modal
  closeModal(): void {
    if (this.examModal?.nativeElement) {
      this.examModal.nativeElement.close();
    }
  }

  ngOnInit(): void {
    this.loadStudents(this.currentPage);  // Initial load
  }

  loadStudents(pageNumber: number): void {
    this.apiService.getPaginatiedStudents(pageNumber, 5).subscribe({
      next: (response: AllStudentsPagintated) => {
        this.allStudents = response.students;
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
    this.loadStudents(pageNumber);  // Fetch the data for the selected page
  }
}
