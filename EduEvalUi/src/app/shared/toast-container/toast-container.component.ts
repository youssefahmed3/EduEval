import { Component } from '@angular/core';
import { ToastComponent } from "../toast/toast.component";

@Component({
  selector: 'app-toast-container',
  imports: [ToastComponent],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss'
})
export class ToastContainerComponent {
  toasts: { message: string; type: 'success' | 'error' | 'info' | 'warning' }[] = [];

  addToast(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.toasts.push({ message, type });

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      this.toasts.shift();
    }, 5000);
  }
}
