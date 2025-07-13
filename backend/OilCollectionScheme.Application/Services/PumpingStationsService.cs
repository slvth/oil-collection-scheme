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
    public class PumpingStationsService : IPumpingStationsService
    {
        private readonly IPumpingStationsRepository _pumpingStationsRepository;

        public PumpingStationsService(IPumpingStationsRepository pumpingStationsRepository)
        {
            _pumpingStationsRepository = pumpingStationsRepository;
        }

        public async Task<List<PumpingStation>> GetAllPumpingStationBySchemeId(int schemeId)
        {
            return await _pumpingStationsRepository.GetAllBySchemeId(schemeId);
        }

        public async Task<int> CreatePumpingStation(PumpingStation pumpingStation)
        {
            return await _pumpingStationsRepository.Create(pumpingStation);
        }

        public async Task<int> UpdatePumpingStation(PumpingStation pumpingStation)
        {
            return await _pumpingStationsRepository.Update(pumpingStation);
        }

        public async Task<int> DeletePumpingStation(int pumpingStationId)
        {
            return await _pumpingStationsRepository.Delete(pumpingStationId);
        }
    }
}
