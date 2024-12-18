import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { TableComponent } from "../../shared/table/table.component";
import { Subject } from '../../services/responses.model';
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
  apiService: ApiService = inject(ApiService);
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
}
