using System;
using System.Collections.Generic;
using NetTopologySuite.Geometries;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class MeteringStationEntity
{
    public int MeteringStationId { get; set; }

    public string Name { get; set; } = null!;

    public float CycleTime { get; set; }

    public float Pressure { get; set; }

    public int FlowlineCount { get; set; }

    public int MeteringStationTypeId { get; set; }

    public int CounterTypeId { get; set; }

    public Point? Coordinate { get; set; }

    public int SchemeId { get; set; }

    public virtual CounterTypeEntity CounterType { get; set; } = null!;

    public virtual MeteringStationTypeEntity MeteringStationType { get; set; } = null!;

    public virtual SchemeEntity Scheme { get; set; } = null!;
}
