using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace qrmanajament.backend.Models {
    public class User {
        public required string userId{get; set;}
        
        public required string userName{get; set;}
        
        public required string userEmail{get; set;}

        public required string userPhone{get; set;}

        [JsonIgnore] public string? password {get; set;}
    }
}