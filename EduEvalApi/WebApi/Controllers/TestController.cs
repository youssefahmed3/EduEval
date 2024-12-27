using Infrastructure.SignalRHubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace WebApi.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        public TestController(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        // [Authorize(Roles = "Student")]
        [HttpGet("Test")]
        public string Test()
        {
            return "Hello World";
        }

        [HttpPost("SendNotification")]
        public async Task<IActionResult> SendNotification()
        {
            await _hubContext.Clients.All.SendAsync("ExamSubmittedByStudent", new
            {
                Message = $"Test .",
                status = "success"
            });
            /* Console.WriteLine(_hubContext.Clients.All.SendAsync("ExamSubmittedByStudent", new
            {
                Message = "Test Notification",
                Time = DateTime.Now.ToString(),
            })); */
            return Ok("Test Notification");
        }

        [HttpGet("CheckCliams")]
        public IActionResult GetClaims()
        {
            var claims = User.Claims.Select(c => $"{c.Type}: {c.Value}").ToList();
            return Ok(new { Claims = claims });
        }
    }
}