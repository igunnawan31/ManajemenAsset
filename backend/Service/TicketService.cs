using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qrmanagement.backend.Context;
using qrmanagement.backend.DTO.AssetMove;
using qrmanagement.backend.DTO.Ticket;
using qrmanagement.backend.Models;
using qrmanagement.backend.Repositories;

namespace qrmanagement.backend.Services{
    public class TicketService{
        private readonly AppDBContext _context;
        private readonly IAssetMoveRepository _moveRepo;
        private readonly ITicketRepository _ticketRepo;
        private readonly IBranchRepository _branchRepo;

        public TicketService(AppDBContext context, IAssetMoveRepository moveRepository, ITicketRepository ticketRepository, IBranchRepository branchRepository){
            _moveRepo = moveRepository;
            _context = context;
            _ticketRepo = ticketRepository;
            _branchRepo = branchRepository;
        }

        public async Task<string> GenerateTicketNumberAsync(DateOnly dateRequested){
            int count = await _context.Tickets
                .Where(t => t.dateRequested == dateRequested)
                .CountAsync();

            string datePart = dateRequested.ToString("ddMMyy"); 
            string ticketNumPart = $"{(count + 1):D3}";

            return $"TN-{ticketNumPart}-{datePart}";
        }

        public async Task<bool> CreateTicketWithAssetsAsync(CreateTicketDTO ticket, string ticketNumber, IEnumerable<string> assetNumbers)
        {
            int rowsAffectedTicket = await _ticketRepo.AddTicket(ticket, ticketNumber);
            if (rowsAffectedTicket == 0) return false;

            int rowsAffectedMove = await _moveRepo.AddAssetMove(assetNumbers, ticketNumber);
            if (rowsAffectedMove == 0) return false;
            return true;
        }

        public async Task<bool> TicketApproval(UpdateTicketStatusDTO ticket)
        {
            int rowsAffectedTicket = await _ticketRepo.UpdateTicketApprovalStatus(ticket);
            if (ticket.status == "Rejected")
            {
                var assetmovelist = await _moveRepo.GetAssetMoveByTN(ticket.ticketNumber);
                
                if (assetmovelist != null && assetmovelist.Any())
                {
                    var list = assetmovelist.Select(assetmove => new UpdateAssetMoveStatusDTO
                    {
                        assetMoveId = assetmove.id,
                        status = "Rejected"
                    }).ToList();

                    await _moveRepo.UpdateAssetMoveStatuses(list);
                }
            }
            return rowsAffectedTicket > 0;
        }

        public async Task<IEnumerable<TicketResponseDTO>> GetAllTicket()
        {
            var tickets = await _ticketRepo.GetAllTicket();
            foreach (var ticket in tickets)
            {
                ticket.branchOrigin = await _branchRepo.GetBranchNameById(ticket.branchOrigin);
                ticket.branchDestination = await _branchRepo.GetBranchNameById(ticket.branchDestination);
            }
            return tickets;
        }

    }
}

