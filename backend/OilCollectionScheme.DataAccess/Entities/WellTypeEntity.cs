using System;
using System.Collections.Generic;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class WellTypeEntity
{
    public int WellTypeId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<WellEntity> Wells { get; set; } = new List<WellEntity>();
}
