using qrmanagement.backend.Models;

namespace qrmanagement.backend.DTO.Asset{
    public class CreateAssetDTO{
        public required string id {get; set;}
        public required string name {get; set;}
        public required int locationId {get; set;}
        public required string assetType {get; set;}
        public required string itemStatus {get; set;}
        public required IFormFile image {get; set;}
    }
}