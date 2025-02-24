using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qrmanagement.backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateColumnBranches : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Branches_Branches_branchId1",
                table: "Branches");

            migrationBuilder.DropIndex(
                name: "IX_Branches_branchId1",
                table: "Branches");

            migrationBuilder.DropColumn(
                name: "branchId1",
                table: "Branches");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "branchId1",
                table: "Branches",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Branches",
                keyColumn: "branchId",
                keyValue: 1,
                column: "branchId1",
                value: null);

            migrationBuilder.UpdateData(
                table: "Branches",
                keyColumn: "branchId",
                keyValue: 2,
                column: "branchId1",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_Branches_branchId1",
                table: "Branches",
                column: "branchId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Branches_Branches_branchId1",
                table: "Branches",
                column: "branchId1",
                principalTable: "Branches",
                principalColumn: "branchId");
        }
    }
}
