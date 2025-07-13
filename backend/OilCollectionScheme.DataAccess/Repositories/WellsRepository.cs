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
            var wells = wellEntities.Select(w => new Well(w.WellId, w.Name, w.WellTypeId, w.WellPumpId,
                    w.LengthStroke, w.NumberSwings, CoordinateMapper.toGeoPoint(w.Coordinate), w.SchemeId)
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

            var well = new Well(wellEntity.WellId, wellEntity.Name, wellEntity.WellTypeId, 
                wellEntity.WellPumpId, wellEntity.LengthStroke, wellEntity.NumberSwings, 
                CoordinateMapper.toGeoPoint(wellEntity.Coordinate), wellEntity.SchemeId);
            return well;
        }

        public async Task<int> CreateWell(Well well)
        {
            var ntsPoint = CoordinateMapper.toNtsPoint(well.Coordinate);
            var wellEntity = new WellEntity
            {
                Name = well.Name,
                WellTypeId = well.WellTypeId,
                WellPumpId = well.WellPumpId,
                LengthStroke = well.LengthStroke,
                NumberSwings = well.NumberSwings,
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
                    .SetProperty(w => w.WellTypeId, well.WellTypeId)
                    .SetProperty(w => w.WellPumpId, well.WellPumpId)
                    .SetProperty(w => w.LengthStroke, well.LengthStroke)
                    .SetProperty(w => w.NumberSwings, well.NumberSwings)
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
            var wellPumps = wellPumpEntities.Select(wp => new WellPump(wp.WellPumpId, wp.Name)).ToList();
            return wellPumps;
        }

        public async Task<List<WellType>> GetWellTypes()
        {
            var wellTypeEntities = await _context.WellTypes
                .AsNoTracking()
                .ToListAsync();
            var wellTypes = wellTypeEntities.Select(wt => new WellType(wt.WellTypeId, wt.Name)).ToList();
            return wellTypes;
        }
    }
}
