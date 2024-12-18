using System.Security.Claims;
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

        /*  [Authorize(Roles = "Student")]
         [HttpGet("Student")]
         public async Task<IActionResult> GetAllStudents()
         {
             IEnumerable<User> allStudents = await _userRepository.GetAllStudents();
             return Ok(allStudents);
         }
  */
        [Authorize(Roles = "Student, Admin")]
        [HttpGet("User/profile")]
        public async Task<IActionResult> GetCurrentUserProfile()
        {
            string currentUserId = User.FindFirst("userId")!.Value;
            string? currentRole = User.FindFirst(ClaimTypes.Role)?.Value;
            Console.WriteLine("asddddddddd" + currentRole);
            if (currentUserId == null)
            {
                return Forbid();
            }

            if (currentRole == "Admin")
            {
                User admin = await _userRepository.GetSingleAdmin(currentUserId);
                UserProfileDto adminAfterMapping = _mapper.Map<UserProfileDto>(admin);
                return Ok(adminAfterMapping);

            }


            User student = await _userRepository.GetSingleStudent(currentUserId);
            UserProfileDto studentAfterMapping = _mapper.Map<UserProfileDto>(student);

            return Ok(studentAfterMapping);
        }

        [Authorize(Roles = "Admin, Student")]
        [HttpPut("EditProfile")]
        public async Task<IActionResult> EditProfile(UserProfileDto userProfileDto)
        {
            string currentUserId = User.FindFirst("userId")!.Value;
            string? currentRole = User.FindFirst(ClaimTypes.Role)?.Value;
            // User User;
            if (currentRole == "Admin")
            {
                User currentAdmin = await _userRepository.GetSingleAdmin(currentUserId);
                if (currentAdmin != null)
                {
                    currentAdmin.FirstName = userProfileDto.FirstName;
                    currentAdmin.LastName = userProfileDto.LastName;
                    currentAdmin.UserName = userProfileDto.UserName;
                    currentAdmin.Email = userProfileDto.Email;
                    if (_userRepository.SaveChanges())
                    {
                        return Ok("User " + currentAdmin.FirstName + "Updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error Saving changes to " + currentAdmin.FirstName);
                    }
                }
                throw new Exception("Error updating User");
            }
            if (currentRole == "Student")
            {
                User currentStudent = await _userRepository.GetSingleStudent(currentUserId);

                if (currentStudent != null)
                {
                    currentStudent.FirstName = userProfileDto.FirstName;
                    currentStudent.LastName = userProfileDto.LastName;
                    currentStudent.UserName = userProfileDto.UserName;
                    currentStudent.Email = userProfileDto.Email;
                    if (_userRepository.SaveChanges())
                    {
                        return Ok("User " + currentStudent.FirstName + "Updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error Saving changes to " + currentStudent.FirstName);
                    }
                }
                throw new Exception("Error updating User");
            }
            throw new Exception("Error Finding User");

        }
    }
}