using System;
using System.Collections.Generic;
using NetTopologySuite.Geometries;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class WellEntity
{
    public int WellId { get; set; }

    public string Name { get; set; } = null!;

    public int? WellTypeId { get; set; }

    public int WellPumpId { get; set; }

    public float? LengthStroke { get; set; }

    public float? NumberSwings { get; set; }

    public Point? Coordinate { get; set; }

    public int SchemeId { get; set; }

    public virtual SchemeEntity Scheme { get; set; } = null!;

    public virtual WellPumpEntity WellPump { get; set; } = null!;

    public virtual WellTypeEntity? WellType { get; set; }
}
