using OilCollectionScheme.Core.Models.ValueObjects;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class StorageTank
    {
        public StorageTank(string name, GeoPoint? coordinate, int schemeId)
        {
            Name = name;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public StorageTank(int storageTankId, string name, GeoPoint? coordinate, int schemeId)
        {
            StorageTankId = storageTankId;
            Name = name;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public int StorageTankId { get; set; }

        public string Name { get; set; } = null!;

        public GeoPoint? Coordinate { get; set; }

        public int SchemeId { get; set; }
    }
}
