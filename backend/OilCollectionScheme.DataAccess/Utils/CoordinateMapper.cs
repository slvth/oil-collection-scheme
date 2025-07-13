using NetTopologySuite.Geometries;
using OilCollectionScheme.Core.Models.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.DataAccess.Utils
{
    public class CoordinateMapper
    {
        public static GeoPoint? toGeoPoint(Point? ntsPoint)
        {
            if (ntsPoint == null)
            {
                return null;
            }
            var geoPoint = GeoPoint.Create(ntsPoint.Y, ntsPoint.X);
            return geoPoint;
        }
        public static Point? toNtsPoint(GeoPoint? geoPoint)
        {
            if (geoPoint == null)
            {
                return null;
            }
            var coordinate = new Coordinate(geoPoint.Latitude, geoPoint.Longitude);
            var ntsPoint = new Point(coordinate);
            return ntsPoint;
        }
    }
}
