using OilCollectionScheme.Core.Models.ValueObjects;

namespace OilCollectionScheme.API.Contracts
{
    public record ProductParksResponse
    (
        int product_park_id, 
        string name,
        double? longitude,
        double? latitude,
        int scheme_id
    );
}
