using qrmanagement.backend.DTO.Ticket;
using qrmanagement.backend.Models;
namespace qrmanagement.backend.Repositories{
    public interface ITicketRepository{
        Task <IEnumerable<TicketResponseDTO>> GetAllTicket();
        Task <TicketResponseDTO> GetTicketById(string id);
        Task <IEnumerable<TicketResponseDTO>> GetTicketByOrigin(int locationId);
        Task <IEnumerable<TicketResponseDTO>> GetTicketByMoveStatus(string status);
        Task <IEnumerable<TicketResponseDTO>> GetTicketByApprovalStatus(string status);
        Task <int> AddTicket(Ticket ticket);
        // Task <int> UpdateTicket(UpdateTicketDTO ticket);
        // Task <int> UpdateTicketMoveStatus(UpdateTicketDTO ticket);
        // Task <int> UpdateTicketApprovalStatus(UpdateTicketDTO ticket);
        // Task <int> DeleteTicket(string id);
    }
}