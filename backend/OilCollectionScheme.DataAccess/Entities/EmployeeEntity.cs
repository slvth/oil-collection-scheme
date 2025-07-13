using System;
using System.Collections.Generic;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class EmployeeEntity
{
    public int EmployeeId { get; set; }

    public string LastName { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string? MiddleName { get; set; }

    public virtual ICollection<UserEntity> Users { get; set; } = new List<UserEntity>();
}
