using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class MeteringStationType
    {
        public MeteringStationType(int meteringStationTypeId, string name)
        {
            MeteringStationTypeId = meteringStationTypeId;
            Name = name;
        }

        public int MeteringStationTypeId { get; }

        public string Name { get; } = null!;

        public ICollection<MeteringStation> MeteringStations { get; } = new List<MeteringStation>();
    }
}
