using Microsoft.AspNetCore.Mvc;
using qrmanagement.backend.DTO.Ticket;
using qrmanagement.backend.Models;
using qrmanagement.backend.Repositories;
using qrmanagement.backend.Services;

namespace qrmanagement.backend.Controllers{
    [Route("api/ticket")]
    [ApiController]
    public class TicketController : ControllerBase{
        private readonly ITicketRepository _ticketRepo;
        private readonly TicketService _ticketService;
        private readonly ILogger<TicketController> _logger;
        public TicketController(ITicketRepository ticketRepository, ILogger<TicketController> logger, TicketService ticketService){
            _ticketRepo = ticketRepository;
            _logger = logger;
            _ticketService = ticketService;
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

        // [HttpPost("create")]
        // public async Task<ActionResult> CreateTicket ([FromForm] CreateTicketDTO ticketDTO){
        //     var ticketNumber = await _ticketService.GenerateTicketNumberAsync(ticketDTO.dateRequested);
        //     Ticket ticket = new Ticket{
        //         ticketNumber = ticketNumber,
        //         branchOrigin = ticketDTO.branchOrigin,
        //         branchDestination = ticketDTO.branchDestination,
        //         outboundDate = ticketDTO.outboundDate,
        //         inboundDate = ticketDTO.inboundDate,
        //         dateRequested = ticketDTO.dateRequested,
        //         approvalStatus = ticketDTO.approvalStatus,
        //         moveStatus = ticketDTO.moveStatus
        //     };
        //     int row = await _ticketRepo.AddTicket(ticket);
        //     if(row == 0){
        //         return BadRequest("Failed while creating ticket");
        //     }
        //     return Ok(new {statusCode = 200, message = "Ticket Created Successfully"});
        // }

        [HttpPost("create")]
        public async Task<ActionResult> CreateTicket ([FromBody] CreateTicketDTO ticketDTO){
            var ticketNumber = await _ticketService.GenerateTicketNumberAsync(ticketDTO.dateRequested);
            bool success = await _ticketService.CreateTicketWithAssetsAsync(ticketDTO, ticketNumber, ticketDTO.assetNumbers);
            if(!success){
                return BadRequest("Failed while creating ticket");
            }
            return Ok(new {statusCode = 200, message = "Ticket Created Successfully"});
        }

        [HttpPut("update")]
        public async Task<ActionResult> UpdateTicket ([FromBody] UpdateTicketDTO ticketDTO){
            int row = await _ticketRepo.UpdateTicket(ticketDTO);
            if(row == 0){
                return BadRequest("Failed while updating ticket");
            }
            return Ok( new {StatusCode = 200, message = "Ticket Updated Successfully"});
        
        }
        
        [HttpPut("update-move")]
        public async Task<ActionResult> UpdateTicketMove ([FromBody] UpdateTicketStatusDTO ticket){
            int row = await _ticketRepo.UpdateTicketMoveStatus(ticket);
            if(row == 0){
                return BadRequest("Failed while updating ticket move status");
            }
            return Ok( new {StatusCode = 200, message = "Ticket Move Status Updated Successfully"});
        }

        [HttpPut("update-approval")]
        public async Task<ActionResult> UpdateTicketApproval ([FromBody] UpdateTicketStatusDTO ticket){
            int row = await _ticketRepo.UpdateTicketApprovalStatus(ticket);
            if(row == 0){
                return BadRequest("Failed while updating ticket approval status");
            }
            return Ok( new {StatusCode = 200, message = "Ticket Approval Status Updated Successfully"});
        }
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteTicket([FromBody] string id){
            int row = await _ticketRepo.DeleteTicket(id);
            if(row == 0){
                return BadRequest("Failed while deleting ticket");
            }
            return Ok(new {StatusCode = 200, message = "Ticket Deleted Successfully"});
        }

        [HttpPost("decline")]
        public async Task<IActionResult> DeclineTicket([FromBody] UpdateTicketStatusDTO ticket){
            bool success = await _ticketService.RejectTicket(ticket);
            if(!success){
                return BadRequest("Failed while rejecting a ticket");
            }
            return Ok(new {statusCode = 200, message = "Ticket Rejected Successfully"});
        }
    }
}
