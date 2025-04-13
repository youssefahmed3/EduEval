import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @Input() message: any ;
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
}
