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
                                    branchOrigin = reader.GetInt32(1),
                                    branchDestination = reader.GetInt32(2),
                                    outboundDate = DateOnly.FromDateTime(reader.GetDateTime(3)),
                                    inboundDate = DateOnly.FromDateTime(reader.GetDateTime(4)),
                                    dateRequested = DateOnly.FromDateTime(reader.GetDateTime(5)),
                                    approvalStatus = reader.GetString(6),
                                    moveStatus = reader.GetString(7)
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
                                    branchOrigin = reader.GetInt32(1),
                                    branchDestination = reader.GetInt32(2),
                                    outboundDate = DateOnly.FromDateTime(reader.GetDateTime(3)),
                                    inboundDate = DateOnly.FromDateTime(reader.GetDateTime(4)),
                                    dateRequested = DateOnly.FromDateTime(reader.GetDateTime(5)),
                                    approvalStatus = reader.GetString(6),
                                    moveStatus = reader.GetString(7)
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
                                    branchOrigin = reader.GetInt32(1),
                                    branchDestination = reader.GetInt32(2),
                                    outboundDate = DateOnly.FromDateTime(reader.GetDateTime(3)),
                                    inboundDate = DateOnly.FromDateTime(reader.GetDateTime(4)),
                                    dateRequested = DateOnly.FromDateTime(reader.GetDateTime(5)),
                                    approvalStatus = reader.GetString(6),
                                    moveStatus = reader.GetString(7)
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
                                    branchOrigin = reader.GetInt32(1),
                                    branchDestination = reader.GetInt32(2),
                                    outboundDate = DateOnly.FromDateTime(reader.GetDateTime(3)),
                                    inboundDate = DateOnly.FromDateTime(reader.GetDateTime(4)),
                                    dateRequested = DateOnly.FromDateTime(reader.GetDateTime(5)),
                                    approvalStatus = reader.GetString(6),
                                    moveStatus = reader.GetString(7)
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
                                    branchOrigin = reader.GetInt32(1),
                                    branchDestination = reader.GetInt32(2),
                                    outboundDate = DateOnly.FromDateTime(reader.GetDateTime(3)),
                                    inboundDate = DateOnly.FromDateTime(reader.GetDateTime(4)),
                                    dateRequested = DateOnly.FromDateTime(reader.GetDateTime(5)),
                                    approvalStatus = reader.GetString(6),
                                    moveStatus = reader.GetString(7)
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

        public async Task<int> AddTicket(CreateTicketDTO ticket, string ticketNumber){
            _logger.LogDebug("Adding ticket to the database.");

            try{
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = await connection.BeginTransactionAsync()){
                        try{
                            string insertTicketQuery = @"
                                INSERT INTO Tickets 
                                    (ticketNumber, branchOrigin, branchDestination, outboundDate, inboundDate, dateRequested, approvalStatus, moveStatus)
                                VALUES
                                    (@ticketNumber, @branchOrigin, @branchDestination, @outboundDate, @inboundDate, @dateRequested, @approvalStatus, @moveStatus);
                            ";
                             
                            using (var ticketCommand = new SqlCommand(insertTicketQuery, connection, (SqlTransaction)transaction)){
                                ticketCommand.Parameters.AddWithValue("@ticketNumber", ticketNumber);
                                ticketCommand.Parameters.AddWithValue("@branchOrigin", ticket.branchOrigin);
                                ticketCommand.Parameters.AddWithValue("@branchDestination", ticket.branchDestination);
                                ticketCommand.Parameters.AddWithValue("@dateRequested", ticket.dateRequested);
                                ticketCommand.Parameters.AddWithValue("@approvalStatus", ticket.approvalStatus);
                                ticketCommand.Parameters.AddWithValue("@moveStatus", ticketMoveStatus.Not_Started.ToString());

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
                        try
                        {
                            // TO DO: check status, cuma ticket dengan status draft yang bisa diupdate
                            // DONE
                            string checkStatusQuery = @"
                                SELECT
                                    t.approvalStatus
                                FROM 
                                    Tickets t
                                WHERE
                                    t.ticketNumber = @id
                            ";
                            using (var checkMoveCommand = new SqlCommand(checkStatusQuery, connection, (SqlTransaction)transaction)){
                                checkMoveCommand.Parameters.AddWithValue("@id", ticket.ticketNumber);
                                using (SqlDataReader reader = (SqlDataReader) await checkMoveCommand.ExecuteReaderAsync()){
                                    if (await reader.ReadAsync()) // Pastikan ada data sebelum memanggil reader.GetString(0)
                                    {
                                        if (!(Enum.Parse<approvalStatus>(reader.GetString(0)) == approvalStatus.Draft)){
                                            throw new Exception("Ticket has been sent. Cannot be updated");
                                        }
                                    }
                                    else
                                    {
                                        throw new Exception("Ticket not found");
                                    }
                                }
                            }

                            string updateQuery = @"
                                UPDATE 
                                    Tickets
                                SET
                                    branchDestination = @branchDestination,
                                    outboundDate = @outboundDate,
                                    inboundDate = @inboundDate
                                WHERE
                                    ticketNumber = @ticketNumber
                            ";

                            using (var ticketCommand = new SqlCommand(updateQuery, connection, transaction)){
                                ticketCommand.Parameters.AddWithValue("@branchDestination", ticket.branchDestination);
                                ticketCommand.Parameters.AddWithValue("@outboundDate", ticket.outboundDate);
                                ticketCommand.Parameters.AddWithValue("@inboundDate", ticket.inboundDate);
                                ticketCommand.Parameters.AddWithValue("@ticketNumber", ticket.ticketNumber);

                                rowsAffected = await ticketCommand.ExecuteNonQueryAsync();
                            }

                            _logger.LogDebug("Successfuly updated ticket");
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

                _logger.LogDebug("Ticket successfully updated");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while updating ticket");    
            }
            catch (Exception ex){
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
                        try
                        {
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
                            
                            // TO DO: query buat update semua move status assetmove yang terkait sama ticketnumbernya
                            // NOT NEEDED KARENA UPDATE MOVE STATUS ASSET MOVE HARUS PER ITEM
                            
                            // TO DO: modify inbound & outbound date kalau move status berubah
                            // DONE

                            string updateDate;
                            DateOnly date = DateOnly.FromDateTime(DateTime.Now);
                            if(ticket.status == "Completed"){
                                updateDate = @"
                                    UPDATE
                                        Tickets
                                    SET
                                        inboundDate = @date
                                    WHERE
                                        ticketNumber = @ticketNumber
                                ";
                            } 
                            else{
                                updateDate = @"
                                    UPDATE
                                        Tickets
                                    SET
                                        outboundDate = @date
                                    WHERE
                                        ticketNumber = @ticketNumber
                                ";
                            }
                            using(var assetMoveCommand = new SqlCommand(updateDate, connection, transaction)){
                                assetMoveCommand.Parameters.AddWithValue("@ticketNumber", ticket.ticketNumber);
                                assetMoveCommand.Parameters.AddWithValue("@date", date);
                                
                                rowsAffected = await assetMoveCommand.ExecuteNonQueryAsync();
                            }
                            _logger.LogDebug("Successfuly updated ticket");
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

                _logger.LogDebug("Ticket successfully updated");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while updating ticket");    
            }
            catch (Exception ex){
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
                        try
                        {
                            string updateQuery = @"
                                UPDATE 
                                    Tickets
                                SET
                                    approvalStatus = @approvalStatus
                                    reason = @reason
                                    dateApproved = @dateApproved
                                WHERE
                                    ticketNumber = @ticketNumber
                            ";

                            using (var ticketCommand = new SqlCommand(updateQuery, connection, transaction)){
                                ticketCommand.Parameters.AddWithValue("@approvalStatus", ticket.status);
                                ticketCommand.Parameters.AddWithValue("@reason", ticket.reason);
                                ticketCommand.Parameters.AddWithValue("@ticketNumber", ticket.ticketNumber);
                                ticketCommand.Parameters.AddWithValue("@dateApproved", ticket.dateApproved);
                                
                                rowsAffected = await ticketCommand.ExecuteNonQueryAsync();
                            }

                            _logger.LogDebug("Successfuly updated ticket");
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

                _logger.LogDebug("Ticket successfully updated");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while updating ticket");    
            }
            catch (Exception ex){
                _logger.LogError(ex, "An error occurred while updating ticket.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            }
        }
        public async Task <int> DeleteTicket(string id){
            _logger.LogDebug("Deleting ticket from the database");

            int rowsAffected = 0;
            try
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
                using (var connection = new SqlConnection(connectionString)){
                    await connection.OpenAsync();

                    using (var transaction = await connection.BeginTransactionAsync()){ 
                        try
                        {// kalo error, ganti jadi begintransaction dan hapus await setelah itu hapus cast di transaction sql command dst.
                            string checkStatusQuery = @"
                                SELECT
                                    t.approvalStatus
                                FROM 
                                    Tickets t
                                WHERE
                                    t.ticketNumber = @id
                            ";
                            using (var checkMoveCommand = new SqlCommand(checkStatusQuery, connection, (SqlTransaction)transaction)){
                                checkMoveCommand.Parameters.AddWithValue("@id", id);
                                using (SqlDataReader reader = (SqlDataReader) await checkMoveCommand.ExecuteReaderAsync()){
                                    if (await reader.ReadAsync()) // Pastikan ada data sebelum memanggil reader.GetString(0)
                                    {
                                        if (!(Enum.Parse<approvalStatus>(reader.GetString(0)) == approvalStatus.Draft)){
                                            throw new Exception("Ticket has been sent. Cannot be deleted");
                                        }
                                    }
                                    else
                                    {
                                        throw new Exception("Ticket not found");
                                    }
                                }
                            }
                            // TO DO: delete semua asset move yang terkait ticketnya
                            // DONE
                            string deleteAssetMoveQuery = @"
                                DELETE FROM
                                    AssetMoves
                                WHERE
                                    ticketNumber = @id
                            ";

                            using (var assetMoveCommand = new SqlCommand(deleteAssetMoveQuery, connection, (SqlTransaction)transaction)){
                                assetMoveCommand.Parameters.AddWithValue("@id", id);

                                rowsAffected = await assetMoveCommand.ExecuteNonQueryAsync();
                            }

                            string deleteTicketQuery = @"
                                DELETE FROM
                                    Tickets
                                WHERE
                                    ticketNumber = @id
                            ";


                            using (var ticketCommand = new SqlCommand(deleteTicketQuery, connection, (SqlTransaction)transaction)){
                                ticketCommand.Parameters.AddWithValue("@id", id);

                                rowsAffected = await ticketCommand.ExecuteNonQueryAsync();
                            }
                            _logger.LogDebug("Successfuly deleted Ticket");
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

                _logger.LogDebug("Ticket successfully deleted.");
                return rowsAffected;          
            }
            catch (SqlException sqlEx){
                _logger.LogError($"An error occured: {sqlEx.Message}");
                throw new Exception("An error occured while deleting ticket");    
            }
            catch (Exception ex){
                _logger.LogError(ex, "An error occurred while deleting ticket.");
                _logger.LogError("Stacktrace:");
                _logger.LogError(ex.StackTrace);

                throw new Exception("Internal Server Error");
            } 
        }
    }
}