using System;
using System.Collections.Generic;
using NetTopologySuite.Geometries;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class PumpingStationEntity
{
    public int PumpingStationId { get; set; }

    public string Name { get; set; } = null!;

    public Point? Coordinate { get; set; }

    public int SchemeId { get; set; }

    public virtual SchemeEntity Scheme { get; set; } = null!;
}
