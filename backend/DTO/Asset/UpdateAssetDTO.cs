using qrmanagement.backend.Models;

namespace qrmanagement.backend.DTO.Asset{
    public class UpdateAssetDTO
    {
        public required string id { get; set; }
        public string? name { get; set; }
        public int? locationId { get; set; }
        public assetType? assetType { get; set; }
        public managementStatus? itemStatus { get; set; }
    }

}
