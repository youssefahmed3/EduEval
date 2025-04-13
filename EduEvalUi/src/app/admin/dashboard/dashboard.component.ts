import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { ButtonComponent } from "../../shared/button/button.component";
import { StatComponent } from "./stat/stat.component";
import { RecentExamCardComponent } from "./recent-exam-card/recent-exam-card.component";
import { TopStudentCardComponent } from "./top-student-card/top-student-card.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { Exam, User } from '../../services/responses.model';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent, ButtonComponent, StatComponent, RecentExamCardComponent, TopStudentCardComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  apiService: ApiService = inject(ApiService);
  totalStudentCount: number = 0;
  RecentStudents: User[] = [];
  RecentExams: Exam[] = [];
  totalSubjectCount: number = 0;
  totalExamsCount: number = 0;

  ngOnInit(): void {
    // Use forkJoin to merge API calls
    forkJoin({
      subjects: this.apiService.getAllSubjects(),
      students: this.apiService.getAllStudents(),
      exams: this.apiService.getAllExams()
    }).subscribe({
      next: (response) => {
        console.log('Fetch Success:', response);

        // Get the 5 most recent exams
        this.RecentExams = response.exams
          .sort((a: any, b: any) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
          .slice(0, 5);

        // Get the 5 most recent students
        this.RecentStudents = response.students
          .sort((a: any, b: any) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
          .slice(0, 5);

        // Calculate the average score for each student
        this.RecentStudents.forEach(student => {
          student.averageScore = this.calculateAverageScore(student);
        });

        // Access each response individually
        this.totalSubjectCount = response.subjects.length;
        this.totalStudentCount = response.students.length;
        this.totalExamsCount = response.exams.length;
      },
      error: (error) => {
        console.error('Fetch Failed:', error);
      }
    });
  }

  // Method to calculate average score for a student
  calculateAverageScore(student: User): number {
    // Ensure that studentsExams is an array and not null or undefined
    if (!student.studentsExams || student.studentsExams.length === 0) {
      return 0;
    }
  
    // Calculate the total score using reduce
    const totalScore = student.studentsExams.reduce((sum, exam) => sum + exam.score, 0);
  
    // Return the average score
    return totalScore / student.studentsExams.length;
  }
}
