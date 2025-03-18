using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using qrmanagement.backend.Models;

namespace qrmanagement.backend.Services
{
   public class JwtService
   {
        private string secureKey = "qrmanagement is a project for Praktik Kerja Lapangan in Astragraphia";

        public string generate(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secureKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.userEmail),
                new Claim("role", user.userRole.ToString()),
                new Claim("subRole", user.userSubRole.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: "http://localhost:5199",
                audience: "http://localhost:3000",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(5),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
}

        public JwtSecurityToken verify(string jwt)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secureKey);
            tokenHandler.ValidateToken(jwt, new TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey = true,
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true 
            }, out SecurityToken validatedToken);

            return (JwtSecurityToken) validatedToken;
        }

        internal object GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secureKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.userEmail),
                new Claim("role", user.userRole.ToString()),
                new Claim("subRole", user.userSubRole.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: "http://localhost:5199",
                audience: "http://localhost:3000",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(5),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    } 
}