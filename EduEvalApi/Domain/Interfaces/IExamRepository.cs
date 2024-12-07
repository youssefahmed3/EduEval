
using Shared.Dtos;
using Domain.Models;

namespace Domain.Interfaces;

public interface IExamRepository : IBaseRepository
{
    public Task<IEnumerable<Exam>> GetAllExams();
    public Task<Exam> GetSingleExam(int ExamId);
    public Task<IEnumerable<Exam>> GetExamsBySubjectId(int subjectId);
}