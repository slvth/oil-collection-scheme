using Microsoft.EntityFrameworkCore;
using OilCollectionScheme.Core.Abstracts.Repositories;
using OilCollectionScheme.Core.Models;
using OilCollectionScheme.DataAccess.Entities;
using OilCollectionScheme.DataAccess.Utils;

namespace OilCollectionScheme.DataAccess.Repositories
{
    public class WellsRepository : IWellsRepository
    {
        private readonly DbOilCollectionContext _context;

        public WellsRepository(DbOilCollectionContext context)
        {
            _context = context;
        }

        public async Task<List<Well>> GetAllWellsBySchemeId(int schemeId)
        {
            var wellEntities = await _context.Wells
                .Where(w => w.SchemeId==schemeId)
                .AsNoTracking()
                .ToListAsync();
            var wells = wellEntities.Select(w => 
                new Well(
                    w.WellId,
                    w.Name,
                    w.DriveTypeId,
                    w.WellPumpId,
                    w.LengthStroke,
                    w.NumberSwings,
                    w.WaterCut,
                    w.FlowRate,
                    w.FlowRateOil,
                    CoordinateMapper.toGeoPoint(w.Coordinate),
                    w.SchemeId
                )
            ).ToList();
            return wells;
        }

        public async Task<Well?> GetWell(int wellId)
        {
            var wellEntity = await _context.Wells
                .AsNoTracking()
                .FirstOrDefaultAsync(w => w.WellId==wellId);
            
            if(wellEntity == null)
                return null;

            var well = new Well(
                wellEntity.WellId,
                wellEntity.Name,
                wellEntity.DriveTypeId,
                wellEntity.WellPumpId,
                wellEntity.LengthStroke,
                wellEntity.NumberSwings,
                wellEntity.WaterCut,
                wellEntity.FlowRate,
                wellEntity.FlowRateOil,
                CoordinateMapper.toGeoPoint(wellEntity.Coordinate),
                wellEntity.SchemeId
            );
            return well;
        }

        public async Task<int> CreateWell(Well well)
        {
            var ntsPoint = CoordinateMapper.toNtsPoint(well.Coordinate);
            var wellEntity = new WellEntity
            {
                Name = well.Name,
                DriveTypeId = well.DriveTypeId,
                WellPumpId = well.WellPumpId,
                LengthStroke = well.LengthStroke,
                NumberSwings = well.NumberSwings,
                WaterCut = well.WaterCut,
                FlowRate = well.FlowRate,
                FlowRateOil = well.FlowRateOil,
                Coordinate = ntsPoint,
                SchemeId = well.SchemeId
            };
            await _context.Wells.AddAsync(wellEntity);
            await _context.SaveChangesAsync();
            return wellEntity.WellId;
        }

        public async Task<int> UpdateWell(int wellId, Well well)
        {
            var coordinate = CoordinateMapper.toNtsPoint(well.Coordinate);
            var wellEntity = await _context.Wells
                .Where(w => w.WellId == wellId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(w => w.DriveTypeId, well.DriveTypeId)
                    .SetProperty(w => w.WellPumpId, well.WellPumpId)
                    .SetProperty(w => w.LengthStroke, well.LengthStroke)
                    .SetProperty(w => w.NumberSwings, well.NumberSwings)
                    .SetProperty(w => w.WaterCut, well.WaterCut)
                    .SetProperty(w => w.FlowRate, well.FlowRate)
                    .SetProperty(w => w.FlowRateOil, well.FlowRateOil)
                    .SetProperty(w => w.Coordinate, coordinate)
                    .SetProperty(w => w.SchemeId, well.SchemeId)
                );
            return wellId;
        }

        public async Task<int> DeleteWell(int wellId)
        {
            await _context.Wells
                .Where(w => w.WellId == wellId)
                .ExecuteDeleteAsync();
            return wellId;
        }

        public async Task<List<WellPump>> GetWellPumps()
        {
            var wellPumpEntities = await _context.WellPumps
                .AsNoTracking()
                .ToListAsync();
            var wellPumps = wellPumpEntities.Select(wp => 
                new WellPump(
                    wp.WellPumpId,
                    wp.Name, 
                    wp.LiftMethodId
                )
            ).ToList();
            return wellPumps;
        }

        public async Task<List<Core.Models.DriveType>> GetDriveTypes()
        {
            var driveTypeEntities = await _context.DriveTypes
                .AsNoTracking()
                .ToListAsync();
            var driveTypes = driveTypeEntities.Select(dt => 
                new Core.Models.DriveType(
                    dt.DriveTypeId,
                    dt.Name,
                    dt.LiftMethodId
                )
            ).ToList();
            return driveTypes;
        }

        public async Task<List<LiftMethod>> GetLiftMethods()
        {
            var liftMethodEntities = await _context.LiftMethods
                .AsNoTracking()
                .ToListAsync();
            var liftMethods = liftMethodEntities.Select(lm =>
                new LiftMethod(
                    lm.LiftMethodId,
                    lm.Name
                )
            ).ToList();
            return liftMethods;
        }
    }
}
