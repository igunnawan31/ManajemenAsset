namespace qrmanagement.backend.DTO.Ticket{
    public class PublishTicketDTO{
        public required string ticketNumber {get; set;}
        public required int branchOrigin {get; set;}
        public required int branchDestination {get; set;}
        public required IEnumerable<string> assetNumbers {get; set;}
        public required int receivedBy {get; set;}
        public required int requestedBy {get; set;}
    }
}
