import { Injectable } from '@angular/core';
import { ToastContainerComponent } from '../shared/toast-container/toast-container.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastContainer!: ToastContainerComponent;

  setToastContainer(container: ToastContainerComponent) {
    this.toastContainer = container;
  }

  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    if (!this.toastContainer) {
      console.error('ToastContainer is not initialized!');
      return;
    }
    this.toastContainer.addToast(message, type);
  }
}
