using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
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
        private const string UploadsFolder = "uploads";

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
                    branch = dto.branch,
                };

                _repository.Create(user);

                return Created("success", new { message = "User registered successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

    }
}