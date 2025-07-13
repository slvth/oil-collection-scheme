using Microsoft.EntityFrameworkCore;
using OilCollectionScheme.DataAccess.Configurations;
using OilCollectionScheme.DataAccess.Entities;
using System.Reflection.Emit;

namespace OilCollectionScheme.DataAccess
{
    public class OilCollectionSchemeDbContext : DbContext
    {
        public OilCollectionSchemeDbContext(DbContextOptions<OilCollectionSchemeDbContext> options)
            : base(options)
        {

        }

        public DbSet<EmployeeEntity> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(OilCollectionSchemeDbContext).Assembly);
        }
    }
}
