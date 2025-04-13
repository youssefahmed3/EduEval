using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Domain.Models;

public class Exam
{
    public int Id { get; set; } // primary Key
    public string ExamTitle { get; set; }
    public double Duration { get; set; }
    public DateTime CreatedAt { get; set; }
    public int SubjectId { get; set; } // foreign Key

    // [JsonIgnore]
    public List<ExamQuestions> ExamQuestions { get; set; }
    
    // [JsonIgnore]
    public Subject Subject { get; set; } // navigation property
    // [JsonIgnore]
    public List<StudentExams> StudentsExams { get; set; }
}