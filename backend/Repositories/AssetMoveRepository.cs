using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal;
using qrmanagement.backend.Context;
using qrmanagement.backend.DTO.Asset;
using qrmanagement.backend.DTO.AssetMove;
using qrmanagement.backend.Models;

namespace qrmanagement.backend.Repositories{
    public class AssetMoveRepository : IAssetMoveRepository{
        private readonly AppDBContext _context;
        private readonly ILogger<AssetMoveRepository> _logger;
        private readonly IConfiguration _configuration;
        private const string UploadsFolder = "uploads/asset";
        public AssetMoveRepository(AppDBContext context, ILogger<AssetMoveRepository> logger, IConfiguration configuration){
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        Task<IEnumerable<AssetMoveResponseDTO>> IAssetMoveRepository.GetAllAssetMove()
        {
            throw new NotImplementedException();
        }

        Task<IEnumerable<AssetMoveResponseDTO>> IAssetMoveRepository.GetAssetMoveByTN(string ticketNumber)
        {
            throw new NotImplementedException();
        }

        Task<IEnumerable<AssetMoveResponseDTO>> IAssetMoveRepository.GetAssetMoveByAN(string assetNumber)
        {
            throw new NotImplementedException();
        }

        Task<IEnumerable<AssetMoveResponseDTO>> IAssetMoveRepository.GetAssetMoveStatus(string status)
        {
            throw new NotImplementedException();
        }

        Task<IEnumerable<AssetMoveResponseDTO>> IAssetMoveRepository.GetAssetMoveByLocationId(int locationId)
        {
            throw new NotImplementedException();
        }

        Task<IEnumerable<AssetMoveResponseDTO>> IAssetMoveRepository.GetAssetByTicketNumber(string ticketNumber)
        {
            throw new NotImplementedException();
        }

        Task<int> IAssetMoveRepository.AddAssetMove(IEnumerable<string> assetNumbers, string ticketNumber)
        {
            throw new NotImplementedException();
        }

        Task<int> IAssetMoveRepository.UpdateAssetMoveStatuses(IEnumerable<UpdateAssetMoveStatusDTO> assets)
        {
            throw new NotImplementedException();
        }
    }
}