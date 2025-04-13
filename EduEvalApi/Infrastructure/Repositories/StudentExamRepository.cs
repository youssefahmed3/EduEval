using Shared.Dtos;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Infrastructure.Helpers;
using Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class StudentExamRepository : IStudentExamRepository
{

    private readonly IConfiguration _config;
    private readonly DataContextEF _entityFramework;

    public StudentExamRepository(IConfiguration config, DataContextEF entityFramwork)
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

    public async Task<IEnumerable<StudentExams>> GetAllStudentExams()
    {

        IEnumerable<StudentExams> studentExams = await _entityFramework.StudentExams!.Include(s => s.Exam).Include(s => s.Student).ToListAsync();

        if (studentExams != null)
        {
            return studentExams;
        }
        else
        {
            throw new Exception("No Exams Assosiated With A Student found in the database.");
        }
    }

    public async Task<IEnumerable<StudentExams>> GetStudentExam(string studentId)
    {
        IEnumerable<StudentExams> studentExams = await _entityFramework.StudentExams!
                .Where(se => se.StudentId == studentId)
                .Include(s => s.Exam)
                    .ThenInclude(e => e.Subject)
                .Include(s => s.Student)
                .ToListAsync();

        if (studentExams != null)
        {
            return studentExams;
        }
        else
        {
            throw new Exception("Student Has No Exam History.");
        }
    }
    public async Task<IEnumerable<StudentExams>> GetAllStudentsTakenExam(int examId)
    {
        IEnumerable<StudentExams> allStudentsInExam = await _entityFramework.StudentExams!
                .Where(se => se.ExamId == examId)
                .Include(se => se.Student)

                .Include(se => se.Exam)
                .ToListAsync();

        if (allStudentsInExam != null)
        {
            return allStudentsInExam;
        }
        else
        {
            throw new Exception("No Students Taken This Exam");
        }
    }

    public async Task<StudentExams> GetStudentByTakenExam(string studentId, int examId)
    {
        StudentExams? studentExams = await _entityFramework.StudentExams!.Include(s => s.Exam).Where(se => se.StudentId == studentId).Include(se => se.Student).Where(se => se.ExamId == examId).FirstOrDefaultAsync();



        return studentExams;
    }
}


