using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using qrmanagement.backend.DTO.User;
using qrmanagement.backend.Repositories;

namespace qrmanagement.backend.Controllers{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly ILogger<UserController> _logger;
        public UserController(IUserRepository userRepo, ILogger<UserController> logger)
        {
            _userRepo = userRepo;
            _logger = logger;
        }

        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<UserResponseDTO>>> Index(){
            var users = await _userRepo.GetAllUsers();
            if(users == null){
                return NotFound();
            }
            _logger.LogDebug("Berhasil");
            return Ok(users);
        }

        [HttpGet("by-id/{id}")]
        public async Task<ActionResult<UserResponseDTO>> GetUserById(int id){
            var user = await _userRepo.GetUserById(id);
            if(user == null){
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost("register")]
        public async Task<IActionResult> AddBranch([FromForm] UserRequestDTO user){
            int row = await _userRepo.AddUser(user);
            if(row == 0){
                return BadRequest("Failed while creating user");
            }
            return Ok(new {statusCode = 200, message = "user Created Successfully"});
        }

    }
}
