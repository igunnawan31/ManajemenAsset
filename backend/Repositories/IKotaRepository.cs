using qrmanagement.backend.DTO.Kota;

namespace qrmanagement.backend.Repositories{
    public interface IKotaRepository{
        Task<IEnumerable<KotaResponseDTO>> GetAllKota();
        Task<KotaResponseDTO> GetKotaById(int id);
    }
}