using Microsoft.AspNetCore.Identity;

namespace Domain.Models;

public class User : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Role { get; set; }
    public bool IsActive { get; set; }
    public string FullName => FirstName + " " + LastName;

    public List<StudentExams> StudentsExams { get; set; }

}