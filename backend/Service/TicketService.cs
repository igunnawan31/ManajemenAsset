using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using qrmanagement.backend.Context;
using qrmanagement.backend.DTO.Ticket;
using qrmanagement.backend.Models;
using qrmanagement.backend.Repositories;

namespace qrmanagement.backend.Services{
    public class TicketService{
        private readonly AppDBContext _context;
        private readonly IAssetMoveRepository _moveRepo;
        private readonly ITicketRepository _ticketRepo;

        public TicketService(AppDBContext context, IAssetMoveRepository moveRepository, ITicketRepository ticketRepository){
            _moveRepo = moveRepository;
            _context = context;
            _ticketRepo = ticketRepository;
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
    }
}

