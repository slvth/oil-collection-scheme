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
    public class PumpingStationsController: ControllerBase
    {
        private readonly IPumpingStationsService _pumpingStationsService;

        public PumpingStationsController(IPumpingStationsService pumpingStationsService)
        {
            _pumpingStationsService = pumpingStationsService;
        }

        [HttpGet]
        public async Task<ActionResult<Dictionary<string,List<PumpingStationsResponse>>>> getAllPumpingStationBySchemeId(int scheme_id)
        {
            var pumpingStations = await _pumpingStationsService.GetAllPumpingStationBySchemeId(scheme_id);
            var response = pumpingStations.Select(pt =>
                new PumpingStationsResponse(
                    pt.PumpingStationId,
                    pt.Name,
                    pt.Coordinate?.Longitude,
                    pt.Coordinate?.Latitude,
                    pt.SchemeId
                )
            ).ToList();
            var result = new Dictionary<string, List<PumpingStationsResponse>>() { ["pumping_stations"] = response };

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<int>> createPumpingStation([FromBody] PumpingStationsRequest request)
        {
            var coordinate = (request.longitude == null || request.latitude == null)
                ? null
                : GeoPoint.Create((double)request.longitude, (double)request.latitude);
            var pumpingStationId = await _pumpingStationsService.CreatePumpingStation(
                new PumpingStation(
                    request.name,
                    coordinate,
                    request.scheme_id
                )
            );
            return Ok(pumpingStationId);
        }

        [HttpPut("{pumping_station_id:int}")]
        public async Task<ActionResult<int>> updatePumpingStation(int pumping_station_id, [FromBody] PumpingStationsRequest request)
        {
            var coordinate = (request.longitude == null || request.latitude == null)
                ? null
                : GeoPoint.Create((double)request.longitude, (double)request.latitude);
            var pumpingStationId = await _pumpingStationsService.UpdatePumpingStation(
                new PumpingStation(
                    pumping_station_id,
                    request.name,
                    coordinate,
                    request.scheme_id
                )
            );
            return Ok(pumpingStationId);
        }

        [HttpDelete("{pumping_station_id:int}")]
        public async Task<ActionResult<int>> deletePumpingStation(int pumping_station_id)
        {
            var pumpingStationId = await _pumpingStationsService.DeletePumpingStation(pumping_station_id);
            return Ok(pumping_station_id);
        }
    }
}
