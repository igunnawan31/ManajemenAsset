using qrmanagement.backend.Models;
namespace qrmanagement.backend.DTO.Ticket{
    public class CreateTicketDTO{
        public required int branchOrigin {get; set;}
        public required int branchDestination {get; set;}
        public required DateOnly dateRequested {get; set;}
        public required string approvalStatus {get; set;}
        public required IEnumerable<string> assetNumbers {get; set;}
    }
}
