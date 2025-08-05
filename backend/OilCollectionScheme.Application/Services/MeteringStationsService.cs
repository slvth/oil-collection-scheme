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
    public class MeteringStationsService : IMeteringStationsService
    {
        private readonly IMeteringStationsRepository _meteringStationsRepository;

        public MeteringStationsService(IMeteringStationsRepository meteringStationsService)
        {
            _meteringStationsRepository = meteringStationsService;
        }

        public async Task<List<MeteringStation>> GetAllMeteringStationsBySchemeId(int schemeId)
        {
            return await _meteringStationsRepository.GetAllBySchemeId(schemeId);
        }

        public async Task<int> CreateMeteringStation(MeteringStation meteringStation)
        {
            return await _meteringStationsRepository.Create(meteringStation);
        }

        public async Task<int> DeleteMeteringStation(int meteringStationId)
        {
            return await _meteringStationsRepository.Delete(meteringStationId);
        }
        public async Task<int> UpdateMeteringStation(MeteringStation meteringStation)
        {
            return await _meteringStationsRepository.Update(meteringStation);
        }

        public async Task<List<MeteringStationType>> GetMeteringStationTypes()
        {
            return await _meteringStationsRepository.GetTypes();
        }

    }
}
