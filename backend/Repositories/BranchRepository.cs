using qrmanagement.backend.DTO.Branch;
using qrmanagement.backend.Context;
using Microsoft.Data.SqlClient;

namespace qrmanagement.backend.Repositories{
    public class BranchRepository : IBranchRepository{
            private readonly AppDBContext _context;
            private readonly ILogger<BranchRepository> _logger;
            private readonly IConfiguration _configuration;
            private const string UploadsFolder = "uploads/branch";
            public BranchRepository(AppDBContext context, ILogger<BranchRepository> logger, IConfiguration configuration){
                _context = context;
                _logger = logger;
                _configuration = configuration;
            }

        public async Task<IEnumerable<BranchResponseDTO>> GetAllBranch()
        {
            try{
                var branchList = new List<BranchResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            branchId,
                            branchName,
                            branchEmail,
                            branchPhone,
                            branchLocation,
                            parentId
                        FROM 
                            Branches
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            while (await reader.ReadAsync()){
                                BranchResponseDTO branch = new BranchResponseDTO{
                                    branchId = reader.GetInt32(0),
                                    branchName = reader.GetString(1),
                                    branchEmail = reader.GetString(2),
                                    branchPhone = reader.GetString(3),
                                    branchLocation = reader.GetString(4),
                                    parentId = reader.IsDBNull(5) ? null : reader.GetInt32(5),
                                };
                                branchList.Add(branch);
                            }
                        }
                    }

                }
                return branchList;
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving branches data from the database");
            }
            catch (Exception ex){
                _logger.LogError($"An error occured: {ex.Message}");
                throw new Exception("Internal server error");
            }
        }

        public async Task<BranchResponseDTO> GetBranchById(string id)
        {
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            branchId,
                            branchName,
                            branchEmail,
                            branchPhone,
                            branchLocation,
                            parentId
                        FROM 
                            Branches
                        WHERE
                            branchId = @id
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        command.Parameters.AddWithValue("@id", id);
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            if (await reader.ReadAsync()){
                                BranchResponseDTO branch = new BranchResponseDTO{
                                    branchId = reader.GetInt32(0),
                                    branchName = reader.GetString(1),
                                    branchEmail = reader.GetString(2),
                                    branchPhone = reader.GetString(3),
                                    branchLocation = reader.GetString(4),
                                    parentId = reader.IsDBNull(5) ? null : reader.GetInt32(5),
                                };
                                _logger.LogDebug("Book fetched successfully");
                                return branch;
                            }
                            else{
                                _logger.LogWarning("No branch found with the given id: {branchId}", id);
                                return null!;
                            }
                        }
                    }

                }
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving branch data from the database");
            }
            catch (Exception ex){
                _logger.LogError($"An error occured: {ex.Message}");
                throw new Exception("Internal server error");
            }
        }

        public async Task<BranchResponseDTO> GetBranchParent(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<int> AddBranch(CreateBranchDTO branch)
        {
            throw new NotImplementedException();
        }

        public async Task<int> UpdateBranch(UpdateBranchDTO branch)
        {
            throw new NotImplementedException();
        }

        public async Task<int> DeleteBranch(string id)
        {
            throw new NotImplementedException();
        }
    }
}