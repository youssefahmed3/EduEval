using Shared.Dtos;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace WebApi.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;

        public AuthController(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<IActionResult> Register(StudentToRegister userToRegister)
        {
            var result = await _authRepository.Register(userToRegister);
            if(result.Result) {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLoginDto userToLogin)
        {
            var result = await _authRepository.Login(userToLogin);
            if(result.Result) {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        
    }
}