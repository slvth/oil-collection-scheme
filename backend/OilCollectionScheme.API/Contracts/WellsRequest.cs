using OilCollectionScheme.Core.Models.ValueObjects;
using System.ComponentModel.DataAnnotations;

namespace OilCollectionScheme.API.Contracts
{
    public record WellsRequest
    (
        [Required(ErrorMessage = "Укажите название (name)")]
        string name,

        int? well_type_id,

        [Range(1, int.MaxValue, ErrorMessage = "well_pump_id должен быть > 0")]
        int well_pump_id,

        float? length_stroke,
        float? number_swings,
        double? longitude,
        double? latitude,

        [Range(1, int.MaxValue, ErrorMessage = "scheme_id должен быть > 0")]
        int scheme_id
    );
}
