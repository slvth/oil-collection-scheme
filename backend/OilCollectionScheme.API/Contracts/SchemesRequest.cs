using System.ComponentModel.DataAnnotations;

namespace OilCollectionScheme.API.Contracts
{
    public record SchemesRequest(
        [Required(ErrorMessage = "Укажите название (name)")] 
        string name,

        [Range(1, int.MaxValue)]
        int department_id,

        [Range(1, int.MaxValue, ErrorMessage = "userId должен быть > 0")]
        int user_id
    );
}