namespace qrmanagement.backend.DTO.Ticket{
    public class UpdateTicketStatusDTO {
        public required string ticketNumber { get; set; }
        public required string status { get; set; } // jangan pake enum, ini status buat universal soalnya, move sama approval
        public string? reason {get; set;} // field hanya untuk kasus ticket reject
    }
}
