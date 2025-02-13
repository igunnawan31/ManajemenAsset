using qrmanagement.backend.Models;

namespace qrmanagement.backend.DTO.register 
{
    public class RegisterDTO
    {
        public required int userId{ get; set; }
        public required string userName{ get; set; }
        public required string userEmail{ get; set; }
        public required int userBranch{ get; set; }
        public required string userPhone{ get; set; }
        public required Role userRole{ get; set; }
        public required SubRole userSubRole{ get; set; }
        public required string password{ get; set; }
    }
}