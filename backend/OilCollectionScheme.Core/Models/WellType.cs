using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class WellType
    {
        public WellType(int wellTypeId, string name)
        {
            WellTypeId = wellTypeId;
            Name = name;
        }

        public int WellTypeId { get; }

        public string Name { get; } = null!;

        public ICollection<Well> Wells { get; } = new List<Well>();
    }
}
