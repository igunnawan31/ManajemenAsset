using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qrmanagement.Migrations
{
    /// <inheritdoc />
    public partial class DEFAULT : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.InsertData(
                table: "Kotas",
                columns: new[] { "kotaId", "kotaName" },
                values: new object[] { -1, "DEFAULT" });

            migrationBuilder.InsertData(
                table: "Kecamatans",
                columns: new[] { "kecamatanId", "kecamatanName", "kotaId" },
                values: new object[] { -1, "DEFAULT", -1 });

            migrationBuilder.InsertData(
                table: "Branches",
                columns: new[] { "branchId", "branchEmail", "branchLocation", "branchName", "branchPhone", "kecamatanId", "kotaId", "parentId" },
                values: new object[] { -1, "DEFAULT", "DEFAULT", "DEFAULT", "DEFAULT", -1, -1, null });

            migrationBuilder.InsertData(
                table: "Tickets",
                columns: new[] { "ticketNumber", "approvalStatus", "branchDestination", "branchOrigin", "dateApproved", "dateRequested", "inboundDate", "moveStatus", "outboundDate", "receivedBy", "rejectClassification", "rejectReason", "requestReason", "requestedBy" },
                values: new object[] { "DEFAULTSTATUS", "Approved", -1, -1, new DateOnly(2025, 1, 30), new DateOnly(2025, 1, 28), null, "Completed", null, -1, null, null, null, -1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DeleteData(
                table: "Kotas",
                keyColumn: "kotaId",
                keyValue: -1);
                
            migrationBuilder.DeleteData(
                table: "Kecamatans",
                keyColumn: "kecamatanId",
                keyValue: -1);

            migrationBuilder.DeleteData(
                table: "Branches",
                keyColumn: "branchId",
                keyValue: -1);

            migrationBuilder.DeleteData(
                table: "Tickets",
                keyColumn: "ticketNumber",
                keyValue: "DEFAULTSTATUS");

        }
    }
}
