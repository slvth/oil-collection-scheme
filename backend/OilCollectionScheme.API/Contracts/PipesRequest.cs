using OilCollectionScheme.Core.Models.ValueObjects;
using System.ComponentModel.DataAnnotations;

namespace OilCollectionScheme.API.Contracts
{
    public record PipesRequest(
        [Required(ErrorMessage = "Укажите название (name)")]
        string name,

        [Range(1, int.MaxValue)]
        int start_object_id,

        [Range(1, int.MaxValue)]
        int start_object_type_id,

        [Range(1, int.MaxValue)]
        int end_object_id,

        [Range(1, int.MaxValue)]
        int end_object_type_id,

        GeoPoint[]? coordinates,

        [Range(1, int.MaxValue)]
        int scheme_id
    );
}
