namespace OilCollectionScheme.API.Contracts
{
    public record EmployeesResponse
    (
        int employee_id,
        string last_name,
        string first_name,
        string? middle_name
    );
}
