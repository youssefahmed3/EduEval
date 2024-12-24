
using Shared.Dtos;
using Domain.Models;

namespace Domain.Interfaces;

public interface IExamRepository : IBaseRepository
{
    public Task<IEnumerable<Exam>> GetAllExams();
    public Task<Exam> GetSingleExam(int ExamId);
    public Task<IEnumerable<Exam>> GetExamsBySubjectId(int subjectId);
    public Task<IEnumerable<Exam>> GetPaginatedExams(int pageNumber, int pageSize);
    public Task<IEnumerable<Exam>> GetPaginatedExamsBySubjectId(int pageNumber, int pageSize, int subjectId);
    public Task<IEnumerable<ExamQuestions>> GetPaginatedExamQuestions(int pageNumber, int pageSize, int examId);
    public Task<int> GetTotalQuestionsInExamCount(int examId);
    public Task<int> GetTotalExamsCount();
    public Task<int> GetTotalExamsWithSameSubjectCount(int subjectId);


}