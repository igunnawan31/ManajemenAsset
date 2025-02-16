using qrmanagement.backend.Models;

namespace qrmanagement.backend.Repositories 
{
    public interface IUserRepository
    {
        User Create (User user);
        User GetByEmail (string email);
    }
}