using Shared.Dtos;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Infrastructure.Helpers;
using Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserRepository : IUserRepository
{

    private readonly IConfiguration _config;
    private readonly DataContextEF _entityFramework;

    public UserRepository(IConfiguration config, DataContextEF entityFramwork)
    {
        _entityFramework = entityFramwork;
        _config = config;
    }

    public bool SaveChanges()
    {
        return _entityFramework.SaveChanges() > 0;
    }

    public async Task<IEnumerable<User>> GetAllStudents()
    {
        IEnumerable<User> Students = await _entityFramework.Users!.Where(u => u.Role == "Student").ToListAsync();

        if (Students != null)
        {
            return Students;
        }
        else
        {
            throw new Exception("No Students found in the database.");
        }
    }

    public async Task<User> GetSingleStudent(string studentId)
    {
        User? Student =  await _entityFramework.Users!.Where(s => s.Id == studentId).Where(s => s.Role == "Student").FirstOrDefaultAsync();

        if (Student != null)
        {
            return Student;
        }
        else
        {
            throw new Exception("No Student found in the database With This Id.");
        }
    }

}

