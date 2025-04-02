using qrmanagement.backend.Models;
namespace qrmanagement.backend.DTO.Ticket{
    public class TicketResponseDTO{
        public required string ticketNumber {get; set;}
        public required int branchOrigin {get; set;}
        public required int branchDestination {get; set;}
        public DateOnly? outboundDate {get; set;}
        public DateOnly? inboundDate {get; set;}
        public required DateOnly dateRequested {get; set;}
        public required string approvalStatus {get; set;}
        public required string moveStatus {get; set;}
        public required int requestedBy {get; set;}
        public required int receivedBy {get; set;}
        public string? rejectReason {get; set;}
        public string? rejectClassification {get; set;}
        public string? requestReason {get; set;}
    }
}
