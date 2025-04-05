using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qrmanagement.Migrations
{
    /// <inheritdoc />
    public partial class assetMoveCreatedOn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "createdOn",
                table: "AssetMoves",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 1,
                column: "createdOn",
                value: new DateTime(2025, 1, 28, 10, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 2,
                column: "createdOn",
                value: new DateTime(2025, 1, 28, 11, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 3,
                column: "createdOn",
                value: new DateTime(2025, 1, 28, 12, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 4,
                column: "createdOn",
                value: new DateTime(2025, 1, 28, 13, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 5,
                column: "createdOn",
                value: new DateTime(2025, 1, 28, 14, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 6,
                column: "createdOn",
                value: new DateTime(2025, 1, 28, 15, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 7,
                column: "createdOn",
                value: new DateTime(2025, 2, 25, 10, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 8,
                column: "createdOn",
                value: new DateTime(2025, 2, 28, 10, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 9,
                column: "createdOn",
                value: new DateTime(2025, 3, 5, 10, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 10,
                column: "createdOn",
                value: new DateTime(2025, 3, 5, 11, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 11,
                column: "createdOn",
                value: new DateTime(2025, 3, 8, 10, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 12,
                column: "createdOn",
                value: new DateTime(2025, 3, 8, 11, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AssetMoves",
                keyColumn: "id",
                keyValue: 13,
                column: "createdOn",
                value: new DateTime(2025, 3, 10, 10, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "createdOn",
                table: "AssetMoves");
        }
    }
}
