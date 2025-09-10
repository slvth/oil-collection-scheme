namespace OilCollectionScheme.API.Contracts
{
    public record ProductParksRequest
    (
        string name,
        double? longitude,
        double? latitude,
        int scheme_id
    );
}
