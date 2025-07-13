using Microsoft.EntityFrameworkCore;
using OilCollectionScheme.Core.Abstracts.Repositories;
using OilCollectionScheme.Core.Models;
using OilCollectionScheme.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace OilCollectionScheme.DataAccess.Repositories
{
    public class SchemesRepository : ISchemesRepository
    {
        private readonly DbOilCollectionContext _context;

        public SchemesRepository(DbOilCollectionContext context) {
            _context = context;
        }

        public async Task<int> Create(Scheme scheme)
        {
            var schemeEntity = new SchemeEntity
            {
                Name = scheme.Name,
                DepartmentId = scheme.DepartmentId,
                UserId = scheme.UserId,
            };
            await _context.Schemes.AddAsync(schemeEntity);
            await _context.SaveChangesAsync();

            return schemeEntity.SchemeId;
        }

        public async Task<int> Delete(int schemeId)
        {
            await _context.Schemes
                .Where(s => s.SchemeId == schemeId)
                .ExecuteDeleteAsync();
            return schemeId;
        }

        public async Task<int> Update(int schemeId, string name, int departmentId, int userId)
        {
            await _context.Schemes
                .Where(s => s.SchemeId == schemeId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(scheme=> scheme.Name, name)
                    .SetProperty(scheme=>scheme.DepartmentId, departmentId)
                    .SetProperty (scheme=> scheme.UserId, userId)
                );
            return schemeId;
        }

        public async Task<List<Scheme>> GetAll()
        {
            var schemeEntities = await _context.Schemes
                .AsNoTracking()
                .ToListAsync();
            var schemes = schemeEntities
                .Select(s=>Scheme.Create(s.SchemeId, s.Name, s.DepartmentId, s.UserId).Scheme)
                .ToList();
            return schemes;
        }

        public async Task<Scheme?> Get(int schemeId)
        {
            var schemeEntity = await _context.Schemes
               .AsNoTracking()
               .FirstOrDefaultAsync(s=>s.SchemeId==schemeId);

            if (schemeEntity == null)
                return null;

            var scheme = Scheme
                .Create(schemeEntity.SchemeId, schemeEntity.Name, schemeEntity.DepartmentId, schemeEntity.UserId)
                .Scheme;
            return scheme;
        }
    }
}
