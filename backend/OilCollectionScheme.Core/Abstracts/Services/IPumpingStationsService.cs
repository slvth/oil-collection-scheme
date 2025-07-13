using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Services
{
    public interface IPumpingStationsService
    {
        Task<List<PumpingStation>> GetAllPumpingStationBySchemeId(int schemeId);
        Task<int> CreatePumpingStation(PumpingStation pumpingStation);
        Task<int> UpdatePumpingStation(PumpingStation pumpingStation);
        Task<int> DeletePumpingStation(int pumpingStationId);
    }
}
