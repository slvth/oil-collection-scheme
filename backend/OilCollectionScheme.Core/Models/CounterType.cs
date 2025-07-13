using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class CounterType
    {
        public CounterType(int counterTypeId, string name)
        {
            CounterTypeId = counterTypeId;
            Name = name;
        }

        public int CounterTypeId { get; }

        public string Name { get; } = null!;

        public ICollection<MeteringStation> MeteringStations { get; } = new List<MeteringStation>();
    }
}
