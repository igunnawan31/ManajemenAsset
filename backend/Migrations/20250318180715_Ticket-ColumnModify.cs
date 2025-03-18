using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qrmanagement.Migrations
{
    /// <inheritdoc />
    public partial class TicketColumnModify : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "quantity",
                table: "Tickets");

            migrationBuilder.AddColumn<DateOnly>(
                name: "dateApproved",
                table: "Tickets",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "reason",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-001-070225",
                columns: new[] { "dateApproved", "reason" },
                values: new object[] { new DateOnly(2025, 1, 30), null });

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-002-070225",
                columns: new[] { "dateApproved", "reason" },
                values: new object[] { new DateOnly(2025, 1, 30), null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dateApproved",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "reason",
                table: "Tickets");

            migrationBuilder.AddColumn<int>(
                name: "quantity",
                table: "Tickets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-001-070225",
                column: "quantity",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-002-070225",
                column: "quantity",
                value: 1);
        }
    }
}
