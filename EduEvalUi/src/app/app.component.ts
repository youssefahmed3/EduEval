import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { InputComponent } from "./shared/input/input.component";
import { TextareaComponent } from "./shared/textarea/textarea.component";
import { SelectComponent } from "./shared/select/select.component";
import { TableComponent } from "./shared/table/table.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, SidebarComponent, InputComponent, TextareaComponent, SelectComponent, TableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'EduEval';
}
