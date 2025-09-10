using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class LiftMethod
    {
        public LiftMethod(int liftMethodId, string name)
        {
            LiftMethodId = liftMethodId;
            Name = name;
        }

        public int LiftMethodId { get; set; }

        public string Name { get; set; } = null!;

        public virtual ICollection<DriveType> DriveTypes { get; set; } = new List<DriveType>();

        public virtual ICollection<WellPump> WellPumps { get; set; } = new List<WellPump>();
    }
}
