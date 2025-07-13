using OilCollectionScheme.Core.Models.ValueObjects;

namespace OilCollectionScheme.API.Contracts
{
    public record PumpingStationsRequest
    (
        string name,
        double? longitude,
        double? latitude,
        int scheme_id
    );
}
