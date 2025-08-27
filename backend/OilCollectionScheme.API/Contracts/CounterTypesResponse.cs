using OilCollectionScheme.Core.Models;

namespace OilCollectionScheme.API.Contracts
{
    public record CounterTypesResponse
    (
        int counter_type_id,
        string name
    );
}
