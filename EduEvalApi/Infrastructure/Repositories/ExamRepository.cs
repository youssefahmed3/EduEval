using Shared.Dtos;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Infrastructure.Helpers;
using Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ExamRepository : IExamRepository
{

    private readonly IConfiguration _config;
    private readonly DataContextEF _entityFramework;

    public ExamRepository(IConfiguration config, DataContextEF entityFramwork)
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

    public async Task<IEnumerable<Exam>> GetAllExams()
    {

        IEnumerable<Exam> exams = await _entityFramework.Exams!.Include(s => s.Subject).Include(s => s.ExamQuestions).ThenInclude(eq => eq.QuestionsLibrary).ThenInclude(c => c.Choices).Include(s => s.StudentsExams).ToListAsync();

        if (exams != null)
        {
            return exams;
        }
        else
        {
            throw new Exception("No Exams found in the database.");
        }
    }

    public async Task<Exam> GetSingleExam(int ExamId)
    {
        Exam? exam =  await _entityFramework.Exams!.Where(e => e.Id == ExamId).Include(e => e.ExamQuestions).ThenInclude(eq => eq.QuestionsLibrary).ThenInclude(c => c.Choices).FirstOrDefaultAsync();

        if (exam != null)
        {
            return exam;
        }
        else
        {
            throw new Exception("No exam found in the database With This Id.");
        }
    }

    public async Task<IEnumerable<Exam>> GetExamsBySubjectId(int subjectId) {
        IEnumerable<Exam> examsWithSameSubject = await _entityFramework.Exams!.Where(e => e.SubjectId == subjectId).ToListAsync();

         if (examsWithSameSubject != null)
        {
            return examsWithSameSubject;
        }
        else
        {
            throw new Exception("No Exams found in this subject.");
        }
    }

    
}

