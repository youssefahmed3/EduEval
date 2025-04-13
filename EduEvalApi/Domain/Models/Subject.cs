using System.Text.Json.Serialization;

namespace Domain.Models;

public class Subject {
    public  int Id { get; set; } // primary Key
    public  string SubjectName { get; set; }
    public  string SubjectDescription { get; set; }
    // [JsonIgnore]
    public List<Exam> Exams { get; set; }
    public List<QuestionLibrary> Questions { get; set; }
}