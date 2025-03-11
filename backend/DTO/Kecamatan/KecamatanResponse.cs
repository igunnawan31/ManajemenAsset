using qrmanagement.backend.Models;

namespace qrmanagement.backend.DTO.Kecamatan{
    public class KecamatanResponseDTO{
        public required int kecamatanId {get; set;}
        public required string kecamatanName {get; set;}
        public required int kotaId {get; set;}
    }
}