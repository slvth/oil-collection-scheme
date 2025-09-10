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
        public PumpingStation(
            string name,
            float pressureWorking,
            float tankVolume,
            float throughput,
            float pumpPerformance,
            GeoPoint? coordinate,
            int schemeId
        )
        {
            Name = name;
            PressureWorking = pressureWorking;
            TankVolume = tankVolume;
            Throughput = throughput;
            PumpPerformance = pumpPerformance;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public PumpingStation(
            int pumpingStationId,
            string name, 
            float pressureWorking, 
            float tankVolume, 
            float throughput, 
            float pumpPerformance, 
            GeoPoint? coordinate, 
            int schemeId
        )
        {
            PumpingStationId = pumpingStationId;
            Name = name;
            PressureWorking = pressureWorking;
            TankVolume = tankVolume;
            Throughput = throughput;
            PumpPerformance = pumpPerformance;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public int PumpingStationId { get; }

        public string Name { get; } = null!;

        public float PressureWorking { get; }

        public float TankVolume { get; }

        public float Throughput { get; }

        public float PumpPerformance { get; }

        public GeoPoint? Coordinate { get; }

        public int SchemeId { get; }
    }
}
