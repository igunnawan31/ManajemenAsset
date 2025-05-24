using qrmanagement.backend.Models;
namespace qrmanagement.backend.DTO.Ticket{
    public class UpdateTicketDTO{
        public required string ticketNumber {get; set;}
        public required int branchOrigin {get; set;}
        public required int branchDestination {get; set;}
        public required DateOnly dateRequested {get; set;}
        public required int receivedBy {get; set;}
        public required int requestedBy {get; set;}
    }
}
