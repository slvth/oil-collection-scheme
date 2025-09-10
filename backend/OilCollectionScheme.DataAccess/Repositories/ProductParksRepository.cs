using Microsoft.EntityFrameworkCore;
using OilCollectionScheme.Core.Abstracts.Repositories;
using OilCollectionScheme.Core.Models;
using OilCollectionScheme.DataAccess.Entities;
using OilCollectionScheme.DataAccess.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.DataAccess.Repositories
{
    public class ProductParksRepository : IProductParksRepository
    {
        private readonly DbOilCollectionContext _context;

        public ProductParksRepository(DbOilCollectionContext context)
        {
            _context = context;
        }

        public async Task<List<ProductPark>> GetAllBySchemeId(int schemeId)
        {
            var productParkEntities = await _context.ProductParks
                .Where(st => st.SchemeId == schemeId)
                .AsNoTracking()
                .ToListAsync();
            var productParks = productParkEntities.Select(st =>
                new ProductPark(
                    st.ProductParkId,
                    st.Name,
                    CoordinateMapper.toGeoPoint(st.Coordinate),
                    st.SchemeId
                )
            ).ToList();
            return productParks;
        }

        public async Task<int> Create(ProductPark productPark)
        {
            var coordinate = CoordinateMapper.toNtsPoint(productPark.Coordinate);
            var productParkEntity = new ProductParkEntity
            {
                Name = productPark.Name,
                Coordinate = coordinate,
                SchemeId = productPark.SchemeId,
            };
            await _context.ProductParks.AddAsync(productParkEntity);
            await _context.SaveChangesAsync();
            return productParkEntity.ProductParkId;
        }

        public async Task<int> Update(ProductPark productPark)
        {
            var coordinate = CoordinateMapper.toNtsPoint(productPark.Coordinate);
            await _context.ProductParks
                .Where(st => st.SchemeId == productPark.SchemeId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(st => st.Name, productPark.Name)
                    .SetProperty(st => st.Coordinate, coordinate)
                    .SetProperty(st => st.SchemeId, productPark.SchemeId)
                );
            return productPark.ProductParkId;
        }

        public async Task<int> Delete(int productParkId)
        {
            await _context.ProductParks
                .Where(st => st.ProductParkId == productParkId)
                .ExecuteDeleteAsync();
            return productParkId;
        }
    }
}
