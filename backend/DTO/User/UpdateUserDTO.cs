namespace qrmanagement.backend.Models {
    public class UpdateUser {
        public int userId{get; set;}
        public required string userName{get; set;}
        public required string userEmail{get; set;}
        public required int userBranch {get; set;}
        public required string userPhone{get; set;}
        public required Role userRole {get; set;}
        public required SubRole userSubRole {get; set;}
    }
}

