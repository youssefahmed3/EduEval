

namespace Domain.Models;

public class StudentExams {
    public required string StudentId { get; set; } // Foreign Key
    public required int ExamId { get; set; }
    public required int Score { get; set; }
    public required DateTime TakenAt { get; set; }
    
    public User Student { get; set; } // navigation property
    public Exam Exam { get; set; } // navigation property    
}