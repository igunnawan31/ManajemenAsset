using qrmanagement.backend.Models;

namespace qrmanagement.backend.DTO.Asset{
    public class UpdateAssetDTO
    {
        public required string id { get; set; }
        public string? name { get; set; }
        public int? locationId { get; set; }
        public string? assetType { get; set; }
        public string? itemStatus { get; set; }
    }
}
