using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Domain.Models;

public class Exam {
    public required int Id { get; set; } // primary Key
    public required string ExamTitle { get; set; }
    public required double Duration { get; set; }
    public required double CreatedAt { get; set; }
    public required int SubjectId { get; set; } // foreign Key
    
    [JsonIgnore]
    public required Subject Subject { get; set; } // navigation property
    public List<StudentExams> StudentsExams { get; set; }
    public List<ExamQuestions> ExamQuestions { get; set; }
}