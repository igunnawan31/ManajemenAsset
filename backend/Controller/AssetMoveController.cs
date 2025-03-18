using Microsoft.AspNetCore.Mvc;
using qrmanagement.backend.DTO.AssetMove;
using qrmanagement.backend.Repositories;

namespace qrmanagement.backend.Controllers{
    [Route("api/asset-move")]
    [ApiController]
    public class AssetMoveController : ControllerBase{
        private readonly IAssetMoveRepository _moveRepo;
        private readonly ILogger<AssetMoveController> _logger;
        public AssetMoveController(IAssetMoveRepository assetMoveRepository, ILogger<AssetMoveController> logger){
            _moveRepo = assetMoveRepository;
            _logger = logger;
        }

        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<AssetMoveResponseDTO>>> GetAllAssetMove(){
            var moves = await _moveRepo.GetAllAssetMove();
            if(moves == null){
                return NotFound();
            }
            _logger.LogDebug("Berhasil");
            return Ok(moves);
        }
        [HttpGet("by-TN/{id}")]
        public async Task <ActionResult<IEnumerable<AssetMoveResponseDTO>>> GetAssetMoveByTN(string id){
            // ticket number, ini buat list asset apa aja yang pindah dari ticket yang direquest
            var moves = await _moveRepo.GetAssetMoveByTN(id);
            if(moves == null){
                return NotFound();
            }
            _logger.LogDebug("Berhasil");
            return Ok(moves);
        } 
        
        [HttpGet("by-AN/{id}")]
        public async Task <ActionResult<IEnumerable<AssetMoveResponseDTO>>> GetAssetMoveByAN(string id)
        {// asset number, ini buat history si asset udah pindah berapa kali
            var moves = await _moveRepo.GetAssetMoveByAN(id);
            if(moves == null){
                return NotFound();
            }
            _logger.LogDebug("Berhasil");
            return Ok(moves);
        } 
        
        [HttpGet("by-status")]
        public async Task <ActionResult<IEnumerable<AssetMoveResponseDTO>>> GetAssetMoveByStatus([FromQuery] string status){
            var moves = await _moveRepo.GetAssetMoveByStatus(status);
            if(moves == null){
                return NotFound();
            }
            _logger.LogDebug("Berhasil");
            return Ok(moves);
        }

        [HttpPost("create")]
        public async Task <IActionResult> AddAssetMove ([FromBody] IEnumerable<string> assetNumbers, [FromQuery] string ticketNumber){
            int row = await _moveRepo.AddAssetMove(assetNumbers, ticketNumber);
            if(row == 0){
                return BadRequest("Failed while creating assetmove");
            }
            return Ok(new {statusCode = 200, message = "Assetmove Created Successfully"});        
        }

        [HttpPut("update")]
        public async Task <IActionResult> UpdateAssetMoveStatuses ([FromBody] IEnumerable<UpdateAssetMoveStatusDTO> assets){
            // each object consists of assetmoveid with the new status
            int row = await _moveRepo.UpdateAssetMoveStatuses(assets);
            if(row == 0){
                return BadRequest("Failed while updating assetmove");
            }
            return Ok(new {statusCode = 200, message = "Assetmove Updated Successfully"});       
        }
        
        [HttpDelete("delete")]
        public async Task <IActionResult> DeleteAssetMoves ([FromBody] IEnumerable<string> ids){
            int row = await _moveRepo.DeleteAssetMoves(ids);
            if(row == 0){
                return BadRequest("Failed while deleting assetmove");
            }
            return Ok(new {statusCode = 200, message = "Assetmove Deleted Successfully"}); 
        }
    }
}