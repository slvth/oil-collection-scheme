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
    public class ProductParksController: ControllerBase
    {
        private readonly IProductParksService _productParksService;

        public ProductParksController(IProductParksService productParksService)
        {
            _productParksService = productParksService;
        }

        [HttpGet]
        public async Task<ActionResult<Dictionary<string, List<ProductParksResponse>>>> getAllProductParksBySchemeId(int scheme_id)
        {
            var productParks = await _productParksService.GetAllProductParksBySchemeId(scheme_id);
            var response = productParks.Select(pt =>
                new ProductParksResponse(
                    pt.ProductParkId,
                    pt.Name,
                    pt.Coordinate?.Longitude,
                    pt.Coordinate?.Latitude,
                    pt.SchemeId
                )
            ).ToList();
            var result = new Dictionary<string, List<ProductParksResponse>>() { ["product_parks"] = response };

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<int>> createProductPark([FromBody] ProductParksRequest request)
        {
            var coordinate = (request.longitude == null || request.latitude == null)
                ? null
                : GeoPoint.Create((double)request.longitude, (double)request.latitude);
            var productParkId = await _productParksService.CreateProductPark(
                new ProductPark(
                    request.name,
                    coordinate,
                    request.scheme_id
                )
            );
            return Ok(productParkId);
        }

        [HttpPut("{product_park_id:int}")]
        public async Task<ActionResult<int>> updateProductPark(int product_park_id, [FromBody] ProductParksRequest request)
        {
            var coordinate = (request.longitude == null || request.latitude == null)
                ? null
                : GeoPoint.Create((double)request.longitude, (double)request.latitude);
            var productParkId = await _productParksService.UpdateProductPark(
                new ProductPark(
                    product_park_id,
                    request.name,
                    coordinate,
                    request.scheme_id
                )
            );
            return Ok(product_park_id);
        }

        [HttpDelete("{product_park_id:int}")]
        public async Task<ActionResult<int>> deleteProductPark(int product_park_id)
        {
            var productParkId = await _productParksService.DeleteProductPark(product_park_id);
            return Ok(productParkId);
        }
    }
}
