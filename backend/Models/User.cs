using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace qrmanagament.backend.Models {
    public class User {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public required int userId{get; set;}
        [Required]
        public required string userName{get; set;}
        [Required]
        [EmailAddress]
        public required string userEmail{get; set;}
        [Required]
        public required int userBranch {get; set;}
        [Phone]
        [Required]
        public required string userPhone{get; set;}
        [Required]
        public required Role userRole {get; set;}
        [Required]
        public required SubRole userSubRole {get; set;}

        [JsonIgnore] public string? password {get; set;}

        [ForeignKey("userBranch")]
        public Branch branch {get; set;} = null!;
    }

    public enum Role{
        Cabang,
        Pusat
    }

    public enum SubRole{
        Kepala_Gudang,
        PIC_Gudang
    }
}

