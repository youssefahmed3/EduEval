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
    public class SubjectController : ControllerBase
    {
        private readonly ISubjectRepository _subjectRepository;
        private readonly IMapper _mapper;
        public SubjectController(IMapper mapper ,ISubjectRepository subjectRepository)
        {
            _subjectRepository = subjectRepository;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet("Subjects")]
        public async Task<ActionResult> GetAllSubjects()
        {
            IEnumerable<Subject> subjects = await _subjectRepository.GetAllSubjects();
            if (subjects != null)
            {
                return Ok(subjects);
            }
            else
            {
                return BadRequest(subjects);
            }
        }

        [Authorize]
        [HttpGet("GetSubjectById/{subjectId}")]
        public async Task<ActionResult> GetSubjectById(int subjectId)
        {
            try
            {
                Subject subject = await _subjectRepository.GetSingleSubject(subjectId);
                return Ok(subject);
            }
            catch (Exception ex)
            {
                // Return only the exception message
                return BadRequest(new { error = ex.Message });
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("Subject")]
        public ActionResult CreateSubject(CreateSubjectDto subjectDto)
        {
            Subject subjectDb = _mapper.Map<Subject>(subjectDto);
            _subjectRepository.AddEntity<Subject>(subjectDb);

            if (_subjectRepository.SaveChanges())
            {
                return Ok("Subject Added Successfully");
            }
            throw new Exception("Error adding Subject");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("Subject")]
        public async Task<ActionResult> UpdateSubject(UpdateSubjectDto subjectDto)
        {
            Subject subjectDb = await _subjectRepository.GetSingleSubject(subjectDto.Id);
            if (subjectDb != null) {
                subjectDb.SubjectName = subjectDto.SubjectName;
                subjectDb.SubjectDescription = subjectDto.SubjectDescription;
                if(_subjectRepository.SaveChanges()) {
                    return Ok("Subject " + subjectDto.SubjectName + "Updated successfully");
                }
                else {
                    return BadRequest("Error Saving changes to " + subjectDto.SubjectName);
                }
            }
            throw new Exception("Error updating Subject");
        }

        // Do Nothing
        [Authorize(Roles = "Admin")]
        [HttpDelete("Subject/{subjectId}")]
        public async Task<ActionResult> DeleteSubjectById(int subjectId)
        {
            Subject? subjectDb = await _subjectRepository.GetSingleSubject(subjectId);
            if (subjectDb != null) {
                _subjectRepository.RemoveEntity<Subject>(subjectDb);
                if(_subjectRepository.SaveChanges()) {
                    return Ok("Subject with id " + subjectId + " deleted successfully");
                }
                else {
                    return BadRequest("Error deleting Subject with id " + subjectId);
                }
            }
            throw new Exception("No Subject with id " + subjectId);

        }


    }
}