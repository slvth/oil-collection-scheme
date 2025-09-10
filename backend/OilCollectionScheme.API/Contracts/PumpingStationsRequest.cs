using OilCollectionScheme.Core.Models.ValueObjects;

namespace OilCollectionScheme.API.Contracts
{
    public record PumpingStationsRequest
    (
        string name,
        float pressure_working,
        float tank_volume,
        float throughput,
        float pump_performance,
        double? longitude,
        double? latitude,
        int scheme_id
    );
}
