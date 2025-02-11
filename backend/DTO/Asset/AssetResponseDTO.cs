using qrmanagament.backend.Models;

namespace qrmanagament.backend.DTO.Asset{
    public class AssetResponseDTO{
        public required string id {get; set;}
        public required string name {get; set;}
        public required int locationId {get; set;}
        public required assetType assetType {get; set;}
        public required managementStatus itemStatus {get; set;}
        public required string imagePath {get; set;}
    }
}