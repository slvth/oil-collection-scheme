using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace OilCollectionScheme.API.Contracts
{
    public record SchemesResponse (int? scheme_id, string name, int department_id, int user_id);
}
