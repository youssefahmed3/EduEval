

namespace Domain.Models;

public class StudentExams
{
    public string StudentId { get; set; } // Foreign Key
    public int ExamId { get; set; }
    public int Score { get; set; }
    public string TakenAt { get; set; } = DateTime.UtcNow.ToString();
    public string? SubmittedAt { get; set; }
    public User Student { get; set; } // navigation property
    public Exam Exam { get; set; } // navigation property    
}