using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qrmanagament.backend.Models{
    public class AssetMove{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public required int id {get; set;}
        [Required]
        public required string ticketNumber {get; set;}
        [Required]
        public required string assetNumber {get; set;}
        [Required]
        public required MoveStatus moveStatus {get; set;}
        [ForeignKey("ticketNumber")]
        public Ticket ticket {get; set;} = null!;
        [ForeignKey("assetNumber")]
        public Asset asset {get; set;} = null!;

    }
    
    public enum MoveStatus{
        Completed,
        Missing, 
        UnComplete
    }
}