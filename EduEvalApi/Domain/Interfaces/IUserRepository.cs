
using Shared.Dtos;
using Domain.Models;

namespace Domain.Interfaces;

public interface IUserRepository
{
    public Task<IEnumerable<User>> GetAllStudents();
    public Task<User> GetSingleStudent(string userId);
    public Task<User> GetSingleAdmin(string adminId);
    public bool SaveChanges();
    public Task<IEnumerable<User>> GetPaginatedStudents(int pageNumber, int pageSize);
    public Task<int> GetTotalUsersCount();

}