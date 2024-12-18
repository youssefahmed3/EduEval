import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { TableComponent } from "../../shared/table/table.component";

import { ApiService } from '../../services/api.service';
import { User } from '../../services/responses.model';

@Component({
  selector: 'app-students',
  imports: [HeaderComponent, TableComponent],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
  allStudents!: User[];
  apiService: ApiService = inject(ApiService);
  ngOnInit(): void {
    this.apiService.getAllStudents().subscribe(
      {
        next: (students) => {
          this.allStudents = students;
          console.log(students);
        },
        error: (error) => {
          console.error('Error getting students:', error);
        }
      }
    )
  }

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
}
