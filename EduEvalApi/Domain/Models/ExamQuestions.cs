

using System.Text.Json.Serialization;

namespace Domain.Models;

public class ExamQuestions {
    public required int ExamId { get; set; }
    public required int QuestionId { get; set; }
    
    public QuestionLibrary QuestionsLibrary { get; set; } // navigation property
    [JsonIgnore]
    public Exam Exam { get; set; } // navigation property    
}