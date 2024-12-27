import { Component } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { Exam, User } from '../../services/responses.model';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  notifications: { message: { message: string, status: string } }[] = [];
  constructor(private signalRService: SignalRService) { }

  ngOnInit(): void {
    // Load persistent notifications
    this.notifications = this.signalRService.getNotifications();

    this.signalRService.notificationReceived$.subscribe((notification) => {
      this.notifications.push(notification);
      console.log(this.notifications);
      
    });
  }

  // Optional: Send a test notification (for demo purposes)
  sendTestNotification(): void {
    this.signalRService.sendNotification('Test Notification', 'This is a test message.');
  }

  ngOnDestroy(): void {
    // Remove SignalR listeners to avoid duplicates
    this.signalRService.removeExamSubmittedListener();
  }
}
