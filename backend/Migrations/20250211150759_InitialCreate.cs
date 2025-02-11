using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace qrmanagement.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Branches",
                columns: table => new
                {
                    branchId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    branchName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    branchEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    branchPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    branchLocation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    parentId = table.Column<int>(type: "int", nullable: false),
                    branchId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Branches", x => x.branchId);
                    table.ForeignKey(
                        name: "FK_Branches_Branches_branchId1",
                        column: x => x.branchId1,
                        principalTable: "Branches",
                        principalColumn: "branchId");
                });

            migrationBuilder.CreateTable(
                name: "Assets",
                columns: table => new
                {
                    id = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    locationId = table.Column<int>(type: "int", nullable: false),
                    assetType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    itemStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    imagePath = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assets", x => x.id);
                    table.ForeignKey(
                        name: "FK_Assets_Branches_locationId",
                        column: x => x.locationId,
                        principalTable: "Branches",
                        principalColumn: "branchId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tickets",
                columns: table => new
                {
                    ticketNumber = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    branchOrigin = table.Column<int>(type: "int", nullable: false),
                    branchDestination = table.Column<int>(type: "int", nullable: false),
                    outboundDate = table.Column<DateOnly>(type: "date", nullable: false),
                    inboundDate = table.Column<DateOnly>(type: "date", nullable: false),
                    dateRequested = table.Column<DateOnly>(type: "date", nullable: false),
                    approvalStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    moveStatus = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.ticketNumber);
                    table.ForeignKey(
                        name: "FK_Tickets_Branches_branchDestination",
                        column: x => x.branchDestination,
                        principalTable: "Branches",
                        principalColumn: "branchId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tickets_Branches_branchOrigin",
                        column: x => x.branchOrigin,
                        principalTable: "Branches",
                        principalColumn: "branchId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    userId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    userEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    userBranch = table.Column<int>(type: "int", nullable: false),
                    userPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    userRole = table.Column<int>(type: "int", nullable: false),
                    userSubRole = table.Column<int>(type: "int", nullable: false),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.userId);
                    table.ForeignKey(
                        name: "FK_Users_Branches_userBranch",
                        column: x => x.userBranch,
                        principalTable: "Branches",
                        principalColumn: "branchId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AssetMoves",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ticketNumber = table.Column<string>(type: "nvarchar(13)", nullable: false),
                    assetNumber = table.Column<string>(type: "nvarchar(13)", nullable: false),
                    moveStatus = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssetMoves", x => x.id);
                    table.ForeignKey(
                        name: "FK_AssetMoves_Assets_assetNumber",
                        column: x => x.assetNumber,
                        principalTable: "Assets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AssetMoves_Tickets_ticketNumber",
                        column: x => x.ticketNumber,
                        principalTable: "Tickets",
                        principalColumn: "ticketNumber",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Branches",
                columns: new[] { "branchId", "branchEmail", "branchId1", "branchLocation", "branchName", "branchPhone", "parentId" },
                values: new object[,]
                {
                    { 1, "astraInternational@ai.astra.co.id", null, "Jakarta Utara", "Astra International", "1234567890123", 0 },
                    { 2, "ag.it@ai.astra.co.id", null, "Jakarta Selatan", "Astragraphia Information Technology", "1234567890321", 1 }
                });

            migrationBuilder.InsertData(
                table: "Assets",
                columns: new[] { "id", "assetType", "imagePath", "itemStatus", "locationId", "name" },
                values: new object[,]
                {
                    { "AN-001-070225", "Electronics", "", "Active", 2, "Samsung_Galaxy" },
                    { "AN-002-070225", "Electronics", "", "Active", 1, "Samsung_Flip" }
                });

            migrationBuilder.InsertData(
                table: "Tickets",
                columns: new[] { "ticketNumber", "approvalStatus", "branchDestination", "branchOrigin", "dateRequested", "inboundDate", "moveStatus", "outboundDate", "quantity" },
                values: new object[,]
                {
                    { "TN-001-070225", "Approved", 2, 1, new DateOnly(2025, 1, 28), new DateOnly(2025, 2, 5), "Completed", new DateOnly(2025, 2, 1), 1 },
                    { "TN-002-070225", "Approved", 1, 2, new DateOnly(2025, 1, 28), new DateOnly(2025, 2, 5), "Completed", new DateOnly(2025, 2, 1), 1 }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "userId", "password", "userBranch", "userEmail", "userName", "userPhone", "userRole", "userSubRole" },
                values: new object[,]
                {
                    { 1, "12345", 1, "mgunawan@ai.astra.co.id", "Gunawan", "1234567890456", 1, 0 },
                    { 2, "12345", 1, "gunawan@ai.astra.co.id", "MGunawan", "1234567890654", 1, 1 },
                    { 3, "12345", 2, "aldisar@ai.astra.co.id", "Aldisar", "1234567890789", 0, 0 },
                    { 4, "12345", 2, "gibran@ai.astra.co.id", "Gibran", "1234567890987", 0, 1 }
                });

            migrationBuilder.InsertData(
                table: "AssetMoves",
                columns: new[] { "id", "assetNumber", "moveStatus", "ticketNumber" },
                values: new object[,]
                {
                    { 1, "AN-001-070225", "Completed", "TN-001-070225" },
                    { 2, "AN-002-070225", "Completed", "TN-002-070225" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AssetMoves_assetNumber",
                table: "AssetMoves",
                column: "assetNumber");

            migrationBuilder.CreateIndex(
                name: "IX_AssetMoves_ticketNumber",
                table: "AssetMoves",
                column: "ticketNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_locationId",
                table: "Assets",
                column: "locationId");

            migrationBuilder.CreateIndex(
                name: "IX_Branches_branchId1",
                table: "Branches",
                column: "branchId1");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_branchDestination",
                table: "Tickets",
                column: "branchDestination");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_branchOrigin",
                table: "Tickets",
                column: "branchOrigin");

            migrationBuilder.CreateIndex(
                name: "IX_Users_userBranch",
                table: "Users",
                column: "userBranch");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AssetMoves");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Assets");

            migrationBuilder.DropTable(
                name: "Tickets");

            migrationBuilder.DropTable(
                name: "Branches");
        }
    }
}
