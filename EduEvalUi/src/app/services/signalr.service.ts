import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private readonly hubUrl = 'http://localhost:5000/notificationHub'; // Your hub URL
  public notificationReceived$ = new Subject<any>(); // Observable for notifications
  private notifications: any[] = []; // Persistent notifications array
  authService: AuthService = inject(AuthService);
  constructor() { 
    this.startConnection();
    this.addListeners();
  }

  // Start the SignalR connection
  public startConnection(): void {
    console.log("starting");
    console.log("Starting SignalR connection...");
    console.log("Hub URL:", this.hubUrl);
    console.log("Access Token:", localStorage.getItem("auth_token"));
    const options = {
      accessTokenFactory: () => {

        // Replace with how you retrieve your token
        var token = localStorage.getItem("auth_token")!;
        return token

      },
      // withCredentials: true,
      // transport: signalR.HttpTransportType.WebSockets
    };
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR connection already established.');
      return;
    }
    console.log(localStorage.getItem("auth_token"));

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, options)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // console.log(this.hubConnection);
    this.hubConnection.onclose(() => {
      console.log('SignalR connection closed, reconnecting...');
      this.startConnection(); // Reconnect if the connection is closed
    });

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection established' + ` ${localStorage.getItem("auth_token")}`)
       if(this.authService.getUserRole() == "Admin") {
        this.joinGroup("AdminGroup")
       }
      })
      .catch(err => console.error('Error while starting SignalR connection:', err));
  }


  // Listen for notifications
  public addNotificationListener(callback: (title: string, message: string) => void): void {
    this.hubConnection.on('ReceiveNotification', (title: string, message: string) => {
      console.log('Notification received:', title, message);
      callback(title, message);
    });
  }

  private addListeners(): void {
    
    this.hubConnection.on('ExamSubmittedByStudent', (message: string, status: string) => {
      this.notifications.push({ message, status }); // Save notification in persistent array
      this.notificationReceived$.next({ message, status });
    });
  }

  public getNotifications(): { message: { message: string; status: string } }[] {
    return [...this.notifications]; // Return a copy of the notifications array
  }


  // Send a notification (optional, if Angular app needs to trigger notifications)
  public sendNotification(title: string, message: string): void {
    this.hubConnection
      .invoke('SendNotification', title, message)
      .catch(err => console.error('Error while sending notification:', err));
  }

  public onExamSubmitted(callback: (notification: any) => void): void {
    // Remove any existing listeners for 'ExamSubmittedByStudent'
    this.hubConnection.off('ExamSubmittedByStudent');

    // Add the listener
    this.hubConnection.on('ExamSubmittedByStudent', (notification) => {
      console.log('Exam submitted notification received:', notification);
      callback(notification);
    });
  }
  public removeExamSubmittedListener(): void {
    this.hubConnection.off('ExamSubmittedByStudent');
  }

  public joinGroup(groupName: string): void {
    this.hubConnection
      .invoke('JoinGroup', groupName)
      .then(() => console.log(`Joined group: ${groupName}`))
      .catch((err) => console.error(`Error joining group ${groupName}:`, err));
  }
}
