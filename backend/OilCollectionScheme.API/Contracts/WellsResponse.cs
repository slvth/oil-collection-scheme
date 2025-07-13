using System.ComponentModel.DataAnnotations;

namespace OilCollectionScheme.API.Contracts
{
    public record WellsResponse
    (
        int well_id,
        string name,
        int? well_type_id,
        int well_pump_id,
        float? LengthStroke,
        float? NumberSwings,
        double? Longitude,
        double? Latitude,
        int scheme_id
    );
}
