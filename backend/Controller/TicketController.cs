using Microsoft.AspNetCore.Mvc;
using qrmanagement.backend.Repositories;

namespace qrmanagement.backend.DTO.Ticket{
    [Route("api/ticket")]
    [ApiController]
    public class TicketController : ControllerBase{
        private readonly ITicketRepository _ticketRepo;
        private readonly ILogger<TicketController> _logger;
        public TicketController(ITicketRepository ticketRepository, ILogger<TicketController> logger){
            _ticketRepo = ticketRepository;
            _logger = logger;
        }

        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<TicketResponseDTO>>> Index(){
            var tickets = await _ticketRepo.GetAllTicket();
            if(tickets == null){
                return NotFound();
            }
            _logger.LogDebug("Berhasil");
            return Ok(tickets);
        }

        [HttpGet("by-id/{id}")]
        public async Task<ActionResult<TicketResponseDTO>> GetTicketById(string id){
            var ticket = await _ticketRepo.GetTicketById(id);
            if(ticket == null){
                return NotFound();
            }
            return Ok(ticket);
        }

        [HttpGet("by-origin/{id}")]
        public async Task<ActionResult<IEnumerable<TicketResponseDTO>>> GetTicketByOrigin(int id){
            var tickets = await _ticketRepo.GetTicketByOrigin(id);
            if(tickets == null){
                return NotFound();
            }
            return Ok(tickets);
        }

        [HttpGet("by-move-status")]
        public async Task<ActionResult<IEnumerable<TicketResponseDTO>>> GetTicketByMoveStatus([FromQuery] string status){
            var tickets = await _ticketRepo.GetTicketByMoveStatus(status);
            if(tickets == null){
                return NotFound();
            }
            return Ok(tickets);
        }
        
        [HttpGet("by-approval-status")]
        public async Task<ActionResult<IEnumerable<TicketResponseDTO>>> GetTicketByApprovalStatus([FromQuery] string status){
            var tickets = await _ticketRepo.GetTicketByApprovalStatus(status);
            if(tickets == null){
                return NotFound();
            }
            return Ok(tickets);
        }

        [HttpPost("create")]
        public 
    }
}
