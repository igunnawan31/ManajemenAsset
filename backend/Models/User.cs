using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace qrmanagament.backend.Models {
    public class User {
        public required string userId{get; set;}
        
        public required string userName{get; set;}
        
        public required string userEmail{get; set;}

        public required string userPhone{get; set;}
        public required Role userRole {get; set;}
        public required SubRole userSubRole {get; set;}

        [JsonIgnore] public string? password {get; set;}
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

