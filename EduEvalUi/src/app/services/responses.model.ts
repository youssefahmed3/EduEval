// Define Choice type
export interface Choice {
    id: number;
    questionId: number;
    choiceText: string;
    isCorrect: boolean;
}

export interface AddChoice {
    choiceText: string;
    isCorrect: boolean;
}

// Define QuestionLibrary type
export interface QuestionLibrary {
    id: number;
    questionText: string;
    difficulty: string;
    subjectId: number;
    createdAt: string; // Adjust if you want to use Date instead of string
    choices: Choice[];
}

export interface AddQuestionLibrary {
    questionText: string;
    difficulty: string;
    subjectId: number;
    choices: AddChoice[];
}

// Define ExamQuestions type
export interface ExamQuestions {
    examId: number;
    questionId: number;
    questionsLibrary: QuestionLibrary;
}


export interface AddSubject {
    subjectName: string;
    subjectDescription: string;
}

// Define Subject type
export interface Subject {
    id: number;
    subjectName: string;
    subjectDescription: string;
    questions: QuestionLibrary[];
    exams: Exam[];
}



// Define Exam type
export interface Exam {
    id: number;
    examTitle: string;
    duration: number;
    createdAt: string; // Adjust if you want to use Date instead of string
    subjectId: number;
    examQuestions: ExamQuestions[];
    studentsExams: StudentExams[];
    subject: Subject;
}

export interface CreateExam {
    examTitle: string;
    duration: number;
    subjectId: number;
}


export interface StudentExams {
    // Define the structure for StudentExams (you can customize this based on your actual structure)
    examId: number;
    exam: Exam;
    studentId: number;
    student: User;
    score: number;
    submittedAt: string;
    takenAt: string;
    // Add any other fields relevant to StudentExams
}



export interface User {
    id: string; // IdentityUser typically has an `id` field
    email: string; // Assuming `IdentityUser` includes an email
    userName: string; // Assuming `IdentityUser` includes a userName
    firstName?: string;
    lastName?: string;
    role?: string;
    isActive: boolean;
    fullName: string; // Derived property like in your class
    averageScore: number;
    // Relationship to StudentExams
    studentsExams: StudentExams[];
}

export interface UserEdit {

    email: string; // Assuming `IdentityUser` includes an email
    userName: string; // Assuming `IdentityUser` includes a userName
    firstName?: string;
    lastName?: string;

}


export interface AllExamsPaginated {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalExams: number;
    exams: Exam[];
}

export interface AllSubjectsPaginated {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalSubjects: number;
    subjects: Subject[];
}

export interface AllStudentsPagintated {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalSubjects: number;
    students: User[];
}

export interface AllExamsWithSameSubject {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalexams: number;
    exams: Exam[];
}

export interface AllExamQuestionsPaginated {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalexams: number;
    questions: ExamQuestions[];
}