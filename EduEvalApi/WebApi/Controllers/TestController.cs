using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers {
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase {
        
        public TestController () {

        }

        // [Authorize(Roles = "Student")]
        [HttpGet("Test")]
        public string Test() {
            return "Hello World";
        }
    }
}