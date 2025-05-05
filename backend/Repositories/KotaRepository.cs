using qrmanagement.backend.Context;
using qrmanagement.backend.DTO.Kota;
using Microsoft.Data.SqlClient;

namespace qrmanagement.backend.Repositories{
    public class KotaRepository : IKotaRepository{
        private readonly AppDBContext _context;
        private readonly ILogger<KotaRepository> _logger;
        private readonly IConfiguration _configuration;
        private const string UploadsFolder = "uploads/kota";
        public KotaRepository(AppDBContext context, ILogger<KotaRepository> logger, IConfiguration configuration){
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }   
        public async Task<IEnumerable<KotaResponseDTO>> GetAllKota()
        {
            try{
                var kotaList = new List<KotaResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened");
                    
                    string query = @"
                        SELECT
                            kotaId,
                            kotaName
                        FROM 
                            Kotas
                        WHERE
                            kotaId != -1
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            while (await reader.ReadAsync()){
                                KotaResponseDTO kota = new KotaResponseDTO{
                                    kotaId = reader.GetInt32(0),
                                    kotaName = reader.GetString(1),
                                };
                                kotaList.Add(kota);
                            }
                        }
                    }
                }
                return kotaList;
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving kotas data from the database");
            }
            catch (Exception ex){
                _logger.LogError($"An error occured: {ex.Message}");
                throw new Exception("Internal server error");
            }
        }
        public async Task<KotaResponseDTO> GetKotaById(int id)
        {
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            kotaId,
                            kotaName,
                        FROM 
                            Kotas
                        WHERE
                            kotaId = @id
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        command.Parameters.AddWithValue("@id", id);
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            if (await reader.ReadAsync()){
                                KotaResponseDTO kota = new KotaResponseDTO{
                                    kotaId = reader.GetInt32(0),
                                    kotaName = reader.GetString(1),
                                };
                                _logger.LogDebug("Kota fetched successfully");
                                return kota;
                            }
                            else{
                                _logger.LogWarning("No kota found with the given id: {kotaId}", id);
                                return null!;
                            }
                        }
                    }

                }
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving kota data from the database");
            }
            catch (Exception ex){
                _logger.LogError($"An error occured: {ex.Message}");
                throw new Exception("Internal server error");
            }
        }
    }
}