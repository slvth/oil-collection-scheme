using OilCollectionScheme.Core.Models.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class Pipe
    {
        public Pipe(int pipeId, string name, int startObjectId, int startObjectTypeId, int endObjectId, int endObjectTypeId, GeoLineString? coordinates, int schemeId)
        {
            PipeId = pipeId;
            Name = name;
            StartObjectId = startObjectId;
            StartObjectTypeId = startObjectTypeId;
            EndObjectId = endObjectId;
            EndObjectTypeId = endObjectTypeId;
            Coordinates = coordinates;
            SchemeId = schemeId;
        }

        public int PipeId { get; }

        public string Name { get; } = null!;

        public int StartObjectId { get; }

        public int StartObjectTypeId { get; }

        public int EndObjectId { get; }

        public int EndObjectTypeId { get; }

        public GeoLineString? Coordinates { get; }

        public int SchemeId { get; }

        public ObjectType EndObjectType { get; } = null!;

        public ObjectType StartObjectType { get; } = null!;
    }
}
