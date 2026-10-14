using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarWebApplicationAPI.Migrations
{
    /// <inheritdoc />
    public partial class DodajSlikuAutomobila : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SlikaUrl",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SlikaUrl",
                table: "Cars");
        }
    }
}
