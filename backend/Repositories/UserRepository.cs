using qrmanagement.backend.Models;
using qrmanagement.backend.Context;
using qrmanagement.backend.DTO.User;
using Microsoft.Data.SqlClient;

namespace qrmanagement.backend.Repositories
{
    public class UserRepository: IUserRepository
    {
        private readonly AppDBContext _context;
        private readonly ILogger<UserRepository> _logger;
        private readonly IConfiguration _configuration;
        private const string UploadsFolder = "uploads/user";
        public UserRepository(AppDBContext context, ILogger<UserRepository> logger, IConfiguration configuration){
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        public User Create(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        public User GetByEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.userEmail == email)!;
        }

        public async Task<IEnumerable<UserResponseDTO>> GetAllUsers()
        {
            try{
                var userList = new List<UserResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            userId,
                            userName,
                            userEmail,
                            userBranch,
                            userPhone,
                            userRole,
                            userSubRole
                        FROM 
                            Users
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            while (await reader.ReadAsync()){
                                UserResponseDTO user = new UserResponseDTO{
                                    userId = reader.GetInt32(0),
                                    userName = reader.GetString(1),
                                    userEmail = reader.GetString(2),
                                    userBranch = reader.GetInt32(3),
                                    userPhone = reader.GetString(4),
                                    userRole = (Role)reader.GetInt32(5),        
                                    userSubRole = (SubRole)reader.GetInt32(6)
                                };
                                userList.Add(user);
                            }
                        }
                    }

                }
                return userList;
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving users data from the database");
            }
            catch (Exception ex){
                _logger.LogError($"Error executing query: {ex.Message}");
                return new List<UserResponseDTO>();
            }
        }

        public async Task<UserResponseDTO> GetUserById(int id)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            userId,
                            userName,
                            userEmail,
                            userBranch,
                            userPhone,
                            userRole,
                            userSubRole,
                            password
                        FROM 
                            Users
                        WHERE
                            userId = @userid
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@userid", id); // Correct parameter name
                        using (SqlDataReader reader = (SqlDataReader)await command.ExecuteReaderAsync())
                        {
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            if (await reader.ReadAsync())
                            {
                                UserResponseDTO user = new UserResponseDTO
                                {
                                    userId = reader.GetInt32(0),
                                    userName = reader.GetString(1),
                                    userEmail = reader.GetString(2),
                                    userBranch = reader.GetInt32(3),
                                    userPhone = reader.GetString(4),
                                    userRole = (Role)reader.GetInt32(5),
                                    userSubRole = (SubRole)reader.GetInt32(6),
                                    password = reader.IsDBNull(7) ? null : BCrypt.Net.BCrypt.HashPassword(reader.GetString(7))
                                };
                                _logger.LogDebug("User fetched successfully");
                                return user;
                            }
                            else
                            {
                                _logger.LogWarning("No user found with the given id: {userId}", id);
                                return null!;
                            }
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                _logger.LogError($"An error occurred: {sqlEx.Message}");
                throw new Exception("An error occurred while retrieving user data from the database");
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred: {ex.Message}");
                throw new Exception("Internal server error");
            }
        }

        public async Task<int> AddUser(UserRequestDTO user)
        {
            _logger.LogDebug("Adding user to the database.");
            
            int rowsAffected = 0;
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = connection.BeginTransaction()){

                        string? hashedPassword = string.IsNullOrEmpty(user.password) ? null : BCrypt.Net.BCrypt.HashPassword(user.password);
                        string insertUserQuery;
                        insertUserQuery = @"
                            INSERT INTO 
                                Users (userName,
                                        userEmail,
                                        userBranch,
                                        userPhone,
                                        userRole,
                                        userSubRole,
                                        password)
                            VALUES
                                (@userName,
                                @userEmail,
                                @userBranch,
                                @userPhone,
                                @userRole,
                                @userSubRole,
                                @password) 
                        ";
                        
                        using (var userCommand = new SqlCommand(insertUserQuery, connection, transaction)){
                            userCommand.Parameters.AddWithValue("@userName", user.userName);
                            userCommand.Parameters.AddWithValue("@userEmail", user.userEmail);
                            userCommand.Parameters.AddWithValue("@userBranch", user.userBranch);
                            userCommand.Parameters.AddWithValue("@userPhone", user.userPhone);
                            userCommand.Parameters.AddWithValue("@userRole", user.userRole);
                            userCommand.Parameters.AddWithValue("@userSubRole", user.userSubRole);
                            userCommand.Parameters.AddWithValue("@password", (object?)hashedPassword ?? DBNull.Value);
                            rowsAffected = await userCommand.ExecuteNonQueryAsync();
                        }
                        _logger.LogDebug("Successfuly added user");
                        transaction.Commit();
                    }
                }

                _logger.LogDebug("User successfully added.");
                return rowsAffected;
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while creating user");    
            }
            catch (Exception ex){
                // transaction.Rollback();
                _logger.LogError(ex, "An error occurred while creating user.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            }
        }
    }
}