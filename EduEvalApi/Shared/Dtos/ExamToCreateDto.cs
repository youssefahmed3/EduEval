using System.Text.Json.Serialization;
// using Microsoft.AspNetCore.Identity;
namespace Shared.Dtos;

public class ExamToCreateDto
{
    public required string ExamTitle { get; set; }
    public required double Duration { get; set; } // in Minutes
    // public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public required int SubjectId { get; set; } // foreign Key

}