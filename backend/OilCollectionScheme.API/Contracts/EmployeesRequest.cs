namespace OilCollectionScheme.API.Contracts
{
    public record EmployeesRequest
    (
        string last_name,
        string first_name,
        string middle_name
    );
}
