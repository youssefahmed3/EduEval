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
        Exam? exam = await _entityFramework.Exams!.Where(e => e.Id == ExamId).Include(e => e.Subject).Include(e => e.ExamQuestions).ThenInclude(eq => eq.QuestionsLibrary).ThenInclude(c => c.Choices).FirstOrDefaultAsync();

        if (exam != null)
        {
            return exam;
        }
        else
        {
            throw new Exception("No exam found in the database With This Id.");
        }
    }

    public async Task<IEnumerable<Exam>> GetExamsBySubjectId(int subjectId)
    {
        IEnumerable<Exam> examsWithSameSubject = await _entityFramework.Exams!
        .Where(e => e.SubjectId == subjectId)
        .Include(e => e.Subject) // Include Subject navigation property
        .Include(e => e.ExamQuestions)
            .ThenInclude(eq => eq.QuestionsLibrary)
                .ThenInclude(q => q.Choices) // Include nested Choices in QuestionsLibrary
        .Include(e => e.StudentsExams) // Include StudentsExams navigation
            .ThenInclude(se => se.Student) // Include Students in StudentsExams
        .ToListAsync();

        if (examsWithSameSubject != null)
        {
            return examsWithSameSubject;
        }
        else
        {
            throw new Exception("No Exams found in this subject.");
        }
    }

    public async Task<IEnumerable<Exam>> GetPaginatedExamsBySubjectId(int pageNumber, int pageSize, int subjectId)
    {
        return await _entityFramework
            .Exams!
            .Where(e => e.SubjectId == subjectId)
            .Include(s => s.Subject)
            .Include(s => s.ExamQuestions)
                .ThenInclude(eq => eq.QuestionsLibrary)
                .ThenInclude(c => c.Choices)
            .Include(s => s.StudentsExams)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Exam>> GetPaginatedExams(int pageNumber, int pageSize)
    {
        return await _entityFramework
            .Exams!
            .Include(s => s.Subject)
            .Include(s => s.ExamQuestions)
                .ThenInclude(eq => eq.QuestionsLibrary)
                .ThenInclude(c => c.Choices)
            .Include(s => s.StudentsExams)  
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<ExamQuestions>> GetPaginatedExamQuestions(int pageNumber, int pageSize, int examId)
    {
        Exam exam = await _entityFramework
            .Exams!
            .Where(e => e.Id == examId)
            .Include(s => s.Subject)
            .Include(s => s.ExamQuestions)
                .ThenInclude(eq => eq.QuestionsLibrary)
                .ThenInclude(c => c.Choices)
            .Include(s => s.StudentsExams)
            .FirstOrDefaultAsync();

        return exam!.ExamQuestions.Skip((pageNumber - 1) * pageSize)
            .Take(pageSize);
    }
    public async Task<int> GetTotalExamsCount()
    {
        return await _entityFramework.Exams!.CountAsync();
    }
    public async Task<int> GetTotalExamsWithSameSubjectCount(int subjectId)
    {
        return await _entityFramework.Exams!.Where(e => e.SubjectId == subjectId).CountAsync();
    }

    public async Task<int> GetTotalQuestionsInExamCount(int examId)
    {
        Exam exam = await _entityFramework.Exams!.Where(e => e.Id == examId).Include(e => e.Subject).Include(e => e.ExamQuestions).ThenInclude(eq => eq.QuestionsLibrary).ThenInclude(c => c.Choices).FirstOrDefaultAsync();
        return exam!.ExamQuestions.Count();
    }
}

