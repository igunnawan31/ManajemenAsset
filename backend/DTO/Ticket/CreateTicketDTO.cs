using qrmanagement.backend.Models;
namespace qrmanagement.backend.DTO.Ticket{
    public class CreateTicketDTO{
        public required int branchOrigin {get; set;}
        public required int branchDestination {get; set;}
        public DateOnly outboundDate {get; set;}
        public DateOnly inboundDate {get; set;}
        public required DateOnly dateRequested {get; set;}
        public required approvalStatus approvalStatus {get; set;}
        public required ticketMoveStatus moveStatus {get; set;}
    }
}
