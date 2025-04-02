using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qrmanagement.Migrations
{
    /// <inheritdoc />
    public partial class modifyAssetMove : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 8,
                column: "moveStatus",
                value: "Pending");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 8,
                column: "moveStatus",
                value: "Waiting");
        }
    }
}
