namespace OilCollectionScheme.API.Contracts
{
    public record DriveTypesResponse
    (
        int drive_type_id,
        string name,
        int lift_method_id
    );
}
