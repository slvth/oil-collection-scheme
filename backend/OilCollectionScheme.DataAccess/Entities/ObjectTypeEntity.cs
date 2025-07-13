using System;
using System.Collections.Generic;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class ObjectTypeEntity
{
    public int ObjectTypeId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<PipeEntity> PipeEndObjectTypes { get; set; } = new List<PipeEntity>();

    public virtual ICollection<PipeEntity> PipeStartObjectTypes { get; set; } = new List<PipeEntity>();
}
