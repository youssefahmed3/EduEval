using AutoMapper;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;

namespace WebApi.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IStudentExamRepository _studentExamRepository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        public UserController(IStudentExamRepository studentExamRepository, IUserRepository userRepository, IMapper mapper)
        {
            _studentExamRepository = studentExamRepository;
            _userRepository = userRepository;
            _mapper = mapper;
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

        [Authorize(Roles = "Admin")]
        [HttpGet("Students")]
        public async Task<IActionResult> GetAllStudents()
        {
            IEnumerable<User> allStudents = await _userRepository.GetAllStudents();
            return Ok(allStudents);
        }

        [Authorize(Roles = "Student")]
        [HttpGet("Student/profile")]
        public async Task<IActionResult> GetCurrentStudentProfile()
        {
            string currentUserId = User.FindFirst("userId")!.Value;
            if (currentUserId == null)
            {
                return Forbid();
            }
            User student = await _userRepository.GetSingleStudent(currentUserId);
            UserProfileDto studentAfterMapping = _mapper.Map<UserProfileDto>(student);
            return Ok(studentAfterMapping);
        }
    }
}