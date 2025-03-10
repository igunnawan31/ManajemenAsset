using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qrmanagement.backend.Models{
    public class Kecamatan {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int kecamatanId {get; set;}
        [Required]
        public required string kecamatanName {get; set;}
        [ForeignKey("kotaId")]
        public required Kota kecamatanKota {get; set;}
    }
}