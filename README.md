# EduEval

EduEval is a dynamic and comprehensive Exam System designed to facilitate seamless examination processes for students and administrators. The platform is built with modern technologies to ensure scalability, reliability, and a user-friendly experience.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Actors](#actors)
- [Core Functionality](#core-functionality)
- [Setup Instructions](#setup-instructions)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Features

### Admin Features:

- CRUD Operations: Manage all entities including:
  - Subjects
  - Exams
  - Exam Histories
  - Users
  - Questions
- **Question Management**: Questions serve as the core assets for creating exams. Admin can:
  - Add or remove questions tied to specific subjects.
  - Assign questions to exams.
- **Exam Management**: Admin can:
  - Create or delete exams.
  - Tie exams to specific subjects.
- **Role-Based Access Control**:
  - Secure system with roles assigned to users (e.g., Admin, Student).

### Student Features:

- **Exam Interaction**:
  - Enter and submit exams.
- **Exam History**:
  - View previously taken exams and results.

### Notifications:

- **Real-Time Notifications**:
  - Admin and students receive instant updates using SignalR for events like exam creation, updates, and submissions.

### Integration:

- **Seamless System Integration**:
  - Integrated backend and frontend workflows for a unified user experience.

---

## Tech Stack

### Frontend:

- **Angular**: Frontend framework for building a dynamic and responsive user interface.
- **DaisyUI**: Simplified Tailwind CSS components for rapid development.
- **Tailwind CSS**: Utility-first CSS framework for styling.

### Backend:

- **.NET**: Robust backend framework.
- **Identity Framework**: Authentication and authorization.
- **Entity Framework**: Object-relational mapping (ORM) for database management.
- **SQL**: Relational database for storing system data.
- **SignalR**: Real-time communication library for notifications.

---

## Actors

1. **Student**:

   - Enters and submits exams.
   - Views exam history.

2. **Admin**:

   - Performs CRUD operations on all models.
   - Manages subjects, exams, and questions.

---

## Core Functionality

EduEval is a Question-Based Exam System. Here are the core relationships and workflows:

- **Questions**:
  - Tied to a specific subject.
  - Serve as the foundational asset for creating exams.
- **Subjects**:
  - Each subject can have multiple questions and exams associated with it.
- **Exams**:
  - Tied to a specific subject.
  - Composed of selected questions from the question pool.
- **Exam History**:
  - Stores records of exams taken by students.
- **Notifications**:
  - Real-time updates using SignalR to notify students and admins of important actions.
- **Role-Based Access Control**:
  - Ensures secure and role-specific access to system features.

---

## Setup Instructions

### Prerequisites

1. **Frontend**:
   - Install Node.js and Angular CLI.
2. **Backend**:
   - Install .NET SDK.
   - Set up SQL Server.

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/EduEval.git
   cd EduEval
   ```

2. **Frontend Setup**:

   ```bash
   cd frontend
   npm install
   ng serve
   ```

3. **Backend Setup**:

   - Navigate to the backend directory.
   - Restore .NET dependencies:
     ```bash
     dotnet restore
     ```
   - Update the `appsettings.json` file with your SQL Server connection string.
   - Run the backend server:
     ```bash
     dotnet run
     ```

4. **Database Migration**:

   ```bash
   dotnet ef database update
   ```

5. **Access the Application**:

   - Frontend: `http://localhost:4200`
   - Backend API: `http://localhost:5000`

---

## Future Enhancements

- Integration of advanced reporting and analytics for admin.
- Role-based access control for enhanced security.
- Support for timed exams with real-time countdown.
- Email notifications for exam schedules and results.
- Multi-language support for a global audience.

---

## License

This project is licensed under the [MIT License](LICENSE).

