using qrmanagement.backend.Models;

namespace qrmanagement.backend.DTO.Asset{
    public class AssetRequestDTO{
        public required string id {get; set;}
        public required string name {get; set;}
        public required int locationId {get; set;}
        public required assetType assetType {get; set;}
        public required managementStatus itemStatus {get; set;}
        public required IFormFile image {get; set;}
    }
}