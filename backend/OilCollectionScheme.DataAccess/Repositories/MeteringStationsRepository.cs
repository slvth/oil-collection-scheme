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
using System.Xml.Linq;

namespace OilCollectionScheme.DataAccess.Repositories
{
    public class MeteringStationsRepository : IMeteringStationsRepository
    {
        private readonly DbOilCollectionContext _context;

        public MeteringStationsRepository(DbOilCollectionContext context)
        {
            _context = context;
        }

        public async Task<List<MeteringStation>> GetAllBySchemeId(int schemeId)
        {
            var meteringStationEntities = await _context.MeteringStations
                .Where(mt => mt.SchemeId == schemeId)
                .AsNoTracking()
                .ToListAsync();
            var meteringStations = meteringStationEntities.Select(mt =>
                new MeteringStation(
                    mt.MeteringStationId,
                    mt.Name,
                    mt.MeteringStationTypeId,
                    mt.CounterTypeId,
                    CoordinateMapper.toGeoPoint(mt.Coordinate),
                    mt.SchemeId
                )
            ).ToList();
            return meteringStations;
        }

        public async Task<int> Create(MeteringStation meteringStation)
        {
            var ntsPoint = CoordinateMapper.toNtsPoint(meteringStation.Coordinate);
            var meteringStationEntity = new MeteringStationEntity
            {
                Name = meteringStation.Name,
                MeteringStationTypeId = meteringStation.MeteringStationTypeId,
                CounterTypeId = meteringStation.CounterTypeId,
                Coordinate = ntsPoint,
                SchemeId = meteringStation.SchemeId,
            };
            await _context.MeteringStations.AddAsync(meteringStationEntity);
            await _context.SaveChangesAsync();
            return meteringStationEntity.MeteringStationId;
        }

        public async Task<int> Update(MeteringStation meteringStation)
        {
            var ntsPoint = CoordinateMapper.toNtsPoint(meteringStation.Coordinate);
            await _context.MeteringStations
                .ExecuteUpdateAsync(s => s
                    .SetProperty(mt => mt.Name, meteringStation.Name)
                    .SetProperty(mt => mt.CounterTypeId, meteringStation.CounterTypeId)
                    .SetProperty(mt => mt.Coordinate, ntsPoint)
                    .SetProperty(mt => mt.SchemeId, meteringStation.SchemeId)
                );
            return meteringStation.MeteringStationId;
        }

        public async Task<int> Delete(int meteringStationId)
        {
            await _context.MeteringStations
                .Where(ms => ms.MeteringStationId == meteringStationId)
                .ExecuteDeleteAsync();
            return meteringStationId;
        }

        public async Task<List<MeteringStationType>> GetTypes()
        {
            var typeEntities = await _context.MeteringStationTypes
                .AsNoTracking()
                .ToListAsync();
            var types = typeEntities.Select(t => 
                new MeteringStationType(
                    t.MeteringStationTypeId,
                    t.Name
                )
            ).ToList();
            return types;
        }
       
    }
}
