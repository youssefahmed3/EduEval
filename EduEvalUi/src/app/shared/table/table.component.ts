import { Component, Input } from '@angular/core';
import { DialogComponent } from "../dialog/dialog.component";
import { InputComponent } from "../input/input.component";
import { User } from '../../services/responses.model';

@Component({
  selector: 'app-table',
  imports: [DialogComponent, InputComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
// @Input({required: true}) AllStudents!: User[];

// Open a specific modal programmatically
openModal(studentId: string) {
  const modal = document.querySelector(`#examModal_${studentId}`) as HTMLDialogElement;
  if (modal) {
    modal.showModal();
  }
}

// Close modal (optional for the ✕ button)
closeModal(modal: HTMLDialogElement) {
  modal.close();
}
}
