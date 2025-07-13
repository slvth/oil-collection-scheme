using System;
using System.Collections.Generic;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class MeteringStationTypeEntity
{
    public int MeteringStationTypeId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<MeteringStationEntity> MeteringStations { get; set; } = new List<MeteringStationEntity>();
}
