using Microsoft.AspNetCore.Mvc;
using qrmanagement.backend.DTO.Branch;
using qrmanagement.backend.Repositories;

namespace qrmanagement.backend.Controllers{
    [Route("api/branch")]
    [ApiController]
    public class BranchController : ControllerBase{
        private readonly IBranchRepository _branchRepo;
        private readonly ILogger<BranchController> _logger;
        public BranchController(IBranchRepository branchRepository, ILogger<BranchController> logger){
            _branchRepo = branchRepository;
            _logger = logger;
        }

        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<BranchResponseDTO>>> Index(){
            var branches = await _branchRepo.GetAllBranch();
            if(branches == null){
                return NotFound();
            }
            _logger.LogDebug("Berhasil");
            return Ok(branches);
        }

        [HttpGet("by-id/{id}")]
        public async Task<ActionResult<BranchResponseDTO>> GetBranchById(int id){
            var branch = await _branchRepo.GetBranchById(id);
            if(branch == null){
                return NotFound();
            }
            return Ok(branch);
        }

        [HttpGet("parent/{id}")]
        public async Task<ActionResult<BranchResponseDTO>> GetBranchParent(int id){
            var branch = await _branchRepo.GetBranchParent(id);
            if(branch == null){
                return NotFound();
            }
            return Ok(branch);
        }

        [HttpPost("create")]
        public async Task<IActionResult> AddBranch([FromForm] CreateBranchDTO branch){
            int row = await _branchRepo.AddBranch(branch);
            if(row == 0){
                return BadRequest("Failed while creating branch");
            }
            return Ok(new {statusCode = 200, message = "Branch Created Successfully"});
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateBranch([FromForm] UpdateBranchDTO branch){
            int row = await _branchRepo.UpdateBranch(branch);
            if(row == 0){
                return BadRequest("Failed while updating branch");
            }
            return Ok( new {StatusCode = 200, message = "Branch Updated Successfully"});
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteBranch([FromBody] int id){
            int row = await _branchRepo.DeleteBranch(id);
            if(row == 0){
                return BadRequest("Failed while deleting branch");
            }
            return Ok(new {StatusCode = 200, message = "Branch Deleted Successfully"});
        }
    }
}