using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qrmanagement.Migrations
{
    /// <inheritdoc />
    public partial class modifyTicket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "reason",
                table: "Tickets",
                newName: "requestReason");

            migrationBuilder.AddColumn<string>(
                name: "rejectClassification",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "rejectReason",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-001-070225",
                columns: new[] { "rejectClassification", "rejectReason" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-002-070225",
                columns: new[] { "rejectClassification", "rejectReason" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-003-070225",
                columns: new[] { "rejectClassification", "rejectReason" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-004-070225",
                columns: new[] { "rejectClassification", "rejectReason" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-005-070225",
                columns: new[] { "rejectClassification", "rejectReason" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-006-070225",
                columns: new[] { "rejectClassification", "rejectReason" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-007-070225",
                columns: new[] { "rejectClassification", "rejectReason", "requestReason" },
                values: new object[] { null, "Unit rusak", null });

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-008-070225",
                columns: new[] { "rejectClassification", "rejectReason" },
                values: new object[] { null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "rejectClassification",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "rejectReason",
                table: "Tickets");

            migrationBuilder.RenameColumn(
                name: "requestReason",
                table: "Tickets",
                newName: "reason");

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "TN-007-070225",
                column: "reason",
                value: "Unit rusak");
        }
    }
}
