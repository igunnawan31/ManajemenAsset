using qrmanagement.backend.Models;

namespace qrmanagement.backend.DTO.AssetMove{
    public class AssetMoveResponseDTO{
        public required int id {get; set;}
        public required string ticketNumber {get; set;}
        public required string assetNumber {get; set;}
        public required string moveStatus {get; set;}

    }
}