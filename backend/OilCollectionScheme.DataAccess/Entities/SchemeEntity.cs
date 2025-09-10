using System;
using System.Collections.Generic;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class SchemeEntity
{
    public int SchemeId { get; set; }

    public string Name { get; set; } = null!;

    public int DepartmentId { get; set; }

    public int UserId { get; set; }

    public virtual DepartmentEntity Department { get; set; } = null!;

    public virtual ICollection<MeteringStationEntity> MeteringStations { get; set; } = new List<MeteringStationEntity>();

    public virtual ICollection<PipeEntity> Pipes { get; set; } = new List<PipeEntity>();

    public virtual ICollection<PumpingStationEntity> PumpingStations { get; set; } = new List<PumpingStationEntity>();

    public virtual ICollection<ProductParkEntity> StorageTanks { get; set; } = new List<ProductParkEntity>();

    public virtual UserEntity User { get; set; } = null!;

    public virtual ICollection<WellEntity> Wells { get; set; } = new List<WellEntity>();
}
