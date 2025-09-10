using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
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
    public class PumpingStationsRepository : IPumpingStationsRepository
    {
        private readonly DbOilCollectionContext _context;

        public PumpingStationsRepository(DbOilCollectionContext context)
        {
            _context = context;
        }

        public async Task<List<PumpingStation>> GetAllBySchemeId(int schemeId)
        {
            var pumpingStationEntities = await _context.PumpingStations
                .Where(pt => pt.SchemeId == schemeId)
                .AsNoTracking()
                .ToListAsync();
            var pumpingStations = pumpingStationEntities.Select(pt =>
                new PumpingStation(
                    pt.PumpingStationId,
                    pt.Name,
                    pt.PressureWorking,
                    pt.TankVolume,
                    pt.Throughput,
                    pt.PumpPerformance,
                    CoordinateMapper.toGeoPoint(pt.Coordinate),
                    pt.SchemeId
                )
            ).ToList();
            return pumpingStations;
        }

        public async Task<int> Create(PumpingStation pumpingStation)
        {
            var coordinate = CoordinateMapper.toNtsPoint(pumpingStation.Coordinate);
            var pumpingStationEntity = new PumpingStationEntity
            {
                Name = pumpingStation.Name,
                PressureWorking = pumpingStation.PressureWorking,
                TankVolume = pumpingStation.TankVolume,
                Throughput = pumpingStation.Throughput,
                PumpPerformance = pumpingStation.PumpPerformance,
                Coordinate = coordinate,
                SchemeId = pumpingStation.SchemeId
            };
            await _context.PumpingStations.AddAsync(pumpingStationEntity);
            await _context.SaveChangesAsync();
            return pumpingStationEntity.PumpingStationId;
        }

        public async Task<int> Update(PumpingStation pumpingStation)
        {
            var coordinate = CoordinateMapper.toNtsPoint(pumpingStation.Coordinate);
            await _context.PumpingStations
                .Where(pt => pt.PumpingStationId == pumpingStation.PumpingStationId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(pt => pt.Name, pumpingStation.Name)
                    .SetProperty(pt => pt.PressureWorking, pumpingStation.PressureWorking)
                    .SetProperty(pt => pt.TankVolume, pumpingStation.TankVolume)
                    .SetProperty(pt => pt.Throughput, pumpingStation.Throughput)
                    .SetProperty(pt => pt.PumpPerformance, pumpingStation.PumpPerformance)
                    .SetProperty(pt => pt.Coordinate, coordinate)
                    .SetProperty(pt => pt.SchemeId, pumpingStation.SchemeId)
                );
            return pumpingStation.PumpingStationId;
        }

        public async Task<int> Delete(int pumpingStationId)
        {
            await _context.PumpingStations
                .Where(pt => pt.PumpingStationId == pumpingStationId)
                .ExecuteDeleteAsync();
            return pumpingStationId;
        }
    }
}
