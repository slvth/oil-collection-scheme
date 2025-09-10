using System;
using System.Collections.Generic;
using NetTopologySuite.Geometries;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class PumpingStationEntity
{
    public int PumpingStationId { get; set; }

    public string Name { get; set; } = null!;

    public float PressureWorking { get; set; }

    public float TankVolume { get; set; }

    public float Throughput { get; set; }

    public float PumpPerformance { get; set; }

    public Point? Coordinate { get; set; }

    public int SchemeId { get; set; }

    public virtual SchemeEntity Scheme { get; set; } = null!;
}
