using OilCollectionScheme.Core.Models.ValueObjects;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class ProductPark
    {
        public ProductPark(string name, GeoPoint? coordinate, int schemeId)
        {
            Name = name;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public ProductPark(int productParkId, string name, GeoPoint? coordinate, int schemeId)
        {
            ProductParkId = productParkId;
            Name = name;
            Coordinate = coordinate;
            SchemeId = schemeId;
        }

        public int ProductParkId { get; set; }

        public string Name { get; set; } = null!;

        public GeoPoint? Coordinate { get; set; }

        public int SchemeId { get; set; }
    }
}
