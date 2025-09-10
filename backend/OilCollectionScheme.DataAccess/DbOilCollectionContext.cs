using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using OilCollectionScheme.DataAccess.Entities;

namespace OilCollectionScheme.DataAccess;

public partial class DbOilCollectionContext : DbContext
{
    public DbOilCollectionContext()
    {
    }

    public DbOilCollectionContext(DbContextOptions<DbOilCollectionContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CounterTypeEntity> CounterTypes { get; set; }

    public virtual DbSet<DepartmentEntity> Departments { get; set; }

    public virtual DbSet<EmployeeEntity> Employees { get; set; }

    public virtual DbSet<MeteringStationEntity> MeteringStations { get; set; }

    public virtual DbSet<MeteringStationTypeEntity> MeteringStationTypes { get; set; }

    public virtual DbSet<ObjectTypeEntity> ObjectTypes { get; set; }

    public virtual DbSet<PipeEntity> Pipes { get; set; }

    public virtual DbSet<PumpingStationEntity> PumpingStations { get; set; }

    public virtual DbSet<RoleEntity> Roles { get; set; }

    public virtual DbSet<SchemeEntity> Schemes { get; set; }

    public virtual DbSet<ProductParkEntity> ProductParks { get; set; }

    public virtual DbSet<UserEntity> Users { get; set; }

    public virtual DbSet<WellEntity> Wells { get; set; }

    public virtual DbSet<WellPumpEntity> WellPumps { get; set; }

    public virtual DbSet<DriveTypeEntity> DriveTypes { get; set; }

    public virtual DbSet<LiftMethodEntity> LiftMethods { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("User ID=postgres;Password=12345;Host=localhost;Port=5432;Database=db.oil_collection;", x => x.UseNetTopologySuite());

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("postgis");

        modelBuilder.Entity<CounterTypeEntity>(entity =>
        {
            entity.HasKey(e => e.CounterTypeId).HasName("counter_types_pkey");

            entity.ToTable("counter_types");

            entity.Property(e => e.CounterTypeId).HasColumnName("counter_type_id");
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .HasColumnName("name");
        });

        modelBuilder.Entity<DepartmentEntity>(entity =>
        {
            entity.HasKey(e => e.DepartmentId).HasName("departments_pkey");

            entity.ToTable("departments");

            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<EmployeeEntity>(entity =>
        {
            entity.HasKey(e => e.EmployeeId).HasName("employees_pkey");

            entity.ToTable("employees");

            entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
            entity.Property(e => e.FirstName)
                .HasMaxLength(100)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .HasColumnName("last_name");
            entity.Property(e => e.MiddleName)
                .HasMaxLength(100)
                .HasColumnName("middle_name");
        });

        modelBuilder.Entity<MeteringStationEntity>(entity =>
        {
            entity.HasKey(e => e.MeteringStationId).HasName("metering_stations_pkey");

            entity.ToTable("metering_stations");

            entity.Property(e => e.MeteringStationId).HasColumnName("metering_station_id");
            entity.Property(e => e.Coordinate)
                .HasColumnType("geometry(Point,4326)")
                .HasColumnName("coordinate");
            entity.Property(e => e.CounterTypeId).HasColumnName("counter_type_id");
            entity.Property(e => e.MeteringStationTypeId).HasColumnName("metering_station_type_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.CycleTime).HasColumnName("cycle_time");
            entity.Property(e => e.Pressure).HasColumnName("pressure");
            entity.Property(e => e.FlowlineCount).HasColumnName("flowline_count");
            entity.Property(e => e.SchemeId).HasColumnName("scheme_id");

            entity.HasOne(d => d.CounterType).WithMany(p => p.MeteringStations)
                .HasForeignKey(d => d.CounterTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("metering_stations_counter_type_id_fkey");

            entity.HasOne(d => d.MeteringStationType).WithMany(p => p.MeteringStations)
                .HasForeignKey(d => d.MeteringStationTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("metering_stations_metering_station_type_id_fkey");

            entity.HasOne(d => d.Scheme).WithMany(p => p.MeteringStations)
                .HasForeignKey(d => d.SchemeId)
                .HasConstraintName("metering_stations_scheme_id_fkey");
        });

        modelBuilder.Entity<MeteringStationTypeEntity>(entity =>
        {
            entity.HasKey(e => e.MeteringStationTypeId).HasName("metering_station_types_pkey");

            entity.ToTable("metering_station_types");

            entity.Property(e => e.MeteringStationTypeId).HasColumnName("metering_station_type_id");
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .HasColumnName("name");
        });

        modelBuilder.Entity<ObjectTypeEntity>(entity =>
        {
            entity.HasKey(e => e.ObjectTypeId).HasName("object_types_pkey");

            entity.ToTable("object_types");

            entity.Property(e => e.ObjectTypeId).HasColumnName("object_type_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<PipeEntity>(entity =>
        {
            entity.HasKey(e => e.PipeId).HasName("pipes_pkey");

            entity.ToTable("pipes");

            entity.Property(e => e.PipeId).HasColumnName("pipe_id");
            entity.Property(e => e.Coordinates)
                .HasColumnType("geometry(LineString,4326)")
                .HasColumnName("coordinates");
            entity.Property(e => e.EndObjectId).HasColumnName("end_object_id");
            entity.Property(e => e.EndObjectTypeId).HasColumnName("end_object_type_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.SchemeId).HasColumnName("scheme_id");
            entity.Property(e => e.StartObjectId).HasColumnName("start_object_id");
            entity.Property(e => e.StartObjectTypeId).HasColumnName("start_object_type_id");

            entity.HasOne(d => d.EndObjectType).WithMany(p => p.PipeEndObjectTypes)
                .HasForeignKey(d => d.EndObjectTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("pipes_end_object_type_id_fkey");

            entity.HasOne(d => d.Scheme).WithMany(p => p.Pipes)
                .HasForeignKey(d => d.SchemeId)
                .HasConstraintName("pipes_scheme_id_fkey");

            entity.HasOne(d => d.StartObjectType).WithMany(p => p.PipeStartObjectTypes)
                .HasForeignKey(d => d.StartObjectTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("pipes_start_object_type_id_fkey");
        });

        modelBuilder.Entity<PumpingStationEntity>(entity =>
        {
            entity.HasKey(e => e.PumpingStationId).HasName("pumping_stations_pkey");

            entity.ToTable("pumping_stations");

            entity.Property(e => e.PumpingStationId).HasColumnName("pumping_station_id");
            entity.Property(e => e.Coordinate)
                .HasColumnType("geometry(Point,4326)")
                .HasColumnName("coordinate");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.PressureWorking).HasColumnName("pressure_working");
            entity.Property(e => e.TankVolume).HasColumnName("tank_volume");
            entity.Property(e => e.Throughput).HasColumnName("throughput");
            entity.Property(e => e.PumpPerformance).HasColumnName("pump_performance");
            entity.Property(e => e.SchemeId).HasColumnName("scheme_id");

            entity.HasOne(d => d.Scheme).WithMany(p => p.PumpingStations)
                .HasForeignKey(d => d.SchemeId)
                .HasConstraintName("pumping_stations_scheme_id_fkey");
        });

        modelBuilder.Entity<RoleEntity>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("roles_pkey");

            entity.ToTable("roles");

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<SchemeEntity>(entity =>
        {
            entity.HasKey(e => e.SchemeId).HasName("schemes_pkey");

            entity.ToTable("schemes");

            entity.Property(e => e.SchemeId).HasColumnName("scheme_id");
            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Department).WithMany(p => p.Schemes)
                .HasForeignKey(d => d.DepartmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("schemes_department_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.Schemes)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("schemes_user_id_fkey");
        });

        modelBuilder.Entity<ProductParkEntity>(entity =>
        {
            entity.HasKey(e => e.ProductParkId).HasName("product_parks_pkey");

            entity.ToTable("product_parks");

            entity.Property(e => e.ProductParkId).HasColumnName("product_park_id");
            entity.Property(e => e.Coordinate)
                .HasColumnType("geometry(Point,4326)")
                .HasColumnName("coordinate");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.SchemeId).HasColumnName("scheme_id");

            entity.HasOne(d => d.Scheme).WithMany(p => p.StorageTanks)
                .HasForeignKey(d => d.SchemeId)
                .HasConstraintName("product_parks_scheme_id_fkey");
        });

        modelBuilder.Entity<UserEntity>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("users_pkey");

            entity.ToTable("users");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
            entity.Property(e => e.Login)
                .HasMaxLength(100)
                .HasColumnName("login");
            entity.Property(e => e.Password)
                .HasMaxLength(100)
                .HasColumnName("password");
            entity.Property(e => e.RoleId).HasColumnName("role_id");

            entity.HasOne(d => d.Employee).WithMany(p => p.Users)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("users_employee_id_fkey");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("users_role_id_fkey");
        });

        modelBuilder.Entity<WellEntity>(entity =>
        {
            entity.HasKey(e => e.WellId).HasName("wells_pkey");

            entity.ToTable("wells");

            entity.Property(e => e.WellId)
                .UseIdentityByDefaultColumn()
                .HasColumnName("well_id");
            entity.Property(e => e.Coordinate)
                .HasColumnType("geometry(Point,4326)")
                .HasColumnName("coordinate");
            entity.Property(e => e.LengthStroke).HasColumnName("length_stroke");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.NumberSwings).HasColumnName("number_swings");
            entity.Property(e => e.WaterCut).HasColumnName("water_cut");
            entity.Property(e => e.FlowRate).HasColumnName("flow_rate");
            entity.Property(e => e.FlowRateOil).HasColumnName("flow_rate_oil");
            entity.Property(e => e.SchemeId).HasColumnName("scheme_id");
            entity.Property(e => e.WellPumpId).HasColumnName("well_pump_id");
            entity.Property(e => e.DriveTypeId).HasColumnName("drive_type_id");

            entity.HasOne(d => d.Scheme).WithMany(p => p.Wells)
                .HasForeignKey(d => d.SchemeId)
                .HasConstraintName("wells_scheme_id_fkey");

            entity.HasOne(d => d.WellPump).WithMany(p => p.Wells)
                .HasForeignKey(d => d.WellPumpId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("wells_well_pump_id_fkey");

            entity.HasOne(d => d.DriveType).WithMany(p => p.Wells)
                .HasForeignKey(d => d.DriveTypeId)
                .HasConstraintName("wells_drive_type_id_fkey");
        });

        modelBuilder.Entity<WellPumpEntity>(entity =>
        {
            entity.HasKey(e => e.WellPumpId).HasName("well_pumps_pkey");

            entity.ToTable("well_pumps");

            entity.Property(e => e.WellPumpId).HasColumnName("well_pump_id");
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .HasColumnName("name");
            entity.Property(e => e.LiftMethodId).HasColumnName("lift_method_id");

            entity.HasOne(d => d.LiftMethod).WithMany(d => d.WellPumps)
                .HasForeignKey(d => d.LiftMethodId)
                .HasConstraintName("well_pumps_lift_method_id_fkey");
        });

        modelBuilder.Entity<DriveTypeEntity>(entity =>
        {
            entity.HasKey(e => e.DriveTypeId).HasName("drive_types_pkey");

            entity.ToTable("drive_types");

            entity.Property(e => e.DriveTypeId).HasColumnName("drive_type_id");
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .HasColumnName("name");
            entity.Property(e => e.LiftMethodId).HasColumnName("lift_method_id");

            entity.HasOne(d => d.LiftMethod).WithMany(d => d.DriveTypes)
                .HasForeignKey(d => d.LiftMethodId)
                .HasConstraintName("drive_types_lift_method_id_fkey");
        });

        modelBuilder.Entity<LiftMethodEntity>(entity =>
        {
            entity.HasKey(e => e.LiftMethodId).HasName("lift_methods_pkey");

            entity.ToTable("lift_methods");

            entity.Property(e => e.LiftMethodId).HasColumnName("lift_method_id");
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .HasColumnName("name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
