using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qrmanagement.Migrations
{
    /// <inheritdoc />
    public partial class assetMoveStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 1,
                column: "moveStatus",
                value: "Moved");

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 2,
                column: "moveStatus",
                value: "Moved");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 1,
                column: "moveStatus",
                value: "Completed");

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 2,
                column: "moveStatus",
                value: "Completed");
        }
    }
}
