
using Shared.Dtos;
using Domain.Models;

namespace Domain.Interfaces;

public interface IStudentExamRepository : IBaseRepository
{
    public Task<IEnumerable<StudentExams>> GetAllStudentExams();
    public Task<IEnumerable<StudentExams>> GetStudentExam(string studentId);
    public Task<StudentExams> GetStudentByTakenExam(string studentId, int examId);
    public Task<IEnumerable<StudentExams>> GetAllStudentsTakenExam(int examId);
    // public Task AddQuestionWithChoices(QuestionLibrary questionLibrary);
}