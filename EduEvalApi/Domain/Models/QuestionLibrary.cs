

namespace Domain.Models;

public class QuestionLibrary {
    public required int Id { get; set; } // primary Key
    public required string QuestionText { get; set; }
    public required string Difficulty { get; set; }
    public int SubjectId { get; set; }

    // public required string Type { get; set; }
    public required string CreatedAt { get; set; }
    public required Subject Subject { get; set; }
    
    public List<QuestionChoices> Choices { get; set; } // Navigation property

    public List<ExamQuestions> ExamQuestions { get; set; }

}