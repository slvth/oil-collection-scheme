namespace OilCollectionScheme.API.Contracts
{
    public record PumpingStationsResponse
    (
        int pumping_station_id,
        string name,
        double? longitude,
        double? latitude,
        int scheme_id
    );
}
