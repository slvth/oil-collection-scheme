using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models.ValueObjects
{
    public class GeoLineString
    {
        private GeoLineString(GeoPoint[] points)
        {
            Points = points;
        }
        public GeoPoint[] Points { get; }

        public static GeoLineString Create(GeoPoint[] points)
        {
            return new GeoLineString(points);
        }
    }
}
