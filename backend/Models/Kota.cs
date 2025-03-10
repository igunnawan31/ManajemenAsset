using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qrmanagement.backend.Models{
    public class Kota {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int kotaId {get; set;}
        [Required]
        public required string kotaName {get; set;}
    }
}