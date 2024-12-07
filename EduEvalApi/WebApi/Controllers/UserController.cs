using Domain.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IStudentExamRepository _studentExamRepository;
        public UserController(IStudentExamRepository studentExamRepository)
        {
            _studentExamRepository = studentExamRepository;
        }

        [Authorize(Roles = "Student")]
        [HttpGet("{studentId}/history")]
        public async Task<IActionResult> GetStudentExamHistory(string studentId)
        {
            var userRole = User.IsInRole("Student");
            var currentUserId = User?.FindFirst("userId")!.ToString(); // Get user ID from JWT

            // Ensure students can only access their own history
            if (userRole && studentId != currentUserId)
            {
                return Forbid();
            }

            var examHistory = await _studentExamRepository.GetStudentExam(studentId);
            return Ok(examHistory);
        }
    }
}