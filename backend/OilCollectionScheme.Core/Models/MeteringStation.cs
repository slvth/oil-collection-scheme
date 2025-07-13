using OilCollectionScheme.Core.Models.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class MeteringStation
    {

        public MeteringStation(string name, int meteringStationTypeId, int counterTypeId, GeoPoint? coordinate, int schemeId)
        {
            Name = name;
            MeteringStationTypeId = meteringStationTypeId;
            CounterTypeId = counterTypeId;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public MeteringStation(int meteringStationId, string name, int meteringStationTypeId, int counterTypeId, GeoPoint? coordinate, int schemeId)
        {
            MeteringStationId = meteringStationId;
            Name = name;
            MeteringStationTypeId = meteringStationTypeId;
            CounterTypeId = counterTypeId;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public int MeteringStationId { get; }

        public string Name { get; } = null!;

        public int MeteringStationTypeId { get;  }

        public int CounterTypeId { get; }

        public GeoPoint? Coordinate { get; }

        public int SchemeId { get; }

        public CounterType CounterType { get; } = null!;

        public MeteringStationType MeteringStationType { get; } = null!;
    }
}
