using Microsoft.AspNetCore.Mvc;
using qrmanagement.backend.DTO.Kecamatan;
using qrmanagement.backend.Repositories;

namespace qrmanagement.backend.Controllers{
    [Route("api/kecamatan")]
    [ApiController]
    public class KecamatanController : ControllerBase {
        private readonly IKecamatanRepository _kecamatanRepo;
        private readonly ILogger<KecamatanController> _logger;
        public KecamatanController(IKecamatanRepository kecamatanRepository, ILogger<KecamatanController> logger){
            _kecamatanRepo = kecamatanRepository;
            _logger = logger;
        }

        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<KecamatanResponseDTO>>> Index(){
            var kecamatans = await _kecamatanRepo.GetAllKecamatan();
            if(kecamatans == null){
                return NotFound();
            }
            _logger.LogDebug("Berhasil");
            return Ok(kecamatans);
        }

        [HttpGet("by-id/{id}")]
        public async Task<ActionResult<KecamatanResponseDTO>> GetKecamatanById(int id){
            var kecamatan = await _kecamatanRepo.GetKecamatanById(id);
            if(kecamatan == null){
                return NotFound();
            }
            return Ok(kecamatan);
        }

    }
}