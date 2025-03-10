using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace qrmanagement.backend.Models{
    public class Branch{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public required int branchId {get; set;}
        [Required]
        public required string branchName {get; set;}
        [Required]
        [EmailAddress]
        public required string branchEmail {get; set;}
        [Phone]
        [Required]
        public required string branchPhone {get; set;}
        [Required]
        public required int kotaId {get; set;}
        [Required]
        public required int kecamatanId {get; set;}
        [Required]
        public required string branchLocation {get; set;}
        [AllowNull]
        public int? parentId {get; set;}
        [ForeignKey("kotaId")]
        public Kota branchKota {get; set;} = null!;
        [ForeignKey("kecamatanId")]
        public Kecamatan branchKecamatan {get; set;} = null!;

        // Relation
        public ICollection<Asset> assets {get; set;} = new List<Asset>();
        public ICollection<Ticket> inbounds {get; set;} = new List<Ticket>();
        public ICollection<Ticket> outbounds {get; set;} = new List<Ticket>();
        public ICollection<User> users {get; set;} = new List<User>();
    }
}