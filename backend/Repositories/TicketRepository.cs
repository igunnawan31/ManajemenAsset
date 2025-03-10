using Microsoft.Data.SqlClient;
using qrmanagement.backend.Context;
using qrmanagement.backend.DTO.Ticket;
namespace qrmanagement.backend.Repositories{
    public class TicketRepository : ITicketRepository{
        private readonly AppDBContext _context;
        private readonly ILogger<TicketRepository> _logger;
        private readonly IConfiguration _configuration;
        public TicketRepository(AppDBContext context, ILogger<TicketRepository> logger, IConfiguration configuration){
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }
        async Task<IEnumerable<TicketResponseDTO>> GetAllTicket(){
            try{
                var assetList = new List<TicketResponseDTO>();
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
                                TicketResponseDTO asset = new TicketResponseDTO{
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
        Task <TicketResponseDTO> GetTicketById(string id);
        Task <IEnumerable<TicketResponseDTO>> GetTicketByLocationId(int locationId);
        Task <IEnumerable<TicketResponseDTO>> GetActiveTicket(string status);
        Task <IEnumerable<TicketResponseDTO>> GetCompletedTicket(string status);
        Task <IEnumerable<TicketResponseDTO>> GetNotStartedTicket(string status);
        Task <IEnumerable<TicketResponseDTO>> GetRejectedTicket(string status);
        Task <IEnumerable<TicketResponseDTO>> GetApprovedTicket(string status);
        Task <IEnumerable<TicketResponseDTO>> GetPendingTicket(string status);
        Task <int> AddTicket(CreateTicketDTO ticket);
        Task <int> UpdateTicket(UpdateTicketDTO ticket);
        Task <int> UpdateTicketMoveStatus(UpdateTicketDTO ticket);
        Task <int> UpdateTicketApprovalStatus(UpdateTicketDTO ticket);
        Task <int> DeleteTicket(string id);
    }
}