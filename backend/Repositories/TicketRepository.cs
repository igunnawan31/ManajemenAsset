using System.Data;
using Microsoft.Data.SqlClient;
using qrmanagement.backend.Context;
using qrmanagement.backend.DTO.Ticket;
using qrmanagement.backend.Models;
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
                var ticketList = new List<TicketResponseDTO>();
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
                                    ticketNumber = reader.GetString(0),
                                    quantity = reader.GetInt32(1),
                                    branchOrigin = reader.GetInt32(2),
                                    branchDestination = reader.GetInt32(3),
                                    outboundDate = DateOnly.FromDateTime(reader.GetDateTime(4)),
                                    inboundDate = DateOnly.FromDateTime(reader.GetDateTime(5)),
                                    dateRequested = DateOnly.FromDateTime(reader.GetDateTime(6)),
                                    approvalStatus = Enum.Parse<approvalStatus>(reader.GetString(7)),
                                    moveStatus = Enum.Parse<moveStatus>(reader.GetString(8))
                                };
                                ticketList.Add(asset);
                            }
                        }
                    }

                }
                return ticketList;
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while retrieving ticket data from the database");
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