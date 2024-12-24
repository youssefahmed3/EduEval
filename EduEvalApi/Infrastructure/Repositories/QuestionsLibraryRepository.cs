using Shared.Dtos;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Infrastructure.Helpers;
using Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class QuestionsLibraryRepository : IQuestionsRepository
{

    private readonly IConfiguration _config;
    private readonly DataContextEF _entityFramework;

    public QuestionsLibraryRepository(IConfiguration config, DataContextEF entityFramwork)
    {
        _entityFramework = entityFramwork;
        _config = config;
    }

    public void AddEntity<T>(T entityToAdd)
    {
        if (entityToAdd != null)
        {
            _entityFramework.Add(entityToAdd);
        }
    }

    public void RemoveEntity<T>(T entityToRemove)
    {
        if (entityToRemove != null)
        {
            _entityFramework.Remove(entityToRemove);
        }
    }

    public bool SaveChanges()
    {
        return _entityFramework.SaveChanges() > 0;
    }

    public async Task<IEnumerable<QuestionLibrary>> GetAllQuestions()
    {

        IEnumerable<QuestionLibrary> Questions = await _entityFramework.QuestionsLibrary!.Include(s => s.Subject).Include(s => s.Choices).ToListAsync();

        if (Questions != null)
        {
            return Questions;
        }
        else
        {
            throw new Exception("No Questions found in the database.");
        }
    }

    public async Task<QuestionLibrary> GetSingleQuestion(int questionId)
    {
        QuestionLibrary? Question = await _entityFramework.QuestionsLibrary!.Where(s => s.Id == questionId).Include(s => s.Subject).Include(s => s.Choices).FirstOrDefaultAsync();

        if (Question != null)
        {
            return Question;
        }
        else
        {
            throw new Exception("No Question found in the database With This Id.");
        }
    }

    public async Task<IEnumerable<QuestionLibrary>> GetQuestionsBySubjectId(int SubjectId)
    {
        IEnumerable<QuestionLibrary> Question = await _entityFramework.QuestionsLibrary!.Where(s => s.SubjectId == SubjectId).Include(s => s.Subject).Include(s => s.Choices).ToListAsync();

        if (Question != null)
        {
            return Question;
        }
        else
        {
            throw new Exception("No Question found in the database With This Id.");
        }
    }

    public async Task AddQuestionWithChoices(QuestionLibrary questionLibrary)
    {
        if (questionLibrary != null)
        {
            await _entityFramework.QuestionsLibrary!.AddAsync(questionLibrary);
        }

    }

    /* public async Task<IEnumerable<QuestionLibrary>> GetPaginatedQuestions(int pageNumber, int pageSize)
    {
        return await _entityFramework.QuestionsLibrary!
            .Include(s => s.Subject)
            .Include(s => s.Choices)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    } */
}


