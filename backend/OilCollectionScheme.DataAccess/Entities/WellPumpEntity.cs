using System;
using System.Collections.Generic;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class WellPumpEntity
{
    public int WellPumpId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<WellEntity> Wells { get; set; } = new List<WellEntity>();
}
