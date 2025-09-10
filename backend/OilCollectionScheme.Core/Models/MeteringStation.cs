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
        public MeteringStation(
           string name,
           float cycleTime,
           float pressure,
           int flowlineCount,
           int meteringStationTypeId,
           int counterTypeId,
           GeoPoint? coordinate,
           int schemeId
       )
        {
            Name = name;
            CycleTime = cycleTime;
            Pressure = pressure;
            FlowlineCount = flowlineCount;
            MeteringStationTypeId = meteringStationTypeId;
            CounterTypeId = counterTypeId;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public MeteringStation(
            int meteringStationId,
            string name,
            float cycleTime,
            float pressure,
            int flowlineCount,
            int meteringStationTypeId,
            int counterTypeId,
            GeoPoint? coordinate,
            int schemeId
        )
        {
            MeteringStationId = meteringStationId;
            Name = name;
            CycleTime = cycleTime;
            Pressure = pressure;
            FlowlineCount = flowlineCount;
            MeteringStationTypeId = meteringStationTypeId;
            CounterTypeId = counterTypeId;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }
        
        public int MeteringStationId { get; }

        public string Name { get; } = null!;

        public float CycleTime { get; }

        public float Pressure { get; }

        public int FlowlineCount { get; }

        public int MeteringStationTypeId { get;  }

        public int CounterTypeId { get; }

        public GeoPoint? Coordinate { get; }

        public int SchemeId { get; }

        public CounterType CounterType { get; } = null!;

        public MeteringStationType MeteringStationType { get; } = null!;
    }
}
