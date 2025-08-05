using NetTopologySuite;
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

        public static GeoPoint[]? toGeoLineString(LineString? ntsLineString)
        {
            if (ntsLineString == null)
            {
                return null;
            }
            var geoPoints = ntsLineString.Coordinates
                .Select((coordinate) => GeoPoint.Create(coordinate.Y, coordinate.X))
                .ToArray();
            //var geoLineString = GeoLineString.Create(geoPoints);
            return geoPoints;
        }
        public static LineString? toNtsLineString(GeoPoint[]? geoLineString)
        {
            if (geoLineString == null)
            {
                return null;
            }
            var coordinates = geoLineString.Select((point)=>new Coordinate(point.Latitude, point.Longitude)).ToArray();
            Console.WriteLine(coordinates);
            var ntsLineString = new LineString(coordinates);
            var ff = ntsLineString;
            Console.WriteLine(ntsLineString);
            return ntsLineString;
        }

    }
}
