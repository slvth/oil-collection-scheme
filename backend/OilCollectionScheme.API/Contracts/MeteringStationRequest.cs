using OilCollectionScheme.Core.Models.ValueObjects;

namespace OilCollectionScheme.API.Contracts
{
    public record MeteringStationRequest(
        string name, 
        int metering_station_type_id, 
        int counter_type_id,
        double? longitude,
        double? latitude,
        int scheme_id
    );
}
