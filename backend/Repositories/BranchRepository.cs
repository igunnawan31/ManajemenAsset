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
            try
            {
                var branchList = new List<BranchResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved: {ConnectionString}", connectionString);

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            branchId,
                            branchName,
                            branchEmail,
                            branchPhone,
                            kotaId,
                            kecamatanId,
                            branchLocation,
                            parentId
                        FROM 
                            Branches
                    ";

                    _logger.LogDebug("Executing query: {Query}", query);
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = (SqlDataReader)await command.ExecuteReaderAsync())
                        {
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            while (await reader.ReadAsync())
                            {
                                try
                                {
                                    _logger.LogDebug("Reading branchId: {branchId}", reader.GetInt32(0));
                                    _logger.LogDebug("Reading branchName: {branchName}", reader.GetString(1));
                                    _logger.LogDebug("Reading branchEmail: {branchEmail}", reader.GetString(2));
                                    _logger.LogDebug("Reading branchPhone: {branchPhone}", reader.GetString(3));
                                    _logger.LogDebug("Reading kotaId: {kotaId}", reader.IsDBNull(4) ? "NULL" : reader.GetInt32(4).ToString());
                                    _logger.LogDebug("Reading kecamatanId: {kecamatanId}", reader.IsDBNull(5) ? "NULL" : reader.GetInt32(5).ToString());
                                    _logger.LogDebug("Reading branchLocation: {branchLocation}", reader.IsDBNull(6) ? "NULL" : reader.GetString(6));
                                    _logger.LogDebug("Reading parentId: {parentId}", reader.IsDBNull(7) ? "NULL" : reader.GetInt32(7).ToString());

                                    BranchResponseDTO branch = new BranchResponseDTO
                                    {
                                        branchId = reader.GetInt32(0),
                                        branchName = reader.GetString(1),
                                        branchEmail = reader.GetString(2),
                                        branchPhone = reader.GetString(3),
                                        kotaId = reader.IsDBNull(4) ? 0 : reader.GetInt32(4),
                                        kecamatanId = reader.IsDBNull(5) ? 0 : reader.GetInt32(5),
                                        branchLocation = reader.IsDBNull(6) ? string.Empty : reader.GetString(6),
                                        parentId = reader.IsDBNull(7) ? null : (int?)reader.GetInt32(7),
                                    };
                                    branchList.Add(branch);
                                }
                                catch (InvalidCastException ex)
                                {
                                    _logger.LogError($"Invalid data in row: {ex.Message}");
                                    _logger.LogError($"Row data: branchId={reader.GetValue(0)}, branchName={reader.GetValue(1)}, branchEmail={reader.GetValue(2)}, branchPhone={reader.GetValue(3)}, kotaId={reader.GetValue(4)}, kecamatanId={reader.GetValue(5)}, branchLocation={reader.GetValue(6)}, parentId={reader.GetValue(7)}");
                                    continue; // Skip this row and continue with the next one
                                }
                            }
                        }
                    }
                }
                return branchList;
            }
            catch (SqlException sqlEx)
            {
                _logger.LogError($"SQL Error occurred: {sqlEx.Message}");
                throw new Exception("A database error occurred while retrieving branches data.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"An unexpected error occurred: {ex.Message}");
                throw new Exception("An unexpected error occurred while processing your request.");
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
                            kotaId,
                            kecamatanId,
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
                                    kotaId = reader.GetInt32(4),
                                    kecamatanId = reader.GetInt32(5),
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
        
        public async Task<String> GetBranchNameById(string id){
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            branchName
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
                                String branchName = reader.GetString(0);
                                _logger.LogDebug("BranchName fetched successfully");
                                return branchName;
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
                                    Branches (branchName, branchEmail, branchPhone, kotaId, kecamatanId, branchLocation, parentId)
                                VALUES
                                    (@branchName, @branchEmail, @branchPhone, @kotaId, @kecamatanId, @branchLocation, @parentId) 
                            ";
                        }
                        else{
                            insertBranchQuery = @"
                                INSERT INTO 
                                    Branches (branchName, branchEmail, branchPhone, kotaId, kecamatanId, branchLocation)
                                VALUES
                                    (@branchName, @branchEmail, @branchPhone, @kotaId, @kecamatanId, @branchLocation) 
                            ";
                        }
                        using (var branchCommand = new SqlCommand(insertBranchQuery, connection, transaction)){
                            branchCommand.Parameters.AddWithValue("@branchName", branch.branchName);
                            branchCommand.Parameters.AddWithValue("@branchEmail", branch.branchEmail);
                            branchCommand.Parameters.AddWithValue("@branchPhone", branch.branchPhone);
                            branchCommand.Parameters.AddWithValue("@kotaId", branch.kotaId);
                            branchCommand.Parameters.AddWithValue("@kecamatanId", branch.kecamatanId);
                            branchCommand.Parameters.AddWithValue("@branchLocation", branch.branchLocation);
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
                _logger.LogError($"SQL Exception: {sqlEx.Number} - {sqlEx.Message}");
                _logger.LogError($"Stack Trace: {sqlEx.StackTrace}");
                return -1; // Return -1 instead of throwing an exception
            }
            catch (Exception ex){
                _logger.LogError($"General Exception: {ex.Message}");
                _logger.LogError($"Stack Trace: {ex.StackTrace}");
                return -1; // Prevent unhandled exceptions
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