using qrmanagement.backend.DTO.AssetMove;

namespace qrmanagement.backend.Repositories{
    public interface IAssetMoveRepository{
        Task<IEnumerable<AssetMoveResponseDTO>> GetAllAssetMove();
        Task <IEnumerable<AssetMoveResponseDTO>> GetAssetMoveByTN(string ticketNumber); // ticket number, ini buat list asset apa aja yang pindah dari ticket yang direquest
        Task <IEnumerable<AssetMoveResponseDTO>> GetAssetMoveByAN(string assetNumber); // asset number, ini buat history si asset udah pindah berapa kali
        Task <IEnumerable<AssetMoveResponseDTO>> GetAssetMoveByStatus(string status);
        Task <int> AddAssetMove (IEnumerable<string> assetNumbers, string ticketNumber);
        Task <int> UpdateAssetMoveStatuses (IEnumerable<UpdateAssetMoveStatusDTO> assets); // each object consists of assetmoveid with the new status
        Task <int> DeleteAssetMoves (IEnumerable<string> ids); 
    }
}