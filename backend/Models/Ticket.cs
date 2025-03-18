using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qrmanagement.backend.Models{
    public class Ticket{
        [Key]
        [Required]
        [StringLength(13)]
        public required string ticketNumber {get; set;}
        [Required]
        public required int branchOrigin {get; set;}
        [Required]
        public required int branchDestination {get; set;}
        public DateOnly outboundDate {get; set;}
        public DateOnly inboundDate {get; set;}
        public string? reason {get; set;}
        [Required]
        public required DateOnly dateRequested {get; set;}
        public DateOnly dateApproved {get; set;}
        [Required]
        public required approvalStatus approvalStatus {get; set;}
        [Required]
        public required moveStatus moveStatus {get; set;}

        // Relation
        public ICollection<AssetMove> assetMoves {get; set;} = new List<AssetMove>();
        [ForeignKey("branchOrigin")]
        public Branch origin {get; set;} = null!;
        [ForeignKey("branchDestination")]
        public Branch destination {get; set;} = null!;

    }

    public enum approvalStatus{
        Rejected,
        Approved,
        Pending,
        Draft
    }

    public enum moveStatus{
        Completed,
        In_Progress,
        Not_Started
    }
}