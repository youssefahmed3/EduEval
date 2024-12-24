using Shared.Dtos;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Infrastructure.Helpers;
using Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class SubjectRepository : ISubjectRepository
{

    private readonly IConfiguration _config;
    private readonly DataContextEF _entityFramework;

    public SubjectRepository(IConfiguration config, DataContextEF entityFramwork)
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

    public async Task<IEnumerable<Subject>> GetAllSubjects()
    {

        IEnumerable<Subject> subjects = await _entityFramework.Subjects!.Include(s => s.Exams).Include(s => s.Questions).ToListAsync();

        if (subjects != null)
        {
            return subjects;
        }
        else
        {
            throw new Exception("No subjects found in the database.");
        }
    }

    public async Task<Subject> GetSingleSubject(int subjectId)
    {
        Subject? subject = await _entityFramework.Subjects!.Include(s => s.Exams).Where(s => s.Id == subjectId).FirstOrDefaultAsync();

        if (subject != null)
        {
            return subject;
        }
        else
        {
            throw new Exception("No subject found in the database With This Id.");
        }
    }

    public async Task<IEnumerable<Subject>> GetPaginatedSubjects(int pageNumber, int pageSize)
    {
        return await
            _entityFramework
            .Subjects!
            .Include(s => s.Exams)
            .Include(s => s.Questions)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
    public async Task<int> GetTotalSubjectsCount()
    {
        return await _entityFramework.Subjects!.CountAsync();
    }

}


