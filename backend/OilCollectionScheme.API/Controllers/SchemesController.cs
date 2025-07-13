using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OilCollectionScheme.API.Contracts;
using OilCollectionScheme.Core.Abstracts.Services;
using OilCollectionScheme.Core.Models;

namespace OilCollectionScheme.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SchemesController : ControllerBase
    {
        private readonly ISchemesService _schemesService;

        public SchemesController(ISchemesService schemesService)
        {
            _schemesService = schemesService;
        }

        [HttpGet]
        public async Task<ActionResult<Dictionary<string, List<SchemesResponse>>>> getAllSchemes()
        {
            var schemes = await _schemesService.GetAllSchemes();
            var response = schemes
                .Select(s => new SchemesResponse(s.SchemeId, s.Name, s.DepartmentId, s.DepartmentId))
                .ToList();
            var responseSorted = response.OrderBy(e => e.scheme_id).ToList();
            var result = new Dictionary<string, List<SchemesResponse>>() { ["schemes"] = responseSorted };
            return Ok(result);
        }

        [HttpGet("{scheme_id:int}")]
        public async Task<ActionResult<SchemesResponse>> getScheme(int scheme_id)
        {
            var scheme = await _schemesService.GetScheme(scheme_id);
            if (scheme == null)
            {
                return NotFound("Не найдена схема с scheme_id="+scheme_id);
            }
            var response = new SchemesResponse(scheme.SchemeId, scheme.Name, scheme.DepartmentId, scheme.UserId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<int>> createScheme([FromBody] SchemesRequest request)
        {
            var scheme = Scheme.Create(null, request.name, request.department_id, request.user_id).Scheme;

            var schemeId = await _schemesService.CreateScheme(scheme);

            return Ok(schemeId);
        }

        [HttpPut("{scheme_id:int}")]
        public async Task<ActionResult<int>> updateScheme(int scheme_id, [FromBody] SchemesRequest request)
        {
            var schemeId = await _schemesService.UpdateScheme(scheme_id, request.name, request.department_id, request.user_id);

            return Ok(schemeId);
        }

        [HttpDelete("{scheme_id:int}")]
        public async Task<ActionResult<int>> deleteScheme(int scheme_id)
        {
            var schemeId = await _schemesService.DeleteScheme(scheme_id);

            return Ok(schemeId);
        }
    }
}
