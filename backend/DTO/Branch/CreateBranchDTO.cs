namespace qrmanagement.backend.DTO.Branch{
    public class CreateBranchDTO{
        public required string branchName {get; set;}
        public required string branchEmail {get; set;}
        public required string branchPhone {get; set;}
        public required string branchLocation {get; set;}
        public int? parentId {get; set;}
    }
}