using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qrmanagement.backend.Models{
    public class Kecamatan {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int kecamatanId {get; set;}
        [Required]
        public required string kecamatanName {get; set;}
        [Required]
        public required int kotaId {get; set;}
        [ForeignKey("kotaId")]
        public Kota kecamatanKota {get; set;} = null!;
        public ICollection<Branch> Branches {get; set;} = new List<Branch>();
    }
}