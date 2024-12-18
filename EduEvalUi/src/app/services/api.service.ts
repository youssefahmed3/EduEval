import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AddQuestionLibrary, AddSubject, CreateExam, QuestionLibrary, User, UserEdit } from './responses.model';

@Injectable({
    providedIn: 'root', // We will use this globally
})
export class ApiService {
    private apiUrl = 'http://localhost:5000'; // Replace with your API

    constructor(private http: HttpClient, private authService: AuthService) { }

    loginUser(credentials: { email: string; password: string; }): Observable<any> {
        var response = this.http.post(`${this.apiUrl}/Auth/login`, credentials);
        return response;
    }

    registerUser(user: { firstName: string; lastName: string; username: string; email: string; password: string }): Observable<any> {
        var response = this.http.post(`${this.apiUrl}/Auth/register`, user);
        return response;
    }

    getCurrentUserData(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/User/User/profile`, { headers })
        return response;
    }
    /* ----------- */
    getAllSubjects(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/Subject/Subjects`, { headers })
        return response;
    }
    

    getAllStudents(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/User/Students`, { headers })
        return response;
    }

    getAllExams(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/Exam/Exams`, { headers })
        return response;
    }


    CreateQuestion(payload: AddQuestionLibrary) : Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.post(`${this.apiUrl}/Questions/Question`, payload , { headers, responseType: 'text', })
        return response;
    }

    CreateSubject(payload: AddSubject) : Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.post(`${this.apiUrl}/Subject/Subject`, payload , { headers, responseType: 'text'})
        return response;
    }

    CreateExam(payload: CreateExam) : Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.post(`${this.apiUrl}/Exam/Exam`, payload , { headers, responseType: 'text'})
        return response;
    }

    getSubjectById(id: string) : Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/Subject/GetSubjectById/${id}` , { headers} )
        return response;
    }
    
    getExamQuestionsById(examId:string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/Exam/GetExamQuestions/${examId}` , { headers} )
        return response;
    }

    getExamById(examId:string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/Exam/GetSingleExam/${examId}` , { headers} )
        return response;
    }

    getAllExamsWithSubjectId(subjectId:string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/Exam/GetExamsBySubjectId/${subjectId}` , { headers} )
        return response;
    }

    getExamQuestions(examId: string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/Exam/GetExamQuestions/${examId}` , { headers} )
        return response;
    }

    getAllQuestionsBySubjectId(subjectId: number) : Observable<any> {
        
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/Questions/GetQuestionsBySubjectId/${subjectId}` , { headers} )
        return response;
    }



    addQuestionToExam(examId: string, questionId: number) : Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.post(`${this.apiUrl}/Exam/${examId}/AddQuestion/${questionId}`, null ,{ headers, responseType: 'text'})
        return response;
    }

    deleteQuestionFromExam(examId: string, questionId: string) : Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.delete(`${this.apiUrl}/Exam/${examId}/DeleteQuestion/${questionId}` ,{ headers, responseType: 'text'})
        return response;
    }

    updateUserData(payload: UserEdit) : Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.put(`${this.apiUrl}/User/EditProfile`, payload , { headers, responseType: 'text' })
        return response;
    }

    getStudentExams() : Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/StudentExams/currentStudent/history`, { headers })
        return response;
    }

    EnterExam(examId: string) : Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/StudentExams/EnterExam/${examId}`, { headers })
        return response;
    }

    SubmitExam(examId: string, payload: any) : Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.post(`${this.apiUrl}/StudentExams/SubmitExam/${examId}`,payload ,{ headers })
        return response;
    }
}   