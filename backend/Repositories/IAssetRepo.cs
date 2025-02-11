using qrmanagament.backend.DTO.Asset;

namespace qrmanagament.backend.Repositories{
    public interface IAssetRepository{
        Task<IEnumerable<AssetResponseDTO>> GetAllAsset();
        Task<AssetResponseDTO> GetAssetById(string bookId);
        Task <IEnumerable<AssetResponseDTO>> GetAssetByLocationId(int locationId);
        Task <IEnumerable<AssetResponseDTO>> GetAssetByTicketNumber(string ticketNumber);
        Task <int> AddAsset(AssetRequestDTO asset);
    }
}