namespace OilCollectionScheme.API.Contracts
{
    public record MeteringStationsResponse
    (
        int metering_station_id,
        string name,
        float cycle_time,
        float pressure,
        int flowline_count,
        int metering_station_type_id,
        int counter_type_id,
        double? longitude,
        double? latitude,
        int scheme_id
    );
}
