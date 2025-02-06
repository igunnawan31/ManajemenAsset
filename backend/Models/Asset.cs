using System.ComponentModel.DataAnnotations;

namespace qrmanagament.backend.Models{
    public class Asset {
        [Key]
        public required string id {get; set;}
        public required string description {get; set;}
        public required string location {get; set;}
    }
}