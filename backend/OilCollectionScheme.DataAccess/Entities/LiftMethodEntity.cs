using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.DataAccess.Entities
{
    public partial class LiftMethodEntity
    {
        public int LiftMethodId { get; set; }

        public string Name { get; set; } = null!;

        public virtual ICollection<DriveTypeEntity> DriveTypes { get; set; } = new List<DriveTypeEntity>();

        public virtual ICollection<WellPumpEntity> WellPumps { get; set; } = new List<WellPumpEntity>();
    }
}
