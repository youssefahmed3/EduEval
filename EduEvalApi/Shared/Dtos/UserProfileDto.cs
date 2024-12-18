namespace Shared.Dtos;

public class UserProfileDto {
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? Role { get; set; }
    public bool IsActive { get; set; }
    public string FullName => FirstName + " " + LastName;

    // public List<StudentExamsDto>? StudentExams { get; set; }

}