namespace OilCollectionScheme.API.Contracts
{
    public record PumpingStationsResponse
    (
        int pumping_station_id,
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
