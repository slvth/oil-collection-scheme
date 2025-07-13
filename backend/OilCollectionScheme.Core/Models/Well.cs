using OilCollectionScheme.Core.Models.ValueObjects;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class Well
    {
        public Well(int? wellId, string name, int? wellTypeId, int wellPumpId, float? lengthStroke, float? numberSwings, GeoPoint? coordinate, int schemeId)
        {
            WellId = wellId;
            Name = name;
            WellTypeId = wellTypeId;
            WellPumpId = wellPumpId;
            LengthStroke = lengthStroke;
            NumberSwings = numberSwings;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public int? WellId { get; }

        public string Name { get; } = null!;

        public int? WellTypeId { get; }

        public int WellPumpId { get; }

        public float? LengthStroke { get; }

        public float? NumberSwings { get; }

        //public Point? Coordinate { get; set; }

        //public double? Longitude { get; }

        //public double? Latitude { get; }

        public GeoPoint? Coordinate { get; }

        public int SchemeId { get; }

        public WellPump WellPump { get; } = null!;

        public WellType? WellType { get; }
    }
}
