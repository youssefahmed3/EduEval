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
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionsRepository _questionsLibraryRepository;
        private readonly IMapper _mapper;
        public QuestionsController(IMapper mapper,  IQuestionsRepository questionsRepository)
        {
            _mapper = mapper;
            _questionsLibraryRepository = questionsRepository;
        }

        [Authorize]
        [HttpGet("Questions")]
        public async Task<ActionResult> GetAllQuestions()
        {
            IEnumerable<QuestionLibrary> questions = await _questionsLibraryRepository.GetAllQuestions();
            if (questions != null)
            {
                return Ok(questions);
            }
            else
            {
                return BadRequest(questions);
            }
        }

        [Authorize]
        [HttpGet("GetQuestionById/{questionId}")]
        public async Task<ActionResult<QuestionLibrary>> GetQuestionById(int questionId)
        {
            QuestionLibrary allQuestions = await _questionsLibraryRepository.GetSingleQuestion(questionId);

            if (allQuestions != null)
            {
                return Ok(allQuestions);
            }
            else
            {
                return BadRequest(allQuestions);
            }

        }
        [Authorize]
        [HttpGet("GetQuestionsBySubjectId/{subjectId}")]
        public async Task<IEnumerable<QuestionLibrary>> GetQuestionsBySubjectId(int subjectId)
        {
            IEnumerable<QuestionLibrary> QuestionsBySameSubject = await _questionsLibraryRepository.GetQuestionsBySubjectId(subjectId);

            if (QuestionsBySameSubject != null)
            {
                return QuestionsBySameSubject;
            }
            else
            {
                throw new Exception("No Questions found in this Subject.");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("Question")]
        public async Task<ActionResult> CreateQuestion(CreateQuestionDto questionToCreate)
        {
            QuestionLibrary questionDb = _mapper.Map<QuestionLibrary>(questionToCreate);
            // _questionsLibraryRepository.AddEntity<QuestionLibrary>(questionDb);

            await _questionsLibraryRepository.AddQuestionWithChoices(questionDb);

            if (_questionsLibraryRepository.SaveChanges())
            {
                return Ok("Question Created Successfully");
            }
            throw new Exception("Error Creating Question");
        }

        

/* 
        [Authorize(Roles = "Admin")]
        [HttpPut("Question")]
        public async Task<ActionResult> UpdateExamById(QuestionLibrary updatedExam)
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
                        return Ok("Question Added To " + examId + "Succesfully");
                    }
                    return BadRequest("Error Adding Question To " + examId);

                }

                return BadRequest("Question Not Found");
            }
            return BadRequest("Exam Not Found");

        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{examId}/DeleteQuestion/{questionId}")]
        public async Task<ActionResult> DeleteQuestionToExam(int examId, int questionId)
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
                    if(examDb.ExamQuestions.Contains(examQuestion)) {

                        examDb.ExamQuestions.Remove(examQuestion);

                        if (_examRepository.SaveChanges())
                        {
                            return Ok("Question Added To " + examId + "Succesfully");
                        }
                        return BadRequest("Error Adding Question To " + examId);
                    }
                    
                    return BadRequest("Question Does not belong To The Exam");

                }

                return BadRequest("Question Not Found");
            }
            return BadRequest("Exam Not Found");

        }
     */
    
    }
}