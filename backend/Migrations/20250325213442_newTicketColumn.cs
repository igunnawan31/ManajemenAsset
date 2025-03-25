using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qrmanagement.Migrations
{
    /// <inheritdoc />
    public partial class newTicketColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "receivedBy",
                table: "Tickets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "requestedBy",
                table: "Tickets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-001-070225",
                columns: new[] { "receivedBy", "requestedBy" },
                values: new object[] { 1, 2 });

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-002-070225",
                columns: new[] { "receivedBy", "requestedBy" },
                values: new object[] { 2, 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "receivedBy",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "requestedBy",
                table: "Tickets");
        }
    }
}
