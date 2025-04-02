using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal;
using qrmanagement.backend.Context;
using qrmanagement.backend.DTO.Asset;
using qrmanagement.backend.DTO.AssetMove;
using qrmanagement.backend.Models;

namespace qrmanagement.backend.Repositories{
    public class AssetMoveRepository : IAssetMoveRepository{
        private readonly AppDBContext _context;
        private readonly ILogger<AssetMoveRepository> _logger;
        private readonly IConfiguration _configuration;
        private const string UploadsFolder = "uploads/asset";
        public AssetMoveRepository(AppDBContext context, ILogger<AssetMoveRepository> logger, IConfiguration configuration){
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<IEnumerable<AssetMoveResponseDTO>> GetAllAssetMove()
        {
            try{
                var assetMoveList = new List<AssetMoveResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            id,
                            ticketNumber,
                            assetNumber,
                            moveStatus
                        FROM 
                            AssetMoves
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            while (await reader.ReadAsync()){
                                AssetMoveResponseDTO asset = new AssetMoveResponseDTO{
                                    id = reader.GetInt32(0),
                                    ticketNumber = reader.GetString(1),
                                    assetNumber = reader.GetString(2),
                                    moveStatus = reader.GetString(3)
                                };
                                assetMoveList.Add(asset);
                            }
                        }
                    }

                }
                return assetMoveList;
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving assetmove data from the database");
            }
            catch (Exception ex){
                _logger.LogError($"An error occured: {ex.Message}");
                throw new Exception("Internal server error");
            }
        }

        public async Task<IEnumerable<AssetMoveResponseDTO>> GetAssetMoveByTN(string ticketNumber)
        {
            try{
                var assetMoveList = new List<AssetMoveResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            id,
                            ticketNumber,
                            assetNumber,
                            moveStatus
                        FROM 
                            AssetMoves
                        WHERE
                            ticketNumber = @ticketNumber
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        command.Parameters.AddWithValue("@ticketNumber", ticketNumber);
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            while (await reader.ReadAsync()){
                                AssetMoveResponseDTO asset = new AssetMoveResponseDTO{
                                    id = reader.GetInt32(0),
                                    ticketNumber = reader.GetString(1),
                                    assetNumber = reader.GetString(2),
                                    moveStatus = reader.GetString(3)
                                };
                                assetMoveList.Add(asset);
                            }
                        }
                    }
                }
                return assetMoveList;
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving assetmove data from the database");
            }
            catch (Exception ex){
                _logger.LogError($"An error occured: {ex.Message}");
                throw new Exception("Internal server error");
            }        
        }

        public async Task<IEnumerable<AssetMoveResponseDTO>> GetAssetMoveByAN(string assetNumber)
        {
            try{
                var assetMoveList = new List<AssetMoveResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            id,
                            ticketNumber,
                            assetNumber,
                            moveStatus
                        FROM 
                            AssetMoves
                        WHERE
                            assetNumber = @assetNumber
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        command.Parameters.AddWithValue("@assetNumber", assetNumber);
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            while (await reader.ReadAsync()){
                                AssetMoveResponseDTO asset = new AssetMoveResponseDTO{
                                    id = reader.GetInt32(0),
                                    ticketNumber = reader.GetString(1),
                                    assetNumber = reader.GetString(2),
                                    moveStatus = reader.GetString(3)
                                };
                                assetMoveList.Add(asset);
                            }
                        }
                    }
                }
                return assetMoveList;
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving assetmove data from the database");
            }
            catch (Exception ex){
                _logger.LogError($"An error occured: {ex.Message}");
                throw new Exception("Internal server error");
            }
        }

        public async Task<IEnumerable<AssetMoveResponseDTO>> GetAssetMoveByStatus(string status)
        {
            try{
                var assetMoveList = new List<AssetMoveResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            id,
                            ticketNumber,
                            assetNumber,
                            moveStatus
                        FROM 
                            AssetMoves
                        WHERE
                            moveStatus = @moveStatus
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        command.Parameters.AddWithValue("@moveStatus", status);
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            while (await reader.ReadAsync()){
                                AssetMoveResponseDTO asset = new AssetMoveResponseDTO{
                                    id = reader.GetInt32(0),
                                    ticketNumber = reader.GetString(1),
                                    assetNumber = reader.GetString(2),
                                    moveStatus = reader.GetString(3)
                                };
                                assetMoveList.Add(asset);
                            }
                        }
                    }
                }
                return assetMoveList;
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving assetmove data from the database");
            }
            catch (Exception ex){
                _logger.LogError($"An error occured: {ex.Message}");
                throw new Exception("Internal server error");
            }
        }

        public async Task<int> AddAssetMove(IEnumerable<string> assetNumbers, string ticketNumber){
            _logger.LogDebug("Adding assetMove to the database.");

            int rowsAffected=0;
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = await connection.BeginTransactionAsync()){
                        try{
                            string insertAssetMove = @"
                                INSERT INTO AssetMoves 
                                    (ticketNumber, assetNumber, moveStatus)
                                VALUES
                                    (@ticketNumber, @assetNumber, @moveStatus);
                            ";
                            foreach (var assetNumber in assetNumbers){
                                using (var assetMoveCommand = new SqlCommand(insertAssetMove, connection, (SqlTransaction)transaction)){
                                    assetMoveCommand.Parameters.AddWithValue("@ticketNumber", ticketNumber);
                                    assetMoveCommand.Parameters.AddWithValue("@assetNumber", assetNumber);
                                    assetMoveCommand.Parameters.AddWithValue("@moveStatus", AssetMoveStatus.Draft.ToString());

                                    rowsAffected = await assetMoveCommand.ExecuteNonQueryAsync();
                                    
                                    _logger.LogDebug("Successfully added assetmove.");
                                }
                            }
                            await transaction.CommitAsync();
                            return rowsAffected;
                        }
                        catch (Exception ex)
                        {
                            await transaction.RollbackAsync();
                            _logger.LogError(ex, "Transaction rolled back due to an error.");
                            throw;
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                _logger.LogError($"An SQL error occurred: {sqlEx.Message}");
                throw new Exception("An error occurred while creating ticket");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating ticket.");
                throw new Exception("Internal Server Error");
            }
        }

        public async Task<int> UpdateAssetMoveStatuses(IEnumerable<UpdateAssetMoveStatusDTO> assets){
            _logger.LogDebug("Updating assetmove status");

            int rowsAffected = 0;
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = connection.BeginTransaction()){
                        try
                        {
                            string updateQuery = @"
                                UPDATE 
                                    AssetMoves
                                SET
                                    moveStatus = @moveStatus
                                WHERE
                                    id = @assetMoveId
                            ";
                            foreach (var asset in assets){
                                using (var assetMoveCommand = new SqlCommand(updateQuery, connection, transaction)){
                                    assetMoveCommand.Parameters.AddWithValue("@moveStatus", asset.status);
                                    assetMoveCommand.Parameters.AddWithValue("@assetMoveId", asset.assetMoveId);
                                    
                                    rowsAffected = await assetMoveCommand.ExecuteNonQueryAsync();
                                }
                                
                            }
                            _logger.LogDebug("Successfuly updated assetMove");
                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            await transaction.RollbackAsync();
                            _logger.LogError(ex, "Transaction rolled back due to an error.");
                            throw;
                        }
                    }
                }     

                _logger.LogDebug("Assetmove successfully updated");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while updating Assetmove");    
            }
            catch (Exception ex){
                _logger.LogError(ex, "An error occurred while updating Assetmove.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            }
        }

        public async Task<int> UpdateAssetMoveStatus(UpdateAssetMoveStatusDTO asset){
            _logger.LogDebug("Updating assetmove status");

            int rowsAffected = 0;
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = connection.BeginTransaction()){
                        try
                        {
                            string updateQuery = @"
                                UPDATE 
                                    AssetMoves
                                SET
                                    moveStatus = @moveStatus
                                WHERE
                                    id = @assetMoveId
                            ";
                            using (var assetMoveCommand = new SqlCommand(updateQuery, connection, transaction)){
                                assetMoveCommand.Parameters.AddWithValue("@moveStatus", asset.status);
                                assetMoveCommand.Parameters.AddWithValue("@assetMoveId", asset.assetMoveId);
                                
                                rowsAffected = await assetMoveCommand.ExecuteNonQueryAsync();
                            }
                            _logger.LogDebug("Successfuly updated assetMove");
                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            await transaction.RollbackAsync();
                            _logger.LogError(ex, "Transaction rolled back due to an error.");
                            throw;
                        }
                    }
                }     

                _logger.LogDebug("Assetmove successfully updated");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while updating Assetmove");    
            }
            catch (Exception ex){
                _logger.LogError(ex, "An error occurred while updating Assetmove.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            }
        }

        public async Task<int> DeleteAssetMoves(IEnumerable<string> ids)
        {
            _logger.LogDebug("Deleting assetmove from the database");

            int rowsAffected = 0;
            try
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = await connection.BeginTransactionAsync()){ // kalo error, ganti jadi begintransaction dan hapus await setelah itu hapus cast di transaction sql command dst.
                        try
                        {
                            // string checkStatusQuery = @"
                            //     SELECT
                            //         am.moveStatus
                            //     FROM 
                            //         AssetMoves am
                            //     WHERE
                            //         am.Id = @id
                            // ";
                            // using (var checkMoveCommand = new SqlCommand(checkStatusQuery, connection, (SqlTransaction)transaction)){
                            //     foreach (var id in ids)
                            //     {
                            //         checkMoveCommand.Parameters.AddWithValue("@id", id);
                            //         using (SqlDataReader reader = (SqlDataReader) await checkMoveCommand.ExecuteReaderAsync()){
                            //             if (await reader.ReadAsync()) // Pastikan ada data sebelum memanggil reader.GetString(0)
                            //             {
                            //                 if (!(Enum.Parse<ticketMoveStatus>(reader.GetString(0)) == ticketMoveStatus.Not_Started)){
                            //                     throw new Exception("Ticket is currently being executed or has been completed");
                            //                 }
                            //             }
                            //             else
                            //             {
                            //                 throw new Exception("Ticket not found");
                            //             }
                            //         }
                            //     }
                            // }

                            // TO DO: check status dari ticketNumber, kalo masih draft boleh delete asset move if not then failed

                            string deleteAssetMoveQuery = @"
                                DELETE FROM
                                    AssetMoves
                                WHERE
                                    id = @id
                            ";
                            foreach (var id in ids)
                            {
                                using (var ticketCommand = new SqlCommand(deleteAssetMoveQuery, connection, (SqlTransaction)transaction)){
                                    ticketCommand.Parameters.AddWithValue("@id", id);

                                    rowsAffected = await ticketCommand.ExecuteNonQueryAsync();
                                }
                            }
                            _logger.LogDebug("Successfuly deleted AssetMove");
                            transaction.Commit();    
                        }
                        catch (Exception ex)
                        {
                            await transaction.RollbackAsync();
                            _logger.LogError(ex, "Transaction rolled back due to an error.");
                            throw;
                        }
                    }
                }

                _logger.LogDebug("AssetMove successfully deleted.");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while deleting AssetMove");    
            }
            catch (Exception ex){
                _logger.LogError(ex, "An error occurred while deleting AssetMove.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            } 
        }
    }
}