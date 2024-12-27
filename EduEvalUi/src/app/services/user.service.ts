import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service'; // Adjust path based on your project

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserDataSubject = new BehaviorSubject<any>(null); // Caches user data
  currentUserData$ = this.currentUserDataSubject.asObservable();  // Exposes the data as an Observable

  constructor(private apiService: ApiService) {}

  fetchCurrentUserData(): void {
    if (this.currentUserDataSubject.value) {
      // Data is already loaded, no need to fetch again
      return;
    }

    this.apiService.getCurrentUserData().subscribe({
      next: (response) => {
        this.currentUserDataSubject.next(response); // Cache the data
        console.log('Fetched Current User Data:', response);
      },
      error: (error) => {
        console.error('Error Fetching Current User Data:', error);
      }
    });
  }
}
