using qrmanagement.backend.Models;

namespace qrmanagement.backend.DTO.Branch{
    public class BranchResponseDTO{
        public required int branchId {get; set;}
        public required string branchName {get; set;}
        public required string branchEmail {get; set;}
        public required string branchPhone {get; set;}
        public required int kotaId {get; set;}
        public required int kecamatanId {get; set;}
        public required string branchLocation {get; set;}
        public int? parentId {get; set;}
    }
}