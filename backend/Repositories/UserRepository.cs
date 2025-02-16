using qrmanagement.backend.Models;
using qrmanagement.backend.Context;

namespace qrmanagement.backend.Repositories
{
    public class UserRepository: IUserRepository
    {
        private readonly AppDBContext _context;
        public UserRepository(AppDBContext context)
        {
            _context = context;
        }

        public User Create(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        public User GetByEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.userEmail == email)!;
        }
    }
}