using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal;
using qrmanagament.backend.Context;
using qrmanagament.backend.DTO.Asset;
using qrmanagament.backend.Models;

namespace qrmanagament.backend.Repositories{
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
                            managementStatus,
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
                            managementStatus,
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
                            managementStatus,
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
                            managementStatus,
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

        public async Task<int> AddAsset(AssetRequestDTO asset){
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

                        // Ensure date in the correct format
                        // book.datePublished = DateOnly.TryFormat();

                        string insertBookQuery = @"
                            INSERT INTO Assets 
                        ";
                        using (var assetCommand = new SqlCommand(insertBookQuery, connection, transaction)){
                            assetCommand.Parameters.AddWithValue("@bookId", asset.id);
                            assetCommand.Parameters.AddWithValue("@title", asset.name);
                            assetCommand.Parameters.AddWithValue("@datePublished", asset.locationId);
                            assetCommand.Parameters.AddWithValue("@totalPage", asset.assetType);
                            assetCommand.Parameters.AddWithValue("@country", asset.itemStatus);
                            assetCommand.Parameters.AddWithValue("@language", asset.image);

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
    }
}