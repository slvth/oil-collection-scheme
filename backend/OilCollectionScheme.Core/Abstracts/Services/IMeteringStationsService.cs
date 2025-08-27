using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Services
{
    public interface IMeteringStationsService
    {
        Task<List<MeteringStation>> GetAllMeteringStationsBySchemeId(int schemeId);
        Task<int> CreateMeteringStation(MeteringStation meteringStation);
        Task<int> UpdateMeteringStation(MeteringStation meteringStation);
        Task<int> DeleteMeteringStation(int meteringStationId);

        Task<List<MeteringStationType>> GetMeteringStationTypes();
        Task<List<CounterType>> GetCounterTypes();
    }
}
