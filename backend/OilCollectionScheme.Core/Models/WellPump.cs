using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class WellPump
    {
        public WellPump(int wellPumpId, string name, int liftMethodId)
        {
            WellPumpId = wellPumpId;
            Name = name;
            LiftMethodId = liftMethodId;
        }

        public int WellPumpId { get; }

        public string Name { get; } = null!;

        public int LiftMethodId { get; }

        public ICollection<Well> Wells { get; } = new List<Well>();

        public virtual LiftMethod LiftMethod { get; } = null!;
    }

}
