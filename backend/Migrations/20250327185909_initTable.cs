﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace qrmanagement.Migrations
{
    /// <inheritdoc />
    public partial class initTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kotas",
                columns: table => new
                {
                    kotaId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    kotaName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kotas", x => x.kotaId);
                });

            migrationBuilder.CreateTable(
                name: "Kecamatans",
                columns: table => new
                {
                    kecamatanId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    kecamatanName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    kotaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kecamatans", x => x.kecamatanId);
                    table.ForeignKey(
                        name: "FK_Kecamatans_Kotas_kotaId",
                        column: x => x.kotaId,
                        principalTable: "Kotas",
                        principalColumn: "kotaId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Branches",
                columns: table => new
                {
                    branchId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    branchName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    branchEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    branchPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    kotaId = table.Column<int>(type: "int", nullable: false),
                    kecamatanId = table.Column<int>(type: "int", nullable: false),
                    branchLocation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    parentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Branches", x => x.branchId);
                    table.ForeignKey(
                        name: "FK_Branches_Kecamatans_kecamatanId",
                        column: x => x.kecamatanId,
                        principalTable: "Kecamatans",
                        principalColumn: "kecamatanId");
                    table.ForeignKey(
                        name: "FK_Branches_Kotas_kotaId",
                        column: x => x.kotaId,
                        principalTable: "Kotas",
                        principalColumn: "kotaId");
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
                    branchOrigin = table.Column<int>(type: "int", nullable: false),
                    branchDestination = table.Column<int>(type: "int", nullable: false),
                    requestedBy = table.Column<int>(type: "int", nullable: false),
                    receivedBy = table.Column<int>(type: "int", nullable: false),
                    outboundDate = table.Column<DateOnly>(type: "date", nullable: true),
                    inboundDate = table.Column<DateOnly>(type: "date", nullable: true),
                    reason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    dateRequested = table.Column<DateOnly>(type: "date", nullable: false),
                    dateApproved = table.Column<DateOnly>(type: "date", nullable: true),
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
                        principalColumn: "branchId");
                    table.ForeignKey(
                        name: "FK_Tickets_Branches_branchOrigin",
                        column: x => x.branchOrigin,
                        principalTable: "Branches",
                        principalColumn: "branchId");
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    userId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    userEmail = table.Column<string>(type: "nvarchar(450)", nullable: false),
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
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssetMoves_Tickets_ticketNumber",
                        column: x => x.ticketNumber,
                        principalTable: "Tickets",
                        principalColumn: "ticketNumber",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Kotas",
                columns: new[] { "kotaId", "kotaName" },
                values: new object[,]
                {
                    { 1, "Jakarta Utara" },
                    { 2, "Jakarta Pusat" },
                    { 101, "Jakarta Selatan" },
                    { 102, "Bandung" },
                    { 103, "Surabaya" },
                    { 104, "Yogyakarta" },
                    { 105, "Medan" }
                });

            migrationBuilder.InsertData(
                table: "Kecamatans",
                columns: new[] { "kecamatanId", "kecamatanName", "kotaId" },
                values: new object[,]
                {
                    { 1, "Tanjung Priok", 1 },
                    { 2, "Senen", 2 },
                    { 201, "Menteng", 101 },
                    { 202, "Cibiru", 102 },
                    { 203, "Wonokromo", 103 },
                    { 204, "Kotagede", 104 },
                    { 205, "Medan Baru", 105 }
                });

            migrationBuilder.InsertData(
                table: "Branches",
                columns: new[] { "branchId", "branchEmail", "branchLocation", "branchName", "branchPhone", "kecamatanId", "kotaId", "parentId" },
                values: new object[,]
                {
                    { 1, "astraInternational@ai.astra.co.id", "Jakarta Utara", "Astra International", "1234567890123", 1, 1, null },
                    { 2, "ag.it@ai.astra.co.id", "Jakarta Pusat", "Astragraphia Information Technology", "1234567890321", 2, 2, 1 },
                    { 3, "jakarta@company.com", "Jl. Sudirman No. 1, Jakarta", "Branch Jakarta", "+62123456789", 201, 101, 1 },
                    { 4, "bandung@company.com", "Jl. Asia Afrika No. 2, Bandung", "Branch Bandung", "+62223456789", 202, 102, 1 },
                    { 5, "surabaya@company.com", "Jl. Tunjungan No. 3, Surabaya", "Branch Surabaya", "+62313456789", 203, 103, null },
                    { 6, "yogyakarta@company.com", "Jl. Malioboro No. 4, Yogyakarta", "Branch Yogyakarta", "+62274567890", 204, 104, 5 },
                    { 7, "medan@company.com", "Jl. Gatot Subroto No. 5, Medan", "Branch Medan", "+62613456789", 205, 105, null }
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
                columns: new[] { "ticketNumber", "approvalStatus", "branchDestination", "branchOrigin", "dateApproved", "dateRequested", "inboundDate", "moveStatus", "outboundDate", "reason", "receivedBy", "requestedBy" },
                values: new object[,]
                {
                    { "TN-001-070225", "Approved", 2, 1, new DateOnly(2025, 1, 30), new DateOnly(2025, 1, 28), new DateOnly(2025, 2, 5), "Completed", new DateOnly(2025, 2, 1), null, 1, 2 },
                    { "TN-002-070225", "Approved", 1, 2, new DateOnly(2025, 1, 30), new DateOnly(2025, 1, 28), new DateOnly(2025, 2, 5), "Completed", new DateOnly(2025, 2, 1), null, 2, 1 },
                    { "TN-003-070225", "Approved", 1, 2, new DateOnly(2025, 2, 26), new DateOnly(2025, 2, 25), new DateOnly(2025, 3, 3), "Completed", new DateOnly(2025, 3, 1), null, 2, 1 },
                    { "TN-004-070225", "Pending", 2, 1, null, new DateOnly(2025, 2, 28), null, "Not_Started", new DateOnly(2025, 3, 5), null, 1, 2 },
                    { "TN-005-070225", "Approved", 3, 2, new DateOnly(2025, 3, 6), new DateOnly(2025, 3, 5), new DateOnly(2025, 3, 12), "Completed", new DateOnly(2025, 3, 10), null, 2, 3 },
                    { "TN-006-070225", "Draft", 3, 1, null, new DateOnly(2025, 3, 8), null, "Not_Started", null, null, 1, 3 },
                    { "TN-007-070225", "Rejected", 3, 1, null, new DateOnly(2025, 3, 8), null, "Not_Started", null, "Unit rusak", 3, 1 },
                    { "TN-008-070225", "Approved", 1, 3, new DateOnly(2025, 3, 11), new DateOnly(2025, 3, 10), null, "In_Progress", new DateOnly(2025, 3, 15), null, 1, 3 }
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
                    { 1, "AN-001-070225", "Arrived", "TN-001-070225" },
                    { 2, "AN-002-070225", "Arrived", "TN-002-070225" },
                    { 3, "AN-001-070225", "Arrived", "TN-001-070225" },
                    { 4, "AN-002-070225", "Arrived", "TN-001-070225" },
                    { 5, "AN-001-070225", "Arrived", "TN-002-070225" },
                    { 6, "AN-002-070225", "Arrived", "TN-002-070225" },
                    { 7, "AN-001-070225", "Moving", "TN-003-070225" },
                    { 8, "AN-002-070225", "Waiting", "TN-004-070225" },
                    { 9, "AN-001-070225", "Arrived", "TN-005-070225" },
                    { 10, "AN-002-070225", "Missing", "TN-005-070225" },
                    { 11, "AN-001-070225", "Draft", "TN-006-070225" },
                    { 12, "AN-002-070225", "Draft", "TN-007-070225" },
                    { 13, "AN-001-070225", "Moving", "TN-008-070225" }
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
                name: "IX_Branches_kecamatanId",
                table: "Branches",
                column: "kecamatanId");

            migrationBuilder.CreateIndex(
                name: "IX_Branches_kotaId",
                table: "Branches",
                column: "kotaId");

            migrationBuilder.CreateIndex(
                name: "IX_Kecamatans_kotaId",
                table: "Kecamatans",
                column: "kotaId");

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

            migrationBuilder.CreateIndex(
                name: "IX_Users_userEmail",
                table: "Users",
                column: "userEmail",
                unique: true);
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

            migrationBuilder.DropTable(
                name: "Kecamatans");

            migrationBuilder.DropTable(
                name: "Kotas");
        }
    }
}
