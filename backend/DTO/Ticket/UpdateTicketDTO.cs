using qrmanagement.backend.Models;
namespace qrmanagement.backend.DTO.Ticket{
    public class UpdateTicketDTO{
        public required string ticketNumber {get; set;}
        public required int quantity {get; set;}
        public required int branchOrigin {get; set;}
        public required int branchDestination {get; set;}
        public DateOnly outboundDate {get; set;}
        public DateOnly inboundDate {get; set;}
    }
}
