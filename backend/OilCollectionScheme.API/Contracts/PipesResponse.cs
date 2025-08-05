using OilCollectionScheme.Core.Models.ValueObjects;
using System.ComponentModel.DataAnnotations;

namespace OilCollectionScheme.API.Contracts
{
    public record PipesResponse
    (
        int pipe_id,
        string name,
        int start_object_id,
        int start_object_type_id,
        int end_object_id,
        int end_object_type_id,
        GeoPoint[]? coordinates,
        int scheme_id
    );
}
