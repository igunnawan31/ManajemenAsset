using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using qrmanagement.backend.Context;
using qrmanagement.backend.Models;

public class TicketService
{
    private readonly AppDBContext _context;

    public TicketService(AppDBContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateTicketNumberAsync(DateOnly dateRequested)
    {
        int count = await _context.Tickets
            .Where(t => t.dateRequested == dateRequested)
            .CountAsync();

        string datePart = dateRequested.ToString("ddMMyy"); 
        string ticketNumPart = $"{(count + 1):D3}";

        return $"TN-{ticketNumPart}-{datePart}";
    }
}
