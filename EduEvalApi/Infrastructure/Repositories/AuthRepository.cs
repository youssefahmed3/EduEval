using Shared.Dtos;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Infrastructure.Helpers;

namespace Infrastructure.Repositories
{
    public class AuthRepository : IAuthRepository
    {

        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;
        private readonly AuthHelper _authHelper;
        public AuthRepository(UserManager<User> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
            _authHelper = new AuthHelper(config);
        }
        public async Task<AuthResult> Register(StudentToRegister studentToRegister)
        {
            var userExists = await _userManager.FindByEmailAsync(studentToRegister.Email);
            if (userExists != null)
            {
                return new AuthResult()
                {
                    Result = false,
                    Errors = new List<string> { "Email already exists" }
                };
            }

            var newUser = new User()
            {
                Email = studentToRegister.Email,
                UserName = studentToRegister.Username,
                FirstName = studentToRegister.FirstName,
                LastName = studentToRegister.LastName,
                Role = "Student", // This is for application-level purposes
            };

            var isCreated = await _userManager.CreateAsync(newUser, studentToRegister.Password);

            if (isCreated.Succeeded)
            {
                // Assign the Student role to the new user
                var roleResult = await _userManager.AddToRoleAsync(newUser, "Student");

                if (roleResult.Succeeded)
                {
                    string token = _authHelper.GenerateJwtToken(newUser);
                    return new AuthResult()
                    {
                        Result = true,
                        Token = token
                    };
                }
                else
                {
                    // If role assignment fails, delete the user to maintain consistency
                    await _userManager.DeleteAsync(newUser);

                    return new AuthResult()
                    {
                        Result = false,
                        Errors = roleResult.Errors.Select(e => e.Description).ToList()
                    };
                }
            }

            var errors = isCreated.Errors.Select(e => e.Description).ToList();
            return new AuthResult()
            {
                Result = false,
                Errors = errors
            };
        }


        public async Task<AuthResult> Login(UserLoginDto userToLogin)
        {
            var userExists = await _userManager.FindByEmailAsync(userToLogin.Email);
            if (userExists == null)
            {
                return new AuthResult()
                {
                    Result = false,
                    Errors = new List<string> { "User does not exist" }
                };
            }

            bool isUserCorrect = await _userManager.CheckPasswordAsync(userExists, userToLogin.Password);
            if (!isUserCorrect)
            {
                return new AuthResult()
                {
                    Result = false,
                    Errors = new List<string> { "Invalid Credentials" }
                };
            }

            string token = _authHelper.GenerateJwtToken(userExists);
            return new AuthResult()
            {
                Result = true,
                Token = token
            };
        }

        public async Task<AuthResult> AssignRole(string userId, string role)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new AuthResult
                {
                    Result = false,
                    Errors = new List<string> { "User not found" }
                };
            }

            if (!await _userManager.IsInRoleAsync(user, role))
            {
                var result = await _userManager.AddToRoleAsync(user, role);
                if (result.Succeeded)
                {
                    return new AuthResult { Result = true };
                }
                else
                {
                    return new AuthResult
                    {
                        Result = false,
                        Errors = result.Errors.Select(e => e.Description).ToList()
                    };
                }
            }

            return new AuthResult
            {
                Result = false,
                Errors = new List<string> { "User is already in this role" }
            };
        }

    }



}