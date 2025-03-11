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
        public async Task<IEnumerable<TicketResponseDTO>> GetAllTicket(){
            try{
                var ticketList = new List<TicketResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            ticketNumber,
                            quantity,
                            branchOrigin,
                            branchDestination,
                            outboundDate,
                            inboundDate,
                            dateRequested,
                            approvalStatus,
                            moveStatus
                        FROM 
                            Tickets
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
        public async Task <TicketResponseDTO> GetTicketById(string id){
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            ticketNumber,
                            quantity,
                            branchOrigin,
                            branchDestination,
                            outboundDate,
                            inboundDate,
                            dateRequested,
                            approvalStatus,
                            moveStatus
                        FROM 
                            Tickets
                        WHERE
                            ticketNumber = @id
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        command.Parameters.AddWithValue("@id", id);
                        using (SqlDataReader reader = (SqlDataReader) await command.ExecuteReaderAsync()){
                            _logger.LogDebug("Query executed successfully. Reading data...");

                            if (await reader.ReadAsync()){
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
                                _logger.LogDebug("ticket fetched successfully");
                                return asset;
                            }
                            else{
                                _logger.LogWarning("No ticket found with the given id: {ticketNumber}", id);
                                return null!;
                            }
                        }
                    }

                }
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
        public async Task <IEnumerable<TicketResponseDTO>> GetTicketByOrigin(int locationId){
            try{
                var ticketList = new List<TicketResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            ticketNumber,
                            quantity,
                            branchOrigin,
                            branchDestination,
                            outboundDate,
                            inboundDate,
                            dateRequested,
                            approvalStatus,
                            moveStatus
                        FROM 
                            Tickets
                        WHERE
                            branchOrigin = @locationId
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        command.Parameters.AddWithValue("@locationId", locationId);
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
        public async Task <IEnumerable<TicketResponseDTO>> GetTicketByMoveStatus(string status){
            try{
                var ticketList = new List<TicketResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            ticketNumber,
                            quantity,
                            branchOrigin,
                            branchDestination,
                            outboundDate,
                            inboundDate,
                            dateRequested,
                            approvalStatus,
                            moveStatus
                        FROM 
                            Tickets
                        WHERE
                            moveStatus = @status
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        command.Parameters.AddWithValue("@status", status);
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
        public async Task <IEnumerable<TicketResponseDTO>> GetTicketByApprovalStatus(string status){
            try{
                var ticketList = new List<TicketResponseDTO>();
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                _logger.LogDebug("Connection string retrieved");

                using (SqlConnection connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();
                    _logger.LogDebug("Database connection opened.");

                    string query = @"
                        SELECT
                            ticketNumber,
                            quantity,
                            branchOrigin,
                            branchDestination,
                            outboundDate,
                            inboundDate,
                            dateRequested,
                            approvalStatus,
                            moveStatus
                        FROM 
                            Tickets
                        WHERE
                            approvalStatus = @status
                    ";

                    _logger.LogDebug("Executing query");
                    using (SqlCommand command = new SqlCommand(query, connection)){
                        command.Parameters.AddWithValue("@status", status);
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

        public async Task<int> AddTicket(Ticket ticket){
            _logger.LogDebug("Adding ticket to the database.");

            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = await connection.BeginTransactionAsync()){
                        try{
                            string insertTicketQuery = @"
                                INSERT INTO Tickets 
                                    (ticketNumber, quantity, branchOrigin, branchDestination, outboundDate, inboundDate, dateRequested, approvalStatus, moveStatus)
                                VALUES
                                    (@ticketNumber, @quantity, @branchOrigin, @branchDestination, @outboundDate, @inboundDate, @dateRequested, @approvalStatus, @moveStatus);
                            ";

                            using (var ticketCommand = new SqlCommand(insertTicketQuery, connection, (SqlTransaction)transaction)){
                                ticketCommand.Parameters.AddWithValue("@ticketNumber", ticket.ticketNumber);
                                ticketCommand.Parameters.AddWithValue("@quantity", ticket.quantity);
                                ticketCommand.Parameters.AddWithValue("@branchOrigin", ticket.branchOrigin);
                                ticketCommand.Parameters.AddWithValue("@branchDestination", ticket.branchDestination);
                                ticketCommand.Parameters.AddWithValue("@outboundDate", ticket.outboundDate);
                                ticketCommand.Parameters.AddWithValue("@inboundDate", ticket.inboundDate);
                                ticketCommand.Parameters.AddWithValue("@dateRequested", ticket.dateRequested);
                                ticketCommand.Parameters.AddWithValue("@approvalStatus", ticket.approvalStatus.ToString());
                                ticketCommand.Parameters.AddWithValue("@moveStatus", ticket.moveStatus.ToString());

                                int rowsAffected = await ticketCommand.ExecuteNonQueryAsync();
                                
                                _logger.LogDebug("Successfully added ticket.");

                                await transaction.CommitAsync();
                                return rowsAffected;
                            }
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

        public async Task <int> UpdateTicket(UpdateTicketDTO ticket){
            _logger.LogDebug("Updating ticket data");

            int rowsAffected = 0;
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = connection.BeginTransaction()){
                        string updateQuery = @"
                            UPDATE 
                                Tickets
                            SET
                                quantity = @quantity, 
                                branchDestination = @branchDestination,
                                outboundDate = @outboundDate,
                                inboundDate = @inboundDate
                            WHERE
                                ticketNumber = @ticketNumber
                        ";

                        using (var ticketCommand = new SqlCommand(updateQuery, connection, transaction)){
                            ticketCommand.Parameters.AddWithValue("@quantity", ticket.quantity);
                            ticketCommand.Parameters.AddWithValue("@branchDestination", ticket.branchDestination);
                            ticketCommand.Parameters.AddWithValue("@outboundDate", ticket.outboundDate);
                            ticketCommand.Parameters.AddWithValue("@inboundDate", ticket.inboundDate);
                            ticketCommand.Parameters.AddWithValue("@ticketNumber", ticket.ticketNumber);

                            rowsAffected = await ticketCommand.ExecuteNonQueryAsync();
                        }

                        _logger.LogDebug("Successfuly updated ticket");
                        transaction.Commit();
                    }
                }     

                _logger.LogDebug("Ticket successfully updated");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                // transaction.Rollback();
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while updating ticket");    
            }
            catch (Exception ex){
                // transaction.Rollback();
                _logger.LogError(ex, "An error occurred while updating ticket.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            }  
        }
        public async Task <int> UpdateTicketMoveStatus(UpdateTicketStatusDTO ticket){
            _logger.LogDebug("Updating ticket data");

            int rowsAffected = 0;
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = connection.BeginTransaction()){
                        string updateQuery = @"
                            UPDATE 
                                Tickets
                            SET
                                moveStatus = @moveStatus
                            WHERE
                                ticketNumber = @ticketNumber
                        ";

                        using (var ticketCommand = new SqlCommand(updateQuery, connection, transaction)){
                            ticketCommand.Parameters.AddWithValue("@moveStatus", ticket.status);
                            ticketCommand.Parameters.AddWithValue("@ticketNumber", ticket.ticketNumber);

                            rowsAffected = await ticketCommand.ExecuteNonQueryAsync();
                        }

                        _logger.LogDebug("Successfuly updated ticket");
                        transaction.Commit();
                    }
                }     

                _logger.LogDebug("Ticket successfully updated");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                // transaction.Rollback();
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while updating ticket");    
            }
            catch (Exception ex){
                // transaction.Rollback();
                _logger.LogError(ex, "An error occurred while updating ticket.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            }  
        }
        public async Task <int> UpdateTicketApprovalStatus(UpdateTicketStatusDTO ticket){
            _logger.LogDebug("Updating ticket data");

            int rowsAffected = 0;
            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = connection.BeginTransaction()){
                        string updateQuery = @"
                            UPDATE 
                                Tickets
                            SET
                                approvalStatus = @approvalStatus
                            WHERE
                                ticketNumber = @ticketNumber
                        ";

                        using (var ticketCommand = new SqlCommand(updateQuery, connection, transaction)){
                            ticketCommand.Parameters.AddWithValue("@approvalStatus", ticket.status);
                            ticketCommand.Parameters.AddWithValue("@ticketNumber", ticket.ticketNumber);

                            rowsAffected = await ticketCommand.ExecuteNonQueryAsync();
                        }

                        _logger.LogDebug("Successfuly updated ticket");
                        transaction.Commit();
                    }
                }     

                _logger.LogDebug("Ticket successfully updated");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                // transaction.Rollback();
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while updating ticket");    
            }
            catch (Exception ex){
                // transaction.Rollback();
                _logger.LogError(ex, "An error occurred while updating ticket.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            }
        }
        // public async Task <int> DeleteTicket(string id);
    }
}