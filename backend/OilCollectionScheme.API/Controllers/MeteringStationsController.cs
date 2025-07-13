using Microsoft.AspNetCore.Mvc;
using OilCollectionScheme.API.Contracts;
using OilCollectionScheme.Core.Abstracts.Services;
using OilCollectionScheme.Core.Models;
using OilCollectionScheme.Core.Models.ValueObjects;
using OilCollectionScheme.DataAccess.Utils;

namespace OilCollectionScheme.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MeteringStationsController:ControllerBase
    {
        private readonly IMeteringStationsService _meteringStationsService;
       
        public MeteringStationsController(IMeteringStationsService meteringStationsService)
        {
            _meteringStationsService = meteringStationsService;
        }

        [HttpGet]
        public async Task<ActionResult<Dictionary<string, List<MeteringStationsResponse>>>> getAllMeteringStationsBySchemeId([FromQuery] int scheme_id)
        {
            var meteringStations = await _meteringStationsService.GetAllMeteringStationsBySchemeId(scheme_id);
            var response = meteringStations.Select(mt => 
                new MeteringStationsResponse(
                    mt.MeteringStationId,
                    mt.Name, mt.MeteringStationTypeId, 
                    mt.MeteringStationTypeId, 
                    mt.Coordinate?.Longitude, 
                    mt.Coordinate?.Latitude, 
                    mt.SchemeId
                )
            ).ToList();
            var result = new Dictionary<string, List<MeteringStationsResponse>>() { ["metering_stations"] = response };
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<int>> createMeteringStation([FromBody] MeteringStationRequest request)
        {
            var coordinate = (request.longitude == null || request.latitude == null)
                ? null
                : GeoPoint.Create((double)request.longitude, (double)request.latitude);
            var meteringStationId = await _meteringStationsService.CreateMeteringStation(
                new MeteringStation(
                    request.name,
                    request.metering_station_type_id,
                    request.counter_type_id,
                    coordinate,
                    request.scheme_id
                )
            );
            return Ok(meteringStationId);
        }

        [HttpPut("{metering_station_id:int}")]
        public async Task<ActionResult<int>> updateMeteringStation(int metering_station_id, [FromBody] MeteringStationRequest request)
        {
            var coordinate = (request.longitude == null || request.latitude == null)
                ? null
                : GeoPoint.Create((double)request.longitude, (double)request.latitude);
            var meteringStationId = await _meteringStationsService.UpdateMeteringStation(
                new MeteringStation(
                    metering_station_id,
                    request.name,
                    request.metering_station_type_id,
                    request.counter_type_id,
                    coordinate,
                    request.scheme_id
                )
            );
            return Ok(meteringStationId);
        }

        [HttpDelete("{metering_station_id:int}")]
        public async Task<ActionResult<int>> deleteMeteringStation(int metering_station_id)
        {
            var meteringStationId = await _meteringStationsService.DeleteMeteringStation(metering_station_id);
            return Ok(meteringStationId);
        }

        [HttpGet("/MeteringStationTypes")]
        public async Task<ActionResult<Dictionary<string, List<MeteringStationType>>>> getMeteringStationTypes()
        {
            var meteringStationTypes = await _meteringStationsService.GetMeteringStationTypes();
            var result = new Dictionary<string, List<MeteringStationType>>() { ["metering_station_types"] = meteringStationTypes };
            return Ok(result);
        }

    }
}
