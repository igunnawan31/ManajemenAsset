using qrmanagement.backend.DTO.Branch;

namespace qrmanagement.backend.Repositories{
    public interface IBranchRepository{
        Task<IEnumerable<BranchResponseDTO>> GetAllBranch();
        Task<BranchResponseDTO> GetBranchById(int id);
        Task <int> AddBranch(CreateBranchDTO branch);
        Task <int> UpdateBranch(UpdateBranchDTO branch);
        Task <int> DeleteBranch(int id);
    }
}