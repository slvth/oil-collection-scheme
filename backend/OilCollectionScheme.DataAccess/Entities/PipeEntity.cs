using System;
using System.Collections.Generic;
using NetTopologySuite.Geometries;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class PipeEntity
{
    public int PipeId { get; set; }

    public string Name { get; set; } = null!;

    public int StartObjectId { get; set; }

    public int StartObjectTypeId { get; set; }

    public int EndObjectId { get; set; }

    public int EndObjectTypeId { get; set; }

    public LineString? Coordinates { get; set; }

    public int SchemeId { get; set; }

    public virtual ObjectTypeEntity EndObjectType { get; set; } = null!;

    public virtual SchemeEntity Scheme { get; set; } = null!;

    public virtual ObjectTypeEntity StartObjectType { get; set; } = null!;
}
