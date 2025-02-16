using qrmanagement.backend.DTO.Asset;

namespace qrmanagement.backend.Repositories{
    public interface IAssetRepository{
        Task<IEnumerable<AssetResponseDTO>> GetAllAsset();
        Task<AssetResponseDTO> GetAssetById(string id);
        Task <IEnumerable<AssetResponseDTO>> GetAssetByLocationId(int locationId);
        Task <IEnumerable<AssetResponseDTO>> GetAssetByTicketNumber(string ticketNumber);
        Task <int> AddAsset(CreateAssetDTO asset);
        Task <int> UpdateAsset(UpdateAssetDTO asset);
    }
}