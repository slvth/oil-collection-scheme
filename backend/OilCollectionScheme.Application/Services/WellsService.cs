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
    public class WellsService : IWellsService
    {
        private readonly IWellsRepository _wellsRepository;

        public WellsService(IWellsRepository wellsRepository)
        {
            _wellsRepository = wellsRepository;
        }

        public async Task<List<Well>> GetAllWellsBySchemeId(int schemeId)
        {
            return await _wellsRepository.GetAllWellsBySchemeId(schemeId);
        }

        public async Task<Well?> GetWell(int wellId)
        {
            return await _wellsRepository.GetWell(wellId);
        }

        public async Task<int?> CreateWell(Well well)
        {
            return await _wellsRepository.CreateWell(well);
        }

        public async Task<int> UpdateWell(int wellId, Well well)
        {
            return await _wellsRepository.UpdateWell(wellId, well);
        }

        public async Task<int> DeleteWell(int wellId)
        {
            return await _wellsRepository.DeleteWell(wellId);
        }

        public async Task<List<WellPump>> GetWellPumps()
        {
            return await _wellsRepository.GetWellPumps();
        }

        public async Task<List<WellType>> GetWellTypes()
        {
            return await _wellsRepository.GetWellTypes();
        }


    }
}
