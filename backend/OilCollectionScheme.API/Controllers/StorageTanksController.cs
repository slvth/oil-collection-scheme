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
    public class StorageTanksController: ControllerBase
    {
        private readonly IStorageTanksService _storageTanksService;

        public StorageTanksController(IStorageTanksService storageTanksService)
        {
            _storageTanksService = storageTanksService;
        }

        [HttpGet]
        public async Task<ActionResult<Dictionary<string, List<StorageTanksResponse>>>> getAllStorageTanksBySchemeId(int schemeId)
        {
            var storageTanks = await _storageTanksService.GetAllStorageTanksBySchemeId(schemeId);
            var response = storageTanks.Select(pt =>
                new StorageTanksResponse(
                    pt.StorageTankId,
                    pt.Name,
                    pt.Coordinate?.Longitude,
                    pt.Coordinate?.Latitude,
                    pt.SchemeId
                )
            ).ToList();
            var result = new Dictionary<string, List<StorageTanksResponse>>() { ["storage_tanks"] = response };

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<int>> createStorageTank([FromBody] StorageTanksRequest request)
        {
            var coordinate = (request.longitude == null || request.latitude == null)
                ? null
                : GeoPoint.Create((double)request.longitude, (double)request.latitude);
            var storageTankId = await _storageTanksService.CreateStorageTank(
                new StorageTank(
                    request.name,
                    coordinate,
                    request.scheme_id
                )
            );
            return Ok(storageTankId);
        }

        [HttpPut("{storage_tank_id:int}")]
        public async Task<ActionResult<int>> updateStorageTank(int storage_tank_id, [FromBody] StorageTanksRequest request)
        {
            var coordinate = (request.longitude == null || request.latitude == null)
                ? null
                : GeoPoint.Create((double)request.longitude, (double)request.latitude);
            var storageTankId = await _storageTanksService.UpdateStorageTank(
                new StorageTank(
                    storage_tank_id,
                    request.name,
                    coordinate,
                    request.scheme_id
                )
            );
            return Ok(storage_tank_id);
        }

        [HttpDelete("{storage_tank_id:int}")]
        public async Task<ActionResult<int>> deleteStorageTank(int storage_tank_id)
        {
            var storageTankId = await _storageTanksService.DeleteStorageTank(storage_tank_id);
            return Ok(storageTankId);
        }
    }
}
