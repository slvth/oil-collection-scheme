using OilCollectionScheme.Core.Models.ValueObjects;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class Well
    {
        public Well(
           string name,
           int? driveTypeId,
           int wellPumpId,
           float? lengthStroke,
           float? numberSwings,
           float waterCut,
           float flowRate,
           float flowRateOil,
           GeoPoint? coordinate,
           int schemeId
       )
        {
            Name = name;
            DriveTypeId = driveTypeId;
            WellPumpId = wellPumpId;
            LengthStroke = lengthStroke;
            NumberSwings = numberSwings;
            WaterCut = waterCut;
            FlowRate = flowRate;
            FlowRateOil = flowRateOil;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public Well(
            int wellId,
            string name,
            int? driveTypeId,
            int wellPumpId,
            float? lengthStroke,
            float? numberSwings,
            float waterCut,
            float flowRate,
            float flowRateOil,
            GeoPoint? coordinate,
            int schemeId
        )
        {
            WellId = wellId;
            Name = name;
            DriveTypeId = driveTypeId;
            WellPumpId = wellPumpId;
            LengthStroke = lengthStroke;
            NumberSwings = numberSwings;
            WaterCut = waterCut;
            FlowRate = flowRate;
            FlowRateOil = flowRateOil;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public int WellId { get; }

        public string Name { get; } = null!;

        public int? DriveTypeId { get; }

        public int WellPumpId { get; }

        public float? LengthStroke { get; }

        public float? NumberSwings { get; }

        public float WaterCut { get; set; }

        public float FlowRate { get; set; }

        public float FlowRateOil { get; set; }

        //public Point? Coordinate { get; set; }

        //public double? Longitude { get; }

        //public double? Latitude { get; }

        public GeoPoint? Coordinate { get; }

        public int SchemeId { get; }

        public WellPump WellPump { get; } = null!;

        public DriveType? DriveType { get; }
    }
}
