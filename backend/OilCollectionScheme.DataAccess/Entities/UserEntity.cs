using System;
using System.Collections.Generic;

namespace OilCollectionScheme.DataAccess.Entities;

public partial class UserEntity
{
    public int UserId { get; set; }

    public int EmployeeId { get; set; }

    public int RoleId { get; set; }

    public string Login { get; set; } = null!;

    public string Password { get; set; } = null!;

    public virtual EmployeeEntity Employee { get; set; } = null!;

    public virtual RoleEntity Role { get; set; } = null!;

    public virtual ICollection<SchemeEntity> Schemes { get; set; } = new List<SchemeEntity>();
}
