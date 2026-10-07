using CarWebApplicationAPI.Models;
using Microsoft.EntityFrameworkCore;
namespace CarWebApplicationAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext>options):base(options) 
        {
            
        }
        public DbSet<Car>Cars { get; set; }
    }
}
