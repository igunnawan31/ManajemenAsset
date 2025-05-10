using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qrmanagement.backend.Context;
using qrmanagement.backend.DTO.Asset;
using qrmanagement.backend.DTO.AssetMove;
using qrmanagement.backend.DTO.Ticket;
using qrmanagement.backend.Models;
using qrmanagement.backend.Repositories;

namespace qrmanagement.backend.Services{
    public class TicketService{
        private readonly AppDBContext _context;
        private readonly IAssetMoveRepository _moveRepo;
        private readonly ITicketRepository _ticketRepo;
        private readonly IAssetRepository _assetRepo;
        private readonly ILogger<TicketService> _logger;
        public TicketService(AppDBContext context, IAssetMoveRepository moveRepository, ITicketRepository ticketRepository, IAssetRepository assetRepository, ILogger<TicketService> logger){
            _moveRepo = moveRepository;
            _context = context;
            _ticketRepo = ticketRepository;
            _assetRepo = assetRepository;
            _logger = logger;
        }

        public async Task<string> GenerateTicketNumberAsync(DateOnly dateRequested){
            int count = await _context.Tickets
                .Where(t => t.dateRequested == dateRequested)
                .CountAsync();

            string datePart = dateRequested.ToString("ddMMyy"); 
            string ticketNumPart = $"{(count + 1):D3}";

            return $"TN-{ticketNumPart}-{datePart}";
        }

        public async Task<(bool isSuccess, string? errorMessage)> CreateTicketWithAssetsAsync(CreateTicketDTO ticket, string ticketNumber, IEnumerable<string> assetNumbers)
        {
            try
            {
                int rowsAffectedTicket = await _ticketRepo.AddTicket(ticket, ticketNumber);
                if (rowsAffectedTicket == 0) return (false, "Failed to add ticket to database.");

                foreach (var asset in assetNumbers)
                {
                    var status = await _moveRepo.GetAssetLastStatus(asset);
                    if(status == "Missing" || status == "Moving" || status == "Waiting" || status == "Pending"){
                        await _ticketRepo.DeleteWithoutValidation(ticketNumber);
                        return (false, $"Asset {asset} has invalid status: {status}");
                    }
                }

                int rowsAffectedMove = await _moveRepo.AddAssetMove(assetNumbers, ticketNumber, ticket.approvalStatus);
                if (rowsAffectedMove == 0)
                {
                    await _ticketRepo.DeleteWithoutValidation(ticketNumber);
                    return (false, "Failed to assign assets to the ticket.");
                }

                return (true, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateTicketWithAssetsAsync");
                return (false, ex.Message);
            }
        }


        public async Task<bool> TicketApproval(UpdateTicketStatusDTO ticket)
        {
            string status;
            if(ticket.status == "Rejected"){
                status = "Rejected";
            }
            else if (ticket.status == "Approved"){
                status = "Waiting";
            }
            else{
                status = "Pending";
            }
            var assetmovelist = await _moveRepo.GetAssetMoveByTN(ticket.ticketNumber);
            foreach (var item in assetmovelist)
            {
                _logger.LogDebug("ID = \n"+item.id.ToString());
                _logger.LogDebug("Status = \n"+item.moveStatus);
            }
            if(status == "Pending"){
                // Check if every asset is available 
                foreach (var asset in assetmovelist)
                {
                    _logger.LogDebug("Checking asset {assetNumber} for ticket {ticketNumber}", asset.assetNumber, ticket.ticketNumber);
                    var assetStatus = await _moveRepo.GetAssetLastStatus(asset.assetNumber);
                    if(assetStatus == "Missing" || assetStatus == "Moving" || assetStatus == "Waiting" || assetStatus == "Pending"){
                        _logger.LogError("Asset {assetNumber} has invalid status: {status}", asset.assetNumber, assetStatus);
                        UpdateTicketStatusDTO tempTicket = new UpdateTicketStatusDTO
                        {
                            ticketNumber = ticket.ticketNumber,
                            status = "Draft"
                        };
                        await _ticketRepo.UpdateTicketApprovalStatus(tempTicket);
                        return false;
                    }
                }
                _logger.LogDebug("All assets are available for ticket {ticketNumber}", ticket.ticketNumber);            
            }
            if (assetmovelist == null || !assetmovelist.Any()){
                _logger.LogDebug("Ticket {ticketNumber} has no asset moves", ticket.ticketNumber);
                return false;
            }
            var list = assetmovelist!.Select(assetmove => new UpdateAssetMoveStatusDTO
            {
                assetMoveId = assetmove.id,
                status = status
            }).ToList();

            int rowsAffectedTicket = await _moveRepo.UpdateAssetMoveStatuses(list);
            rowsAffectedTicket = await _ticketRepo.UpdateTicketApprovalStatus(ticket);
            return rowsAffectedTicket > 0;
        }

        public async Task<bool> TicketStatus(UpdateTicketStatusDTO ticket)
        {
            int rowsAffectedTicket = await _ticketRepo.UpdateTicketMoveStatus(ticket);
            var assetmovelist = await _moveRepo.GetAssetMoveByTN(ticket.ticketNumber);
            if(assetmovelist != null && assetmovelist.Any())
            {
                if (ticket.status == "Completed")
                {
                    foreach (var item in assetmovelist)
                    {
                        _logger.LogDebug("ID = \n"+item.id.ToString());
                        _logger.LogDebug("Status = \n"+item.moveStatus);
                    }
                    var ticketData = await _ticketRepo.GetTicketById(ticket.ticketNumber);
                    var newLocation = assetmovelist.Select(asset => new UpdateAssetDTO {
                        id = asset.assetNumber,
                        locationId = ticketData.branchDestination
                    }).ToList();

                    await _assetRepo.UpdateLocations(newLocation);
                    var list = assetmovelist.Select(assetmove => new UpdateAssetMoveStatusDTO
                    {
                        assetMoveId = assetmove.id,
                        status = assetmove.moveStatus == "Arrived" ? assetmove.moveStatus: "Missing"
                    }).ToList();
                    await _moveRepo.UpdateAssetMoveStatuses(list);
                }
                else
                {
                    var list = assetmovelist.Select(assetmove => new UpdateAssetMoveStatusDTO
                    {
                        assetMoveId = assetmove.id,
                        status = "Moving"
                    }).ToList();

                    await _moveRepo.UpdateAssetMoveStatuses(list);
                }
            }
            return rowsAffectedTicket > 0;
        }

        // public async Task<bool> TicketPublish(string ticketNumber)
        // {
        //     var ticket = await _ticketRepo.GetTicketById(ticketNumber);
        //     if (ticket == null)
        //     {
        //         return false;
        //     }

        //     int rowsAffected;
        //     var assetlist = await _moveRepo.GetAssetMoveByTN(ticketNumber);
        //     if (assetmovelist != null && assetmovelist.Any())
        //     {
        //         var list = assetmovelist.Select(assetmove => new UpdateAssetMoveStatusDTO
        //         {
        //             assetMoveId = assetmove.id,
        //             status = "Pending"
        //         }).ToList();

        //         rowsAffected = await _moveRepo.UpdateAssetMoveStatuses(list);
        //     }

        //     rowsAffected = await _ticketRepo.UpdateTicketMoveStatus(new UpdateTicketStatusDTO
        //     {
        //         ticketNumber = ticketNumber,
        //         status = "Pending"
        //     });
        //     if (rowsAffected == 0)
        //     {
        //         return false;
        //     }
        //     return true;
        // }
    }
}

