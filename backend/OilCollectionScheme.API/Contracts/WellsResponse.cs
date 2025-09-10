using System.ComponentModel.DataAnnotations;

namespace OilCollectionScheme.API.Contracts
{
    public record WellsResponse
    (
        int well_id,
        string name,
        int? drive_type_id,
        int well_pump_id,
        float? length_stroke,
        float? number_swings,
        float water_cut,
        float flow_rate,
        float flow_rate_oil,
        double? longitude,
        double? latitude,
        int scheme_id
    );
}
