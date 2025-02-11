using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qrmanagament.backend.Models{
    public class Asset {
        [Key]
        [Required]
        [StringLength(13)]
        public required string id {get; set;}
        [Required]
        public required string name {get; set;}
        [Required]
        public required int locationId {get; set;}
        [Required]
        public required assetType assetType {get; set;}
        [Required]
        public required managementStatus itemStatus {get; set;}
        [Required]
        public required string imagePath {get; set;}

        // Relation
        public ICollection<AssetMove> assetMoves {get; set;} = new List<AssetMove>(); 
        [ForeignKey("locationId")]
        public Branch branch {get; set;} = null!;
    }

    public enum managementStatus{
        Active,
        InActive,
        Missing,
    }

    public enum assetType{
        Electronics,
        Furniture,
        Vehicles,
        Real_Estate,
        Office_Equipment
    }
}