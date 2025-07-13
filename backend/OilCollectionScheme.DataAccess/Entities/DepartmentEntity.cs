using System;
using System.Collections.Generic;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class DepartmentEntity
{
    public int DepartmentId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<SchemeEntity> Schemes { get; set; } = new List<SchemeEntity>();
}
