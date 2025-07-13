using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models.ValueObjects
{
    public class GeoPoint
    {
        [JsonConstructor]
        private GeoPoint(double longitude, double latitude)
        {
            Longitude = longitude;
            Latitude = latitude;
        }

        public double Longitude { get; } //X

        public double Latitude { get; } //Y

        public static GeoPoint Create(double longitude, double latitude) { 
            return new GeoPoint(longitude, latitude);
        }
    }
}
