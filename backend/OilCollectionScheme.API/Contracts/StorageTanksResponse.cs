using OilCollectionScheme.Core.Models.ValueObjects;

namespace OilCollectionScheme.API.Contracts
{
    public record StorageTanksResponse
    (
        int storage_tank_id, 
        string name,
        double? longitude,
        double? latitude,
        int scheme_id
    );
}
