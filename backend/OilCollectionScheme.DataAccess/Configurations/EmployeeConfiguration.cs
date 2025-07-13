using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Options;
using OilCollectionScheme.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.DataAccess.Configurations
{
    internal class EmployeeConfiguration : IEntityTypeConfiguration<EmployeeEntity>
    {
        public void Configure(EntityTypeBuilder<EmployeeEntity> builder)
        {
            builder.ToTable("employees");

            builder.HasKey(e => e.EmployeeId);

            builder.Property(e => e.EmployeeId).HasColumnName("employee_id");

            builder.Property(e => e.LastName).IsRequired();

            builder.Property(e => e.FirstName).IsRequired();

            builder.Property(e => e.MiddleName);
        }
    }
}
