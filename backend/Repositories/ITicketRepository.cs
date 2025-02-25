using qrmanagement.backend.DTO.Ticket;
namespace qrmanagement.backend.Repositories{
    public interface ITicketRepository{
        Task <IEnumerable<TicketResponseDTO>> GetAllTicket();
        Task <TicketResponseDTO> GetTicketById(string id);
        Task <IEnumerable<TicketResponseDTO>> GetTicketByLocationId(int locationId);
        Task <IEnumerable<TicketResponseDTO>> GetActiveTicket(string status);
        Task <IEnumerable<TicketResponseDTO>> GetCompletedTicket(string status);
        Task <IEnumerable<TicketResponseDTO>> GetNotStartedTicket(string status);
        Task <IEnumerable<TicketResponseDTO>> GetRejectedTicket(string status);
        Task <IEnumerable<TicketResponseDTO>> GetApprovedTicket(string status);
        Task <IEnumerable<TicketResponseDTO>> GetPendingTicket(string status);
        Task <int> AddTicket(CreateTicketDTO ticket);
        Task <int> UpdateTicket(UpdateTicketDTO ticket);
        Task <int> UpdateTicketMoveStatus(UpdateTicketDTO ticket);
        Task <int> UpdateTicketApprovalStatus(UpdateTicketDTO ticket);
        Task <int> DeleteTicket(string id);
    }
}