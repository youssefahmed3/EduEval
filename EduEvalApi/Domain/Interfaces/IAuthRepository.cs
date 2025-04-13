
using Shared.Dtos;
using Domain.Models;

namespace Domain.Interfaces;

public interface IAuthRepository {
    public Task<AuthResult> Register(StudentToRegister studentToRegister);
    public Task<AuthResult> Login(UserLoginDto userToLogin);
    public Task<AuthResult> AssignRole(string userId, string role);
}