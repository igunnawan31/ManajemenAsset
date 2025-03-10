using qrmanagement.backend.DTO.Kecamatan;
using qrmanagement.backend.Context;
using Microsoft.Data.SqlClient;

namespace qrmanagement.backend.Repositories{
    public class KecamatanRepository : IKecamatanRepository{
        private readonly AppDBContext _context;
        private readonly ILogger<KecamatanRepository> _logger;
        private readonly IConfiguration _configuration;
        private const string UploadsFolder = "uploads/kecamatan";
        public KecamatanRepository(AppDBContext context, ILogger<KecamatanRepository> logger, IConfiguration configuration){
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<IEnumerable<KecamatanResponseDTO>> GetAllKecamatan()
        {
            try{
                var kecamatanList = new List<KecamatanResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened");
                    
                    string query = @"
                        SELECT
                            kecamatanId,
                            kecamatanName,
                            kecamatanKota,
                        FROM 
                            Kecamatans
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            while (await reader.ReadAsync()){
                                KecamatanResponseDTO kecamatan = new KecamatanResponseDTO{
                                    kecamatanId = reader.GetInt32(0),
                                    kecamatanName = reader.GetString(1),
                                    kecamatanKota = reader.GetInt32(2),
                                };
                                kecamatanList.Add(kecamatan);
                            }
                        }
                    }
                }
                return kecamatanList;
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
        public async Task<KecamatanResponseDTO> GetKecamatanById(int id)
        {
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            kecamatanId,
                            kecamatanName,
                            kecamatanKota,
                        FROM 
                            Kecamatans
                        WHERE
                            kecamatanId = @id
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        command.Parameters.AddWithValue("@id", id);
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            if (await reader.ReadAsync()){
                                KecamatanResponseDTO kecamatan = new KecamatanResponseDTO{
                                    kecamatanId = reader.GetInt32(0),
                                    kecamatanName = reader.GetString(1),
                                    kecamatanKota = reader.GetInt32(2),
                                };
                                _logger.LogDebug("Branch fetched successfully");
                                return kecamatan;
                            }
                            else{
                                _logger.LogWarning("No kecamatan found with the given id: {kecamatanId}", id);
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
    }
}