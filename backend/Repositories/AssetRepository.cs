using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal;
using qrmanagement.backend.Context;
using qrmanagement.backend.DTO.Asset;
using qrmanagement.backend.Models;

namespace qrmanagement.backend.Repositories{
    public class AssetRepository : IAssetRepository{
        private readonly AppDBContext _context;
        private readonly ILogger<AssetRepository> _logger;
        private readonly IConfiguration _configuration;
        private const string UploadsFolder = "uploads/asset";
        public AssetRepository(AppDBContext context, ILogger<AssetRepository> logger, IConfiguration configuration){
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<IEnumerable<AssetResponseDTO>> GetAllAsset(){
            try{
                var assetList = new List<AssetResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            id,
                            name,
                            locationId,
                            assetType,
                            itemStatus,
                            imagePath
                        FROM 
                            Assets
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            while (await reader.ReadAsync()){
                                AssetResponseDTO asset = new AssetResponseDTO{
                                    id = reader.GetString(0),
                                    name = reader.GetString(1),
                                    locationId = reader.GetInt32(2),
                                    assetType = Enum.Parse<assetType>(reader.GetString(3)),
                                    itemStatus = Enum.Parse<managementStatus>(reader.GetString(4)),
                                    imagePath = reader.GetString(5)
                                };
                                assetList.Add(asset);
                            }
                        }
                    }

                }
                return assetList;
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving asset data from the database");
            }
            catch (Exception ex){
                _logger.LogError($"An error occured: {ex.Message}");
                throw new Exception("Internal server error");
            }
        }

        public async Task<AssetResponseDTO> GetAssetById(string id){
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            id,
                            name,
                            locationId,
                            assetType,
                            itemStatus,
                            imagePath
                        FROM 
                            Assets
                        WHERE
                            id = @id
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        command.Parameters.AddWithValue("@id", id);
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            if (await reader.ReadAsync()){
                                AssetResponseDTO asset = new AssetResponseDTO{
                                    id = reader.GetString(0),
                                    name = reader.GetString(1),
                                    locationId = reader.GetInt32(2),
                                    assetType = Enum.Parse<assetType>(reader.GetString(3)),
                                    itemStatus = Enum.Parse<managementStatus>(reader.GetString(4)),
                                    imagePath = reader.GetString(5)
                                };
                                _logger.LogDebug("Book fetched successfully");
                                return asset;
                            }
                            else{
                                _logger.LogWarning("No asset found with the given id: {assetId}", id);
                                return null!;
                            }
                        }
                    }

                }
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving asset data from the database");
            }
            catch (Exception ex){
                _logger.LogError($"An error occured: {ex.Message}");
                throw new Exception("Internal server error");
            }
        }

        public async Task<IEnumerable<AssetResponseDTO>> GetAssetByLocationId(int locationId){
            try{
                var assetList = new List<AssetResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            id,
                            name,
                            locationId,
                            assetType,
                            itemStatus,
                            imagePath
                        FROM 
                            Assets
                        WHERE
                            locationId = @id
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        command.Parameters.AddWithValue("@id", locationId);
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            while (await reader.ReadAsync()){
                                AssetResponseDTO asset = new AssetResponseDTO{
                                    id = reader.GetString(0),
                                    name = reader.GetString(1),
                                    locationId = reader.GetInt32(2),
                                    assetType = Enum.Parse<assetType>(reader.GetString(3)),
                                    itemStatus = Enum.Parse<managementStatus>(reader.GetString(4)),
                                    imagePath = reader.GetString(5)
                                };
                                assetList.Add(asset);
                            }
                        }
                    }

                }
                return assetList;
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving asset data from the database");
            }
            catch (Exception ex){
                _logger.LogError($"An error occured: {ex.Message}");
                throw new Exception("Internal server error");
            }
        }

        public async Task<IEnumerable<AssetResponseDTO>> GetAssetByTicketNumber(string ticketNumber){
            try{
                var assetList = new List<AssetResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            id,
                            name,
                            locationId,
                            assetType,
                            itemStatus,
                            imagePath
                        FROM 
                            Assets
                        WHERE
                            ticketNumber = @id
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        command.Parameters.AddWithValue("@id", ticketNumber);
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            while (await reader.ReadAsync()){
                                AssetResponseDTO asset = new AssetResponseDTO{
                                    id = reader.GetString(0),
                                    name = reader.GetString(1),
                                    locationId = reader.GetInt32(2),
                                    assetType = Enum.Parse<assetType>(reader.GetString(3)),
                                    itemStatus = Enum.Parse<managementStatus>(reader.GetString(4)),
                                    imagePath = reader.GetString(5)
                                };
                                assetList.Add(asset);
                            }
                        }
                    }

                }
                return assetList;
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving asset data from the database");
            }
            catch (Exception ex){
                _logger.LogError($"An error occured: {ex.Message}");
                throw new Exception("Internal server error");
            }
        }

        public async Task<int> AddAsset(CreateAssetDTO asset){
            _logger.LogDebug("Adding asset to the database.");
            
            int rowsAffected = 0;
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = connection.BeginTransaction()){

                        string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), UploadsFolder);
                        string uniqueFileName = Guid.NewGuid().ToString() + "_" + asset.image.FileName;
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        if (!Directory.Exists(uploadsFolder)){
                            Directory.CreateDirectory(uploadsFolder);
                        }

                        using (var fileStream = new FileStream(filePath, FileMode.Create)){
                            await asset.image.CopyToAsync(fileStream);
                        }

                        string insertAssetQuery = @"
                            INSERT INTO 
                                Assets (id, name, locationId, assetType, itemStatus, imagePath)
                            VALUES
                                (@id, @name, @locationId, @assetType, @itemStatus, @imagePath) 
                        ";
                        using (var assetCommand = new SqlCommand(insertAssetQuery, connection, transaction)){
                            assetCommand.Parameters.AddWithValue("@id", asset.id);
                            assetCommand.Parameters.AddWithValue("@name", asset.name);
                            assetCommand.Parameters.AddWithValue("@locationId", asset.locationId);
                            assetCommand.Parameters.AddWithValue("@assetType", asset.assetType.ToString());
                            assetCommand.Parameters.AddWithValue("@itemStatus", asset.itemStatus.ToString());
                            assetCommand.Parameters.AddWithValue("@imagePath", asset.image);

                            rowsAffected = await assetCommand.ExecuteNonQueryAsync();
                        }
                        _logger.LogDebug("Successfuly added asset");
                        transaction.Commit();
                    }
                }

                _logger.LogDebug("Asset successfully added.");
                return rowsAffected;
            }
            catch (SqlException sqlEx){
                // transaction.Rollback();
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while creating asset");    
            }
            catch (Exception ex){
                // transaction.Rollback();
                _logger.LogError(ex, "An error occurred while creating asset.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            }        
        }

        public async Task<int> UpdateAsset(UpdateAssetDTO asset){
            _logger.LogDebug("Patching asset data");

            int rowsAffected = 0;
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = connection.BeginTransaction()){
                        string updateQuery = @"
                            UPDATE 
                                Assets
                            SET
                                name = @name, 
                                locationId = @locationId,
                                assetType = @assetType,
                                itemStatus = @itemStatus
                            WHERE
                                id = @id
                        ";

                        using (var assetCommand = new SqlCommand(updateQuery, connection, transaction)){
                            assetCommand.Parameters.AddWithValue("@id", asset.id);
                            assetCommand.Parameters.AddWithValue("@name", asset.name);
                            assetCommand.Parameters.AddWithValue("@locationId", asset.locationId);
                            assetCommand.Parameters.AddWithValue("@assetType", asset.assetType.ToString());
                            assetCommand.Parameters.AddWithValue("@itemStatus", asset.itemStatus.ToString());

                            rowsAffected = await assetCommand.ExecuteNonQueryAsync();
                        }

                        _logger.LogDebug("Successfuly updated asset");
                        transaction.Commit();
                    }
                }     

                _logger.LogDebug("Asset successfully updated");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                // transaction.Rollback();
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while updating asset");    
            }
            catch (Exception ex){
                // transaction.Rollback();
                _logger.LogError(ex, "An error occurred while updating asset.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            }    
        }

        public async Task<int> DeleteAsset(string id){
            _logger.LogDebug("Deleting asset from the database");

            int rowsAffected = 0;
            try
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = connection.BeginTransaction()){
                        string checkMoveQuery = @"
                            SELECT
                                am.status
                            FROM 
                                AssetMoves am
                            JOIN
                                Tickets t ON t.ticketNumber = am.ticketNumber
                            WHERE
                                am.AssetNumber = @id
                            ORDER BY
                                t.outboundDate DESC
                        ";
                        using (var checkMoveCommand = new SqlCommand(checkMoveQuery, connection, transaction)){
                            using (SqlDataReader reader = (SqlDataReader) await checkMoveCommand.ExecuteReaderAsync()){
                                checkMoveCommand.Parameters.AddWithValue("@id", id);
                                if (Enum.Parse<MoveStatus>(reader.GetString(0))==MoveStatus.Incomplete){
                                    throw new Exception("Asset is currently being transported");
                                }
                            }
                        }

                        string deleteAssetQuery = @"
                            DELETE FROM
                                Assets
                            WHERE
                                id = @id
                        ";
                        using (var assetCommand = new SqlCommand(deleteAssetQuery, connection, transaction)){
                            assetCommand.Parameters.AddWithValue("@id", id);

                            rowsAffected = await assetCommand.ExecuteNonQueryAsync();
                        }
                        _logger.LogDebug("Successfuly deleted Asset");
                        transaction.Commit();
                    }
                }

                _logger.LogDebug("Asset successfully deleted.");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                // transaction.Rollback();
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while deleting asset");    
            }
            catch (Exception ex){
                // transaction.Rollback();
                _logger.LogError(ex, "An error occurred while deleting asset.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            } 
        }
    }
}