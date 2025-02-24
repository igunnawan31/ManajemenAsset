using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using qrmanagement.backend.DTO.User;
using qrmanagement.backend.Models;

[Route("api/user")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<UserController> _logger;
    private List<UserResponseDTO> UsersList { get; set; } = new List<UserResponseDTO>();

    public UserController(IConfiguration configuration, ILogger<UserController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<List<UserResponseDTO>> Index()
    {
        _logger.LogDebug("Fetching all Users from database");
        try 
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
            _logger.LogDebug("Connection string retrieved");

            List<UserResponseDTO> users = new List<UserResponseDTO>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                _logger.LogDebug("Database connection opened");

                string query = "SELECT userId, userName, userEmail, userBranch, userPhone, userRole, userSubRole, password FROM Users";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            users.Add(new UserResponseDTO
                            {
                                userId = reader.GetInt32(0),
                                userName = reader.GetString(1),
                                userEmail = reader.GetString(2),
                                userBranch = reader.GetInt32(3),
                                userPhone = reader.GetString(4),
                                userRole = (Role)reader.GetInt32(5),        
                                userSubRole = (SubRole)reader.GetInt32(6),     
                                password = reader.IsDBNull(7) ? null : BCrypt.Net.BCrypt.HashPassword(reader.GetString(7))
                            });
                        }
                    }
                }
            }

            _logger.LogDebug($"Fetched {users.Count} users from database");
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching users: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("register")]
    public IActionResult addUser([FromForm] UserRequestDTO user)
    {
        _logger.LogDebug("Adding new User");

        try
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
            _logger.LogDebug("Connection string retrieved");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                _logger.LogDebug("Database connection opened");

                string? hashedPassword = string.IsNullOrEmpty(user.password) ? null : BCrypt.Net.BCrypt.HashPassword(user.password);

                string query = @"
                    INSERT INTO Users (Name, Email, Branch, Phone, Role, SubRole, Password) 
                    VALUES (@Name, @Email, @Branch, @Phone, @Role, @SubRole, @Password)";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Name", user.userName);
                    command.Parameters.AddWithValue("@Email", user.userEmail);
                    command.Parameters.AddWithValue("@Branch", user.userBranch);
                    command.Parameters.AddWithValue("@Phone", user.userPhone);
                    command.Parameters.AddWithValue("@Role", user.userRole); 
                    command.Parameters.AddWithValue("@SubRole", user.userSubRole);  
                    command.Parameters.AddWithValue("@Password", (object?)hashedPassword ?? DBNull.Value);

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        _logger.LogDebug("User successfully registered.");
                        return Ok(new { message = "User registered successfully!" });
                    }
                    else
                    {
                        return BadRequest("Failed to register user.");
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error registering user: {ex.Message}");
            return StatusCode(500, "Internal server error.");
        }
    }

    [HttpGet("by-userId/{userId}")]
    public ActionResult<UserResponseDTO> getUserByUserId(int userId)
    {
        _logger.LogDebug($"Fetching user with userId: {userId}");

        try
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
            _logger.LogDebug("Connection string retrieved");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                _logger.LogDebug("Database connection opened");

                string query = @"
                    SELECT userId, userName, userEmail, userBranch, userPhone, userRole, userSubRole 
                    FROM Users 
                    WHERE userId = @userId";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@userId", userId);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read()) // Expecting only one result
                        {
                            var user = new UserResponseDTO
                            {
                                userId = reader.GetInt32(0),
                                userName = reader.GetString(1),
                                userEmail = reader.GetString(2),
                                userBranch = reader.GetInt32(3),
                                userPhone = reader.GetString(4),
                                userRole = Enum.Parse<Role>(reader.GetString(5)),
                                userSubRole = Enum.Parse<SubRole>(reader.GetString(6)),
                                password = reader.IsDBNull(7) ? null : reader.GetString(7) // No need to hash again
                            };

                            _logger.LogDebug("User found and returned.");
                            return Ok(user);
                        }
                    }
                }
            }

            _logger.LogDebug("User not found.");
            return NotFound("User not found");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching user: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }
}
