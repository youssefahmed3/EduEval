
using Shared.Dtos;
using Domain.Models;

namespace Domain.Interfaces;

public interface IQuestionsRepository : IBaseRepository
{
    public Task<IEnumerable<QuestionLibrary>> GetAllQuestions();
    public Task<QuestionLibrary> GetSingleQuestion(int QuestionId);
    public Task<IEnumerable<QuestionLibrary>> GetQuestionsBySubjectId(int SubjectId);
    public Task AddQuestionWithChoices(QuestionLibrary questionLibrary);
}