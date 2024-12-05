

namespace Domain.Models;

public class ExamQuestions {
    public required int ExamId { get; set; }
    public required int QuestionId { get; set; }
    
    public QuestionLibrary QuestionsLibrary { get; set; } // navigation property
    public Exam Exam { get; set; } // navigation property    
}