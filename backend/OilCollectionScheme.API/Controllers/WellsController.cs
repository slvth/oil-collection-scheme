using Microsoft.AspNetCore.Mvc;
using OilCollectionScheme.API.Contracts;
using OilCollectionScheme.Application.Services;
using OilCollectionScheme.Core.Abstracts.Services;
using OilCollectionScheme.Core.Models;
using OilCollectionScheme.Core.Models.ValueObjects;

namespace OilCollectionScheme.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WellsController: ControllerBase
    {
        private readonly IWellsService _wellService;

        public WellsController(IWellsService wellService)
        {
            _wellService = wellService;
        }

        [HttpGet]
        public async Task<ActionResult<Dictionary<string, IEnumerable<WellsResponse>>>> GetWellsBySchemeId([FromQuery]int scheme_id)
        {
            var wells = await _wellService.GetAllWellsBySchemeId(scheme_id);
            var response = wells.Select(w => 
                new WellsResponse(
                    w.WellId, 
                    w.Name, 
                    w.WellTypeId, 
                    w.WellPumpId, 
                    w.LengthStroke, 
                    w.NumberSwings, 
                    w.Coordinate?.Longitude, 
                    w.Coordinate?.Latitude, 
                    w.SchemeId
                )
            );
            var result = new Dictionary<string, IEnumerable<WellsResponse>>() { ["wells"] = response};
            return Ok(result);
        }

        [HttpGet("{well_id:int}")]
        public async Task<ActionResult<Well>> getWell(int well_id)
        {
            var well = await _wellService.GetWell(well_id);
            if (well == null)
            {
                return NotFound("Не найдена скважина с well_id=" + well_id);
            }
            return Ok(well);

        }

        [HttpPost]
        public async Task<ActionResult<int>> createWell([FromBody] WellsRequest request)
        {

            var coordinate = (request.longitude == null || request.latitude == null)
                ? null
                : GeoPoint.Create((double)request.longitude, (double)request.latitude);
            var well = new Well(null, request.name, request.well_type_id, 
                request.well_pump_id, request.length_stroke, request.number_swings, 
                coordinate, request.scheme_id);

            var wellId = await _wellService.CreateWell(well);

            return Ok(wellId);
        }

        [HttpPut("{well_id:int}")]
        public async Task<ActionResult<int>> updateWell(int well_id, [FromBody] WellsRequest request)
        {
            var coordinate = (request.longitude == null || request.latitude == null)
                ? null
                : GeoPoint.Create((double)request.longitude, (double)request.latitude);
            var well = new Well(well_id, request.name, request.well_type_id, 
                request.well_pump_id, request.length_stroke, request.number_swings, 
                coordinate, request.scheme_id);

            var wellId = await _wellService.UpdateWell(well_id, well);

            return Ok(wellId);
        }

        [HttpDelete("{well_id:int}")]
        public async Task<ActionResult<int>> deleteWell(int well_id)
        {
            await _wellService.DeleteWell(well_id);
            return well_id;
        }

        [HttpGet("/WellPumps")]
        public async Task<ActionResult<Dictionary<string, List<WellPump>>>> GetWellPumps()
        {
            var wellPumps = await _wellService.GetWellPumps();
            var result = new Dictionary<string, List<WellPump>>() { ["well_pumps"] =  wellPumps };

            return Ok(result);
        }

        [HttpGet("/WellTypes")]
        public async Task<ActionResult<Dictionary<string, List<WellType>>>> GetWellTypes()
        {
            var wellTypes = await _wellService.GetWellTypes();
            var result = new Dictionary<string, List<WellType>>() { ["well_types"] = wellTypes };

            return Ok(result);
        }
    }
}
