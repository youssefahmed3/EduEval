import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { SignalRService } from './services/signalr.service';
import { ToastService } from './services/toast.service';
import { ToastContainerComponent } from './shared/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'EduEval';
  signalRService: SignalRService = inject(SignalRService)
  toastService: ToastService = inject(ToastService)
  @ViewChild('toastContainer') toastContainer!: ToastContainerComponent;

  ngOnInit(): void {
    // Receives notifications from the signalR then starts showing in the toast
    this.signalRService.notificationReceived$.subscribe((notification) => {
      this.toastService.showToast(notification.message, 'info');
    });
  }
  ngAfterViewInit() {
    this.toastService.setToastContainer(this.toastContainer);
  }
  
}
