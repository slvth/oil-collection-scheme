namespace OilCollectionScheme.API.Contracts
{
    public record StorageTanksRequest
    (
        string name,
        double? longitude,
        double? latitude,
        int scheme_id
    );
}
