using Domain.Interfaces;

using Shared.Dtos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Models;
using Infrastructure.SignalRHubs;
using Microsoft.AspNetCore.SignalR;

namespace WebApi.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [Route("[controller]")]
    public class StudentExamsController : ControllerBase
    {
        private readonly IStudentExamRepository _studentExamRepository;
        private readonly IUserRepository _userRepository;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IExamRepository _examRepository;
        public StudentExamsController(IHubContext<NotificationHub> hubContext, IStudentExamRepository studentExamRepository, IExamRepository examRepository)
        {
            _studentExamRepository = studentExamRepository;
            _examRepository = examRepository;
            _hubContext = hubContext;
        }

        [Authorize(Roles = "Student")]
        [HttpGet("currentStudent/history")]
        public async Task<IActionResult> GetStudentExamHistory()
        {
            var userRole = User.IsInRole("Student");
            string currentUserId = User.FindFirst("userId")!.Value;

            // Ensure students can only access their own history
            /* if (userRole && studentId != currentUserId)
            {
                return Forbid();
            } */
            Console.WriteLine(currentUserId);
            var examHistory = await _studentExamRepository.GetStudentExam(currentUserId);
            return Ok(examHistory);
        }

        [Authorize(Roles = "Student")]
        [HttpGet("getAllStudentExams")]
        public async Task<IActionResult> GetAllStudentExams()
        {
            /*  var userRole = User.IsInRole("Student");
             var currentUserId = User?.FindFirst("userId")!.ToString(); // Get user ID from JWT */

            // Ensure students can only access their own history
            /* if (userRole && studentId != currentUserId)
            {
                return Forbid();
            } */

            var examHistory = await _studentExamRepository.GetAllStudentExams();
            return Ok(examHistory);
        }

        // 2. Get all students who took a specific exam (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpGet("{examId}/students")]
        public async Task<IActionResult> GetStudentsInExam(int examId)
        {
            var allStudents = await _studentExamRepository.GetAllStudentsTakenExam(examId);
            return Ok(allStudents);
        }

        [Authorize(Roles = "Student")]
        [HttpGet("EnterExam/{ExamId}")]
        public async Task<IActionResult> EnterExam(int examId)
        {
            var currentUserId = User?.FindFirst("userId")!.Value; // Get user ID from JWT
            Console.WriteLine("User ID" + currentUserId);
            // Ensure students can only access their own history
            if (currentUserId == null)
            {
                return Forbid();
            }

            var existingEntry = await _studentExamRepository.GetStudentByTakenExam(currentUserId, examId);
            if (existingEntry != null)
            {
                return BadRequest("You have already entered this exam.");
            }

            // Add the student to the exam
            var studentExam = new StudentExams
            {
                StudentId = currentUserId,
                ExamId = examId,
            };

            _studentExamRepository.AddEntity(studentExam);

            if (_studentExamRepository.SaveChanges())
            {
                return Ok("Successfully entered the exam.");
            }

            return StatusCode(500, "Could not enter the exam.");

        }

        [Authorize(Roles = "Student")]
        [HttpPost("SubmitExam/{examId}")]
        public async Task<IActionResult> SubmitExam(int examId, List<SubmitAnswerDto> answers)
        {
            // Get current user ID
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null)
            {
                return Forbid();
            }
            var currentUserId = userIdClaim.Value;

            // Check if the student has entered the exam
            var studentExam = await _studentExamRepository.GetStudentByTakenExam(currentUserId, examId);
            if (studentExam == null)
            {
                return BadRequest("You must enter the exam before submitting.");
            }

            // Ensure the student has not already submitted the exam
            if (studentExam.SubmittedAt != null)
            {
                return BadRequest("You already finished and submitted the exam!");
            }

            // Fetch the exam
            var exam = await _examRepository.GetSingleExam(examId);
            if (exam == null)
            {
                return NotFound("Exam not found.");
            }

            // Handle empty answers
            if (answers == null || answers.Count == 0)
            {
                return BadRequest("No answers submitted.");
            }

            // Evaluate the answers
            int score = 0;
            foreach (var answer in answers)
            {
                var question = exam.ExamQuestions.FirstOrDefault(q => q.QuestionId == answer.QuestionId);
                if (question == null) continue;

                var correctChoice = question.QuestionsLibrary.Choices.FirstOrDefault(c => c.IsCorrect);
                if (correctChoice != null && correctChoice.Id == answer.SelectedChoiceId)
                {
                    score++;
                }
            }

            int percentageScore = (int)((double)score / answers.Count * 100);

            // Save the result
            studentExam.Score = percentageScore;
            studentExam.SubmittedAt = DateTime.UtcNow.ToString();

            try
            {
                _studentExamRepository.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while saving the result: {ex.Message}");
            }

            // Log details
            Console.WriteLine($"Exam: {studentExam.Exam?.ExamTitle ?? "null"}");
            Console.WriteLine($"Student: {studentExam.Student?.FullName ?? "null"}");
            Console.WriteLine($"Score: {studentExam.Score}");

            // Send notification
            await _hubContext.Clients.All.SendAsync("ExamSubmittedByStudent", new
            {
                Message = $"{studentExam.Student?.FullName ?? "Unknown Student"} submitted the exam '{studentExam.Exam?.ExamTitle ?? "Unknown Exam"}' with a score of {percentageScore}%.",
                Status = "success"
            });

            return Ok(new { Score = score, TotalQuestions = exam.ExamQuestions.Count });
        }

    }
}