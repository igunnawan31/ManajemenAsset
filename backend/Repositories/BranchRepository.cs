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
                            kotaId,
                            kecamatanId,
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
                                    branchKota = reader.GetInt32(4),
                                    branchKecamatan = reader.GetInt32(5),
                                    branchLocation = reader.GetString(6),
                                    parentId = reader.IsDBNull(7) ? null : reader.GetInt32(7),
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

        public async Task<BranchResponseDTO> GetBranchById(int id)
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
                            kotaId,
                            kecamatanId,
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
                                    branchKota = reader.GetInt32(4),
                                    branchKecamatan = reader.GetInt32(5),
                                    branchLocation = reader.GetString(6),
                                    parentId = reader.IsDBNull(7) ? null : reader.GetInt32(7),
                                };
                                _logger.LogDebug("Branch fetched successfully");
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
        
        public async Task<int> AddBranch(CreateBranchDTO branch)
        {
            _logger.LogDebug("Adding branch to the database.");
            
            int rowsAffected = 0;
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = connection.BeginTransaction()){
                        
                        string insertBranchQuery;
                        if(branch.parentId != null){
                            insertBranchQuery = @"
                                INSERT INTO 
                                    Branches (branchName, branchEmail, branchPhone, branchLocation, kotaId, kecamatanId, parentId)
                                VALUES
                                    (@branchName, @branchName, @branchPhone, @branchLocation, @kotaId, @kecamatanId, @parentId) 
                            ";
                        }
                        else{
                            insertBranchQuery = @"
                                INSERT INTO 
                                    Branches (branchName, branchEmail, branchPhone, branchLocation, kotaId, kecamatanId)
                                VALUES
                                    (@branchName, @branchName, @branchPhone, @branchLocation,  @kotaId, @kecamatanId) 
                            ";
                        }
                        using (var branchCommand = new SqlCommand(insertBranchQuery, connection, transaction)){
                            branchCommand.Parameters.AddWithValue("@branchName", branch.branchName);
                            branchCommand.Parameters.AddWithValue("@branchEmail", branch.branchEmail);
                            branchCommand.Parameters.AddWithValue("@branchPhone", branch.branchPhone);
                            branchCommand.Parameters.AddWithValue("@branchLocation", branch.branchLocation);
                            branchCommand.Parameters.AddWithValue("@kotaId", branch.branchKota);
                            branchCommand.Parameters.AddWithValue("@kecamatanId", branch.branchKecamatan);
                            if(branch.parentId != null){
                                branchCommand.Parameters.AddWithValue("@parentId", branch.parentId);
                            }
                            rowsAffected = await branchCommand.ExecuteNonQueryAsync();
                        }
                        _logger.LogDebug("Successfuly added branch");
                        transaction.Commit();
                    }
                }

                _logger.LogDebug("Branch successfully added.");
                return rowsAffected;
            }
            catch (SqlException sqlEx){
                // transaction.Rollback();
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while creating branch");    
            }
            catch (Exception ex){
                // transaction.Rollback();
                _logger.LogError(ex, "An error occurred while creating branch.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            }
        }

        public async Task<int> UpdateBranch(UpdateBranchDTO branch)
        {
            _logger.LogDebug("Updating branch data");

            int rowsAffected = 0;
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = connection.BeginTransaction()){
                        string updateQuery = @"
                            UPDATE 
                                Branches
                            SET
                                branchName = @branchName, 
                                branchEmail = @branchEmail,
                                branchPhone = @branchPhone,
                                branchLocation = @branchLocation,
                                parentId = @parentId
                            WHERE
                                branchId = @id
                        ";

                        using (var branchCommand = new SqlCommand(updateQuery, connection, transaction)){
                            branchCommand.Parameters.AddWithValue("@id", branch.branchId);
                            branchCommand.Parameters.AddWithValue("@branchName", branch.branchName);
                            branchCommand.Parameters.AddWithValue("@branchEmail", branch.branchEmail);
                            branchCommand.Parameters.AddWithValue("@branchPhone", branch.branchPhone);
                            branchCommand.Parameters.AddWithValue("@branchLocation", branch.branchLocation);
                            branchCommand.Parameters.AddWithValue("@parentId", branch.parentId);

                            rowsAffected = await branchCommand.ExecuteNonQueryAsync();
                        }

                        _logger.LogDebug("Successfuly updated branch");
                        transaction.Commit();
                    }
                }     

                _logger.LogDebug("Branch successfully updated");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                // transaction.Rollback();
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while updating branch");    
            }
            catch (Exception ex){
                // transaction.Rollback();
                _logger.LogError(ex, "An error occurred while updating branch.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            }    
        }

        public async Task<int> DeleteBranch(int id)
        {
            _logger.LogDebug("Deleting branch from the database");

            int rowsAffected = 0;
            try
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = connection.BeginTransaction()){
                        string deleteBranchQuery = @"
                            DELETE FROM
                                Branches
                            WHERE
                                branchId = @id
                        ";
                        using (var branchCommand = new SqlCommand(deleteBranchQuery, connection, transaction)){
                            branchCommand.Parameters.AddWithValue("@id", id);

                            rowsAffected = await branchCommand.ExecuteNonQueryAsync();
                        }
                        _logger.LogDebug("Successfuly deleted Branch");
                        transaction.Commit();
                    }
                }

                _logger.LogDebug("Branch successfully deleted.");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                // transaction.Rollback();
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while deleting branch");    
            }
            catch (Exception ex){
                // transaction.Rollback();
                _logger.LogError(ex, "An error occurred while deleting branch.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            }
        }
    }
}