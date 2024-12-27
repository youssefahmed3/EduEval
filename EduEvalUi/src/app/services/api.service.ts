import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AddQuestionLibrary, AddSubject, AllExamQuestionsPaginated, AllExamsPaginated, AllExamsWithSameSubject, AllStudentsPagintated, AllSubjectsPaginated, CreateExam, QuestionLibrary, User, UserEdit } from './responses.model';

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


    CreateQuestion(payload: AddQuestionLibrary): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.post(`${this.apiUrl}/Questions/Question`, payload, { headers, responseType: 'text', })
        return response;
    }

    CreateSubject(payload: AddSubject): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.post(`${this.apiUrl}/Subject/Subject`, payload, { headers, responseType: 'text' })
        return response;
    }

    CreateExam(payload: CreateExam): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.post(`${this.apiUrl}/Exam/Exam`, payload, { headers, responseType: 'text' })
        return response;
    }

    getSubjectById(id: string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/Subject/GetSubjectById/${id}`, { headers })
        return response;
    }

    getExamQuestionsById(examId: string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/Exam/GetExamQuestions/${examId}`, { headers })
        return response;
    }

    getExamById(examId: string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/Exam/GetSingleExam/${examId}`, { headers })
        return response;
    }

    getAllQuestionsBySubjectId(subjectId: number): Observable<any> {

        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/Questions/GetQuestionsBySubjectId/${subjectId}`, { headers })
        return response;
    }

    addQuestionToExam(examId: string, questionId: number): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.post(`${this.apiUrl}/Exam/${examId}/AddQuestion/${questionId}`, null, { headers, responseType: 'text' })
        return response;
    }

    deleteQuestionFromExam(examId: string, questionId: string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.delete(`${this.apiUrl}/Exam/${examId}/DeleteQuestion/${questionId}`, { headers, responseType: 'text' })
        return response;
    }

    updateUserData(payload: UserEdit): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.put(`${this.apiUrl}/User/EditProfile`, payload, { headers, responseType: 'text' })
        return response;
    }

    getStudentExams(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/StudentExams/currentStudent/history`, { headers })
        return response;
    }

    EnterExam(examId: string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get(`${this.apiUrl}/StudentExams/EnterExam/${examId}`, { headers, responseType: 'text' })
        return response;
    }

    SubmitExam(examId: string, payload: any): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.post(`${this.apiUrl}/StudentExams/SubmitExam/${examId}`, payload, { headers, responseType: 'text' })
        return response;
    }

    getPaginatiedExams(pageNumber: number, pageSize: number) : Observable<AllExamsPaginated> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get<AllExamsPaginated>(`${this.apiUrl}/Exam/Exam/PaginatedExams?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers })
        return response;
    }

    getPaginatiedSubjects(pageNumber: number, pageSize: number) : Observable<AllSubjectsPaginated> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get<AllSubjectsPaginated>(`${this.apiUrl}/Subject/Subject/PaginatedSubjects?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers })
        return response;
    }

    getPaginatiedStudents(pageNumber: number, pageSize: number) : Observable<AllStudentsPagintated> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get<AllStudentsPagintated>(`${this.apiUrl}/User/User/PaginatedStudents?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers })
        return response;
    }

    getPaginatiedExamsWithSubjectId(pageNumber: number, pageSize: number, subjectId: string) : Observable<AllExamsWithSameSubject> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get<AllExamsWithSameSubject>(`${this.apiUrl}/Exam/GetPaginatedExamsBySubjectId/${subjectId}?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers })
        return response;
    }

    getPaginatiedExamQuestions(pageNumber: number, pageSize: number, examId: string) : Observable<AllExamQuestionsPaginated> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
        });
        var response = this.http.get<AllExamQuestionsPaginated>(`${this.apiUrl}/Exam/GetPaginatedExamQuestions/${examId}?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers })
        return response;
    }
}   


/* /Exam/GetPaginatedExamsBySubjectId/2?pageNumber=1&pageSize=10 */