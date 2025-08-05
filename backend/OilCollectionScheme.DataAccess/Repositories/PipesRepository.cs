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
    public class PipesRepository : IPipesRepository
    {
        private readonly DbOilCollectionContext _context;

        public PipesRepository(DbOilCollectionContext context)
        {
            _context = context;
        }

        public async Task<List<Pipe>> GetAllBySchemeId(int schemeId)
        {
           var pipeEntities = await _context.Pipes
                .Where((pipe) => pipe.SchemeId == schemeId)
                .AsNoTracking()
                .ToListAsync();
            var pipes = pipeEntities.Select((pipe) => 
                new Pipe(
                    pipe.SchemeId,
                    pipe.Name,
                    pipe.StartObjectId,
                    pipe.StartObjectTypeId,
                    pipe.EndObjectId,
                    pipe.EndObjectTypeId,
                    CoordinateMapper.toGeoLineString(pipe.Coordinates),
                    pipe.SchemeId
                )
            ).ToList();
            return pipes;
        }

        public async Task<int> Create(Pipe pipe)
        {
            var pipeEntity = new PipeEntity()
            {
                Name = pipe.Name,
                StartObjectId = pipe.StartObjectId,
                StartObjectTypeId = pipe.StartObjectTypeId,
                EndObjectId = pipe.EndObjectId,
                EndObjectTypeId = pipe.EndObjectTypeId,
                Coordinates = CoordinateMapper.toNtsLineString(pipe.Coordinates),
                SchemeId = pipe.SchemeId
            };
            await _context.Pipes.AddAsync(pipeEntity);
            await _context.SaveChangesAsync();
            return pipeEntity.PipeId;
        }

        public async Task<int> Update(Pipe pipe)
        {
            var ntsCoordinates = CoordinateMapper.toNtsLineString(pipe.Coordinates);
            await _context.Pipes
                .Where((p) => p.PipeId == pipe.PipeId)
                .ExecuteUpdateAsync((s)=>s
                    .SetProperty(p => p.Name, pipe.Name)
                    .SetProperty(p => p.StartObjectId, pipe.StartObjectId)
                    .SetProperty(p => p.StartObjectTypeId, pipe.StartObjectTypeId)
                    .SetProperty(p => p.EndObjectId, pipe.EndObjectId)
                    .SetProperty(p => p.EndObjectTypeId, pipe.EndObjectTypeId)
                    .SetProperty(p => p.Coordinates, ntsCoordinates)
                    .SetProperty(p => p.SchemeId, pipe.SchemeId)
                );
            return pipe.PipeId;
        }

        public async Task<int> Delete(int pipeId)
        {
            await _context.Pipes
                .Where((p) => p.PipeId == pipeId)
                .ExecuteDeleteAsync();
            return pipeId;
        }
    }
}
