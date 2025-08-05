using OilCollectionScheme.Core.Abstracts.Repositories;
using OilCollectionScheme.Core.Abstracts.Services;
using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Application.Services
{
    public class PipesService: IPipesService
    {
        private readonly IPipesRepository _pipesRepository;

        public PipesService(IPipesRepository pipesRepository)
        {
            _pipesRepository = pipesRepository;
        }

        public async Task<List<Pipe>> GetAllPipesBySchemeId(int schemeId)
        {
           return await _pipesRepository.GetAllBySchemeId(schemeId);
        }

        public async Task<int> CreatePipe(Pipe pipe)
        {
            return await _pipesRepository.Create(pipe);
        }

        public async Task<int> UpdatePipe(Pipe pipe)
        {
            return await _pipesRepository.Update(pipe);
        }

        public async Task<int> DeletePipe(int pipeId)
        {
            return await _pipesRepository.Delete(pipeId);
        }
    }
}
