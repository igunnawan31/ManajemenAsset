using qrmanagement.backend.DTO.User;
using qrmanagement.backend.Models;

namespace qrmanagement.backend.Repositories 
{
    public interface IUserRepository
    {
        User Create (User user);
        User GetByEmail (string email);
        Task<IEnumerable<UserResponseDTO>> GetAllUsers();
        Task<UserResponseDTO> GetUserById(int id);
        Task <int> AddUser(UserRequestDTO user);
        Task <int> UpdateUser(UpdateUser user);
        Task <int> DeleteUser(int id);
    }
}