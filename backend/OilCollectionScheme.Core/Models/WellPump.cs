using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class WellPump
    {
        public WellPump(int wellPumpId, string name)
        {
            WellPumpId = wellPumpId;
            Name = name;
        }

        public int WellPumpId { get; }

        public string Name { get; } = null!;

        public ICollection<Well> Wells { get; } = new List<Well>();
    }

}
