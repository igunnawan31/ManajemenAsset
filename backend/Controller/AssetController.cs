using Microsoft.AspNetCore.Mvc;
using qrmanagement.backend.DTO.Asset;
using qrmanagement.backend.Repositories;

namespace qrmanagement.backend.Controllers{
    [Route("api/asset")]
    [ApiController]
    public class AssetController : ControllerBase{
        private readonly IAssetRepository _assetRepo;
        private readonly ILogger<AssetController> _logger;
        public AssetController(IAssetRepository assetRepository, ILogger<AssetController> logger){
            _assetRepo = assetRepository;
            _logger = logger;
        }

        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<AssetResponseDTO>>> Index(){
            var assets = await _assetRepo.GetAllAsset();
            if(assets == null){
                return NotFound();
            }
            _logger.LogDebug("Berhasil");
            return Ok(assets);
        }

        [HttpGet("by-id/{id}")]
        public async Task<ActionResult<AssetResponseDTO>> GetAssetById(string id){
            var asset = await _assetRepo.GetAssetById(id);
            if(asset == null){
                return NotFound();
            }
            return Ok(asset);
        }

        [HttpGet("by-branch/{id}")]
        public async Task<ActionResult<IEnumerable<AssetResponseDTO>>> GetAssetByBranchId(int id){
            var assets = await _assetRepo.GetAssetByLocationId(id);
            if(assets == null){
                return NotFound();
            }
            return Ok(assets);
        }

        [HttpGet("by-ticket/{id}")]
        public async Task<ActionResult<IEnumerable<AssetResponseDTO>>> GetAssetByTicketNumber(string id){
            var assets = await _assetRepo.GetAssetByTicketNumber(id);
            if(assets == null){
                return NotFound();
            }
            return Ok(assets);
        }

        [HttpPost("create")]
        public async Task<IActionResult> AddAsset([FromForm] CreateAssetDTO asset){
            int row = await _assetRepo.AddAsset(asset);
            if(row == 0){
                return BadRequest("Failed while creating asset");
            }
            return Ok(new {statusCode = 200, message = "Asset Created Successfully"});
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateAsset([FromForm] UpdateAssetDTO asset){
            int row = await _assetRepo.UpdateAsset(asset);
            if(row == 0){
                return BadRequest("Failed while updating asset");
            }
            return Ok( new {StatusCode = 200, message = "Asset Updated Successfully"});
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteAsset([FromBody] string id){
            int row = await _assetRepo.DeleteAsset(id);
            if(row == 0){
                return BadRequest("Failed while deleting asset");
            }
            return Ok(new {StatusCode = 200, message = "Asset Deleted Successfully"});
        }
    }
}