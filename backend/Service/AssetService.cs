using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qrmanagement.backend.Context;
using qrmanagement.backend.DTO.Asset;
using qrmanagement.backend.DTO.AssetMove;
using qrmanagement.backend.DTO.Asset;
using qrmanagement.backend.Models;
using qrmanagement.backend.Repositories;

namespace qrmanagement.backend.Services{
    public class AssetService{
        private readonly AppDBContext _context;
        private readonly IAssetMoveRepository _moveRepo;
        private readonly IAssetRepository _AssetRepo;
        private readonly IAssetRepository _assetRepo;
        private readonly ILogger<AssetService> _logger;
        public AssetService(AppDBContext context, IAssetMoveRepository moveRepository, IAssetRepository AssetRepository, IAssetRepository assetRepository, ILogger<AssetService> logger){
            _moveRepo = moveRepository;
            _context = context;
            _AssetRepo = AssetRepository;
            _assetRepo = assetRepository;
            _logger = logger;
        }

        public async Task<(bool isSuccess, string? errorMessage)> CreateAssetWithMovesAsync(CreateAssetDTO asset)
        {
            try
            {
                int rowsAffectedAsset = await _assetRepo.AddAsset(asset);
                int rowsAffectedMove = await _moveRepo.AddAssetMoveLog(asset.id);
                return (true, null);
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating asset with moves");
                return (false, ex.Message);
            }
        }
    }
}
