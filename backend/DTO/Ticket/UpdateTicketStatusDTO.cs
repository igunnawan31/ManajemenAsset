namespace qrmanagement.backend.DTO.Ticket{
    public class UpdateTicketStatusDTO {
        public required string ticketNumber { get; set; }
        public required string status { get; set; }
    }
}
