public class UpdateExamDto
{
    public int Id { get; set; } // primary Key
    public string ExamTitle { get; set; }
    public double Duration { get; set; }
    public int SubjectId { get; set; } // foreign Key
}