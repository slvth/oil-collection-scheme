using Microsoft.AspNetCore.Mvc;
using OilCollectionScheme.API.Contracts;
using OilCollectionScheme.Core.Abstracts.Services;

namespace OilCollectionScheme.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeesService _employeesService;

        public EmployeesController(IEmployeesService employeesService)
        {
            _employeesService = employeesService;
        }

        [HttpGet]
        public async Task<ActionResult<Dictionary<string, IEnumerable<EmployeesResponse>>>> getEmployees()
        {
            var employees = await _employeesService.GetAllEmployees();

            var response = employees.Select(e => new EmployeesResponse(e.EmployeeId, e.LastName, e.FirstName, e.MiddleName));

            var responseSorted = response.OrderBy(e => e.employee_id);

            var result = new Dictionary<string, IEnumerable<EmployeesResponse>>() { ["employees"] = responseSorted };

            return Ok(result);
        }

        [HttpPut("{employee_id:int}")]
        public async Task<ActionResult<int>> updateEmployee(int employee_id, [FromBody] EmployeesRequest request)
        {
            var _employee_id = await _employeesService.UpdateEmployee(employee_id, request.last_name, request.first_name, request.middle_name);

            return Ok(_employee_id);
        }
    }
}
