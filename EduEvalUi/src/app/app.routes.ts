import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { StudentsComponent } from './admin/students/students.component';
import { SubjectsComponent } from './admin/subjects/subjects.component';
import { ExamsComponent } from './admin/exams/exams.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { AuthGuard } from './gaurds/auth.guard';
import { GuestGuard } from './gaurds/guest.guard';
import { StudentComponent } from './student/student.component';
import { HistoryComponent } from './student/history/history.component';
import { StudentExamsComponent } from './student/student-exams/student-exams.component';
import { StudentProfileComponent } from './student/student-profile/student-profile.component';
import { RoleRedirectComponent } from './role-redirect/role-redirect.component';
import { AddNewQuestionComponent } from './admin/dashboard/add-new-question/add-new-question.component';
import { SubjectComponent } from './admin/subjects/subject/subject.component';
import { ExamQuestionsComponent } from './admin/subjects/subject/exam-questions/exam-questions.component';
import { QuestionsComponent } from './admin/exams/questions/questions.component';
import { AddQuestionToExamComponent } from './admin/exams/add-question-to-exam/add-question-to-exam.component';
import { ExamComponent } from './student/exam/exam.component';
import { NotificationComponent } from './admin/notification/notification.component';


export const routes: Routes = [
    // { path: '**', redirectTo: '/', pathMatch: 'full' }, // Default route
    { path: "login", component: LoginComponent, canActivate: [GuestGuard] },
    { path: "register", component: RegisterComponent, canActivate: [GuestGuard] },
    {
        path: 'admin',
        canActivate: [AuthGuard],
        component: AdminComponent,
        // canActivateChild: [AuthGuard],
        data: { role: 'Admin' },
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'dashboard/add-new-question', component: AddNewQuestionComponent },
            { path: 'students', component: StudentsComponent },
            { path: 'subjects', component: SubjectsComponent },
            { path: 'subjects/:subjectId', component: SubjectComponent },
            { path: 'subjects/:subjectId/exams/:examId/questions', component: ExamQuestionsComponent },
            { path: 'exams', component: ExamsComponent },
            { path: 'exams/:examId/questions', component: QuestionsComponent },
            { path: 'exams/:examId/questions/AddQuestion', component: AddQuestionToExamComponent },
            { path: 'notifications', component: NotificationComponent },

            { path: 'profile', component: ProfileComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    },
    {
        path: 'student',
        canActivate: [AuthGuard],
        component: StudentComponent,
        // canActivateChild: [AuthGuard],
        data: { role: 'Student' },
        children: [
            { path: 'exams', component: StudentExamsComponent },
            { path: 'history', component: HistoryComponent },
            { path: 'profile', component: StudentProfileComponent },

        ],
    },
    { path: 'exam/:examId', component: ExamComponent, canActivate: [AuthGuard], data: { role: 'Student' } },
    { path: 'dashboard', component: RoleRedirectComponent }, // Default route for role-based redirection
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // App's initial route
    { path: '**', redirectTo: '/dashboard' }, // Catch-all for unknown routes

];
