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
    public class StorageTanksRepository : IStorageTanksRepository
    {
        private readonly DbOilCollectionContext _context;

        public StorageTanksRepository(DbOilCollectionContext context)
        {
            _context = context;
        }

        public async Task<List<StorageTank>> GetAllBySchemeId(int schemeId)
        {
            var storageTankEntities = await _context.StorageTanks
                .Where(st => st.SchemeId == schemeId)
                .AsNoTracking()
                .ToListAsync();
            var storageTanks = storageTankEntities.Select(st =>
                new StorageTank(
                    st.StorageTankId,
                    st.Name,
                    CoordinateMapper.toGeoPoint(st.Coordinate),
                    st.SchemeId
                )
            ).ToList();
            return storageTanks;
        }

        public async Task<int> Create(StorageTank storageTank)
        {
            var coordinate = CoordinateMapper.toNtsPoint(storageTank.Coordinate);
            var storageTankEntity = new StorageTankEntity
            {
                Name = storageTank.Name,
                Coordinate = coordinate,
                SchemeId = storageTank.SchemeId,
            };
            await _context.StorageTanks.AddAsync(storageTankEntity);
            await _context.SaveChangesAsync();
            return storageTankEntity.StorageTankId;
        }

        public async Task<int> Update(StorageTank storageTank)
        {
            var coordinate = CoordinateMapper.toNtsPoint(storageTank.Coordinate);
            await _context.StorageTanks
                .Where(st => st.SchemeId == storageTank.SchemeId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(st => st.Name, storageTank.Name)
                    .SetProperty(st => st.Coordinate, coordinate)
                    .SetProperty(st => st.SchemeId, storageTank.SchemeId)
                );
            return storageTank.StorageTankId;
        }

        public async Task<int> Delete(int storageTankId)
        {
            await _context.StorageTanks
                .Where(st => st.StorageTankId == storageTankId)
                .ExecuteDeleteAsync();
            return storageTankId;
        }
    }
}
