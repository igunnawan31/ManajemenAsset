using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qrmanagement.backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateColumnConstraintParentId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "parentId",
                table: "Branches",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "Branches",
                keyColumn: "branchId",
                keyValue: 1,
                column: "parentId",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "parentId",
                table: "Branches",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Branches",
                keyColumn: "branchId",
                keyValue: 1,
                column: "parentId",
                value: 0);
        }
    }
}
