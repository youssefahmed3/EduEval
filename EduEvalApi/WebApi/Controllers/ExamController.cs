using Shared.Dtos;
using AutoMapper;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace WebApi.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [Route("[controller]")]
    public class ExamController : ControllerBase
    {
        private readonly IExamRepository _examRepository;
        private readonly IQuestionsRepository _questionsLibraryRepository;
        private readonly IMapper _mapper;
        public ExamController(IMapper mapper, IExamRepository examRepository, IQuestionsRepository questionsRepository)
        {
            _examRepository = examRepository;
            _mapper = mapper;
            _questionsLibraryRepository = questionsRepository;
        }

        [Authorize]
        [HttpGet("Exams")]
        public async Task<ActionResult> GetAllExams()
        {
            IEnumerable<Exam> exams = await _examRepository.GetAllExams();
            if (exams != null)
            {
                return Ok(exams);
            }
            else
            {
                return BadRequest(exams);
            }
        }

        [Authorize]
        [HttpGet("GetExamsBySubjectId/{subjectId}")]
        public async Task<ActionResult<IEnumerable<Exam>>> GetExamsBySubjectId(int subjectId)
        {
            IEnumerable<Exam> examsWithSameSubject = await _examRepository.GetExamsBySubjectId(subjectId);

            if (examsWithSameSubject != null)
            {
                return Ok(examsWithSameSubject);
            }
            else
            {
                return BadRequest(examsWithSameSubject);
            }

        }

        [Authorize]
        [HttpGet("GetExamQuestions/{examId}")]
        public async Task<IEnumerable<ExamQuestions>> GetExamQuestions(int examId)
        {
            Exam? Exam = await _examRepository.GetSingleExam(examId);

            if (Exam != null)
            {
                return Exam.ExamQuestions ?? [];
            }
            else
            {
                throw new Exception("No Questions found in this Exam.");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("Exam")]
        public async Task<ActionResult> CreateExam(ExamToCreateDto examToCreate)
        {
            Exam examDb = _mapper.Map<Exam>(examToCreate);
            _examRepository.AddEntity<Exam>(examDb);

            if (_examRepository.SaveChanges())
            {
                return Ok("Exam Added Successfully");
            }
            throw new Exception("Error adding Exam");
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("Exam")]
        public async Task<ActionResult> UpdateExamById(UpdateExamDto updatedExam)
        {
            Exam examDb = await _examRepository.GetSingleExam(updatedExam.Id);
            if (examDb != null)
            {
                examDb.ExamTitle = updatedExam.ExamTitle;
                examDb.Duration = updatedExam.Duration;
                if (_examRepository.SaveChanges())
                {
                    return Ok("Subject " + updatedExam.ExamTitle + "Updated successfully");
                }
                else
                {
                    return BadRequest("Error Saving changes to " + updatedExam.ExamTitle);
                }
            }
            throw new Exception("Error updating Exam");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("Exam/{examId}")]
        public async Task<ActionResult> DeleteExamById(int examId)
        {
            Exam? examDb = await _examRepository.GetSingleExam(examId);
            if (examDb != null)
            {
                _examRepository.RemoveEntity<Exam>(examDb);
                if (_examRepository.SaveChanges())
                {
                    return Ok("Exam with id " + examDb + " deleted successfully");
                }
                else
                {
                    return BadRequest("Error deleting Exam with id " + examId);
                }
            }
            throw new Exception("No Exam with id " + examId);
        }


        // Question Related Functions 
        [Authorize(Roles = "Admin")]
        [HttpPost("{examId}/AddQuestion/{questionId}")]
        public async Task<ActionResult> AddQuestionToExam(int examId, int questionId)
        {
            Exam? examDb = await _examRepository.GetSingleExam(examId);
            if (examDb != null)
            {
                QuestionLibrary? questionDb = await _questionsLibraryRepository.GetSingleQuestion(questionId);

                if (questionDb != null)
                {
                    var examQuestion = new ExamQuestions
                    {
                        ExamId = examId,
                        QuestionId = questionId
                    };

                    examDb.ExamQuestions.Add(examQuestion);

                    if (_examRepository.SaveChanges())
                    {
                        return Ok("Question Added To " + examDb.ExamTitle + " Succesfully");
                    }
                    return BadRequest("Error Adding Question To " + examId);

                }

                return BadRequest("Question Not Found");
            }
            return BadRequest("Exam Not Found");

        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{examId}/DeleteQuestion/{questionId}")]
        public async Task<ActionResult> DeleteQuestionToExam(int examId, int questionId)
        {
            Exam? examDb = await _examRepository.GetSingleExam(examId);
            if (examDb.ExamQuestions.Any(eq => eq.ExamId == examId && eq.QuestionId == questionId))
            {
                var questionToRemove = examDb.ExamQuestions
                                             .FirstOrDefault(eq => eq.ExamId == examId && eq.QuestionId == questionId);

                if (questionToRemove != null)
                {
                    examDb.ExamQuestions.Remove(questionToRemove);

                    if (_examRepository.SaveChanges())
                    {
                        return Ok($"Question removed from exam {examId} successfully.");
                    }
                    return BadRequest($"Error removing question from exam {examId}.");
                }
            }
            return BadRequest("Question does not belong to the exam.");

        }



        [Authorize]
        [HttpGet("GetSingleExam/{examId}")]
        public async Task<ActionResult<Exam>> GetSingleExam(int examId)
        {
            Exam exam = await _examRepository.GetSingleExam(examId);

            if (exam != null)
            {
                return Ok(exam);
            }
            else
            {
                return BadRequest(exam);
            }

        }


        [Authorize]
        [HttpGet("Exam/PaginatedExams")]
        public async Task<ActionResult> GetPaginatedExams(int pageNumber = 1, int pageSize = 10)
        {
            if (pageNumber < 1 || pageSize < 1)
            {
                return BadRequest("Page number and page size must be greater than 0.");
            }

            // Get the total count of exams from the repository or database
            int totalExams = await _examRepository.GetTotalExamsCount();

            // Calculate the total pages
            int totalPages = (int)Math.Ceiling((double)totalExams / pageSize);

            // Ensure the requested page number is within valid bounds
            if (pageNumber > totalPages && totalPages > 0)
            {
                return BadRequest("Page number exceeds the total pages.");
            }

            // Get paginated exams for the current page
            IEnumerable<Exam> exams = await _examRepository.GetPaginatedExams(pageNumber, pageSize);

            // Build the response with pagination metadata
            var response = new
            {
                currentPage = pageNumber,
                totalPages = totalPages,
                pageSize = pageSize,
                totalExams = totalExams,
                exams = exams
            };

            // Return response
            if (exams.Any())
            {
                return Ok(response);
            }
            else
            {
                return NotFound("No exams found for the given page.");
            }
        }

        [Authorize]
        [HttpGet("GetPaginatedExamsBySubjectId/{subjectId}")]
        public async Task<ActionResult<IEnumerable<Exam>>> GetPaginatedExamsBySubjectId(int subjectId, int pageNumber = 1, int pageSize = 10)
        {
            if (pageNumber < 1 || pageSize < 1)
            {
                return BadRequest("Page number and page size must be greater than 0.");
            }

            // Get the total count of exams from the repository or database
            int totalExamsWithSameSubject = await _examRepository.GetTotalExamsWithSameSubjectCount(subjectId);

            // Calculate the total pages
            int totalPages = (int)Math.Ceiling((double)totalExamsWithSameSubject / pageSize);

            // Ensure the requested page number is within valid bounds
            if (pageNumber > totalPages && totalPages > 0)
            {
                return BadRequest("Page number exceeds the total pages.");
            }

            // Get paginated exams for the current page
            IEnumerable<Exam> examsWithSameSubject = await _examRepository.GetPaginatedExamsBySubjectId(pageNumber, pageSize, subjectId);

            // Build the response with pagination metadata
            var response = new
            {
                currentPage = pageNumber,
                totalPages = totalPages,
                pageSize = pageSize,
                totalExams = totalExamsWithSameSubject,
                exams = examsWithSameSubject
            };

            // Return response
            if (examsWithSameSubject.Any())
            {
                return Ok(response);
            }
            else
            {
                return NotFound("No exams found With the same subject for the given page.");
            }
        }

        [Authorize]
        [HttpGet("GetPaginatedExamQuestions/{examId}")]
        public async Task<ActionResult<IEnumerable<ExamQuestions>>> GetPaginatedExamQuestions(int examId, int pageNumber = 1, int pageSize = 10)
        {
            if (pageNumber < 1 || pageSize < 1)
            {
                return BadRequest("Page number and page size must be greater than 0.");
            }

            // Get the total count of exams from the repository or database
            int totalQuestionInExam = await _examRepository.GetTotalQuestionsInExamCount(examId);

            // Calculate the total pages
            int totalPages = (int)Math.Ceiling((double)totalQuestionInExam / pageSize);

            // Ensure the requested page number is within valid bounds
            if (pageNumber > totalPages && totalPages > 0)
            {
                return BadRequest("Page number exceeds the total pages.");
            }

            // Get paginated exams for the current page
            IEnumerable<ExamQuestions> ExamQuestions = await _examRepository.GetPaginatedExamQuestions(pageNumber, pageSize, examId);

            // Build the response with pagination metadata
            var response = new
            {
                currentPage = pageNumber,
                totalPages = totalPages,
                pageSize = pageSize,
                totalQuestions = totalQuestionInExam,
                Questions = ExamQuestions
            };

            // Return response
            if (ExamQuestions.Any())
            {
                return Ok(response);
            }
            else
            {
                return NotFound("No exams found With the same subject for the given page.");
            }
        }


    }
}