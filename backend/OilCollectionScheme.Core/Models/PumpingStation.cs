using OilCollectionScheme.Core.Models.ValueObjects;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class PumpingStation
    {
        public PumpingStation(string name, GeoPoint? coordinate, int schemeId)
        {
            Name = name;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public PumpingStation(int pumpingStationId, string name, GeoPoint? coordinate, int schemeId)
        {
            PumpingStationId = pumpingStationId;
            Name = name;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public int PumpingStationId { get; set; }

        public string Name { get; set; } = null!;

        public GeoPoint? Coordinate { get; set; }

        public int SchemeId { get; set; }
    }
}
