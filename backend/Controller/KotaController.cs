using Microsoft.AspNetCore.Mvc;
using qrmanagement.backend.DTO.Kota;
using qrmanagement.backend.Repositories;

namespace qrmanagement.backend.Controllers{
    [Route("api/kota")]
    [ApiController]
    public class KotaController : ControllerBase {
        private readonly IKotaRepository _kotaRepo;
        private readonly ILogger<KotaController> _logger;
        public KotaController(IKotaRepository kotaRepository, ILogger<KotaController> logger){
            _kotaRepo = kotaRepository;
            _logger = logger;
        }

        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<KotaResponseDTO>>> Index(){
            var kotas = await _kotaRepo.GetAllKota();
            if(kotas == null){
                return NotFound();
            }
            _logger.LogDebug("Berhasil");
            return Ok(kotas);
        }

        [HttpGet("by-id/{id}")]
        public async Task<ActionResult<KotaResponseDTO>> GetKotaById(int id){
            var kota = await _kotaRepo.GetKotaById(id);
            if(kota == null){
                return NotFound();
            }
            return Ok(kota);
        }

    }
}