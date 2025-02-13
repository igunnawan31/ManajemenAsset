using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qrmanagement.backend.DTO.Login;
using qrmanagement.backend.DTO.register;
using qrmanagement.backend.Helpers;
using qrmanagement.backend.Models;
using qrmanagement.backend.Repositories;

namespace qrmanagement.backend.Controllers{
    [Route("api")]
    [ApiController]
    public class AuthController : Controller 
    {
        private readonly IUserRepository _repository;
        private readonly JwtService _jwtService;

        public AuthController(IUserRepository repository, JwtService jwtService) {
            _repository = repository;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromForm] RegisterDTO dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.userEmail) || !Regex.IsMatch(dto.userEmail, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                    return BadRequest(new { message = "Invalid email format." });

                if (string.IsNullOrWhiteSpace(dto.password) || dto.password.Length < 6)
                    return BadRequest(new { message = "Password must be at least 6 characters long." });


                var user = new User
                {
                    userId = dto.userId,
                    userName = dto.userName,
                    userEmail = dto.userEmail,
                    userBranch = dto.userBranch,
                    userPhone = dto.userPhone,
                    userRole = dto.userRole,
                    userSubRole = dto.userSubRole,
                    password = BCrypt.Net.BCrypt.HashPassword(dto.password),
                };

                _repository.Create(user);

                var jwtToken = _jwtService.GenerateToken(user);

                return Created("success", new { 
                    message = "User registered successfully.",
                    token = jwtToken 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDTO dto) {
            try {
                var user = _repository.GetByEmail(dto.userEmail);
                if (user == null)
                    return BadRequest(new { message = "Account is not registered." });

                if (!BCrypt.Net.BCrypt.Verify(dto.password, user.password))
                    return BadRequest(new { message = "Invalid credentials." });

                var jwt = _jwtService.generate(user.userEmail);

                Response.Cookies.Append("jwt", jwt, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict
                });

                return Ok(new { message = "Login successful." });
            }
            catch (Exception ex) {
                return StatusCode(500, new { message = "An error occurred during login.", error = ex.Message });
            }
        }

        [HttpGet("dashboard")]
        [Authorize]
        [RoleAuthorization("Kepala_Gudang")]
        public IActionResult Dashboard()
        {
            return Ok(new {
                message = "Welcome to Dashboard"
            });
        }

        [HttpGet("inbound")]
        [Authorize]
        [RoleAuthorization("PIC_Gudang")]
        public IActionResult Inbound()
        {
            return Ok(new {
                message = "Welcome to Inbound"
            });
        }

        
    }
}