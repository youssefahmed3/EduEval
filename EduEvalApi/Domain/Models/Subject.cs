namespace Domain.Models;

public class Subject {
    public required int Id { get; set; } // primary Key
    public required string SubjectName { get; set; }
    public required string SubjectDescription { get; set; }
    public List<Exam> Exams { get; set; }
    public List<QuestionLibrary> Questions { get; set; }
}