using System;
using System.Collections.Generic;
using NetTopologySuite.Geometries;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class WellEntity
{
    public int WellId { get; set; }

    public string Name { get; set; } = null!;

    public int? DriveTypeId { get; set; }

    public int WellPumpId { get; set; }

    public float? LengthStroke { get; set; }

    public float? NumberSwings { get; set; }

    public float WaterCut { get; set; }

    public float FlowRate { get; set; }

    public float FlowRateOil { get; set; }

    public Point? Coordinate { get; set; }

    public int SchemeId { get; set; }

    public virtual SchemeEntity Scheme { get; set; } = null!;

    public virtual WellPumpEntity WellPump { get; set; } = null!;

    public virtual DriveTypeEntity? DriveType { get; set; }
}
