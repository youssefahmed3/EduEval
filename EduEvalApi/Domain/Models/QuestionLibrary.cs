

using System.Text.Json.Serialization;

namespace Domain.Models;

public class QuestionLibrary {
    public  int Id { get; set; } // primary Key
    public  string QuestionText { get; set; }
    public  string Difficulty { get; set; }
    public int SubjectId { get; set; }

    // public required string Type { get; set; }
    public  string CreatedAt { get; set; } = DateTime.Now.ToString();

    [JsonIgnore]
    public Subject Subject { get; set; }
    
    // [JsonIgnore]
    public List<QuestionChoices> Choices { get; set; } // Navigation property
    [JsonIgnore]

    public List<ExamQuestions> ExamQuestions { get; set; } = new List<ExamQuestions>();

}