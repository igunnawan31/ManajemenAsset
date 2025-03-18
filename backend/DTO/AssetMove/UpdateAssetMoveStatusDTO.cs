using qrmanagement.backend.Models;

namespace qrmanagement.backend.DTO.AssetMove{
    public class UpdateAssetMoveStatusDTO{
        public required string assetMoveId { get; set; }
        public required string status { get; set; }
    }
}