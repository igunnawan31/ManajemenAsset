using qrmanagement.backend.DTO.Kecamatan;

namespace qrmanagement.backend.Repositories{
    public interface IKecamatanRepository{
        Task<IEnumerable<KecamatanResponseDTO>> GetAllKecamatan();
        Task<KecamatanResponseDTO> GetKecamatanById(int id);
    }
}