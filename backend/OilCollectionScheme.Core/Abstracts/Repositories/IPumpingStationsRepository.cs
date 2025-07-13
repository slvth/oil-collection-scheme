using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Repositories
{
    public interface IPumpingStationsRepository
    {
        Task<List<PumpingStation>> GetAllBySchemeId(int schemeId);
        Task<int> Create(PumpingStation pumpingStation);
        Task<int> Update(PumpingStation pumpingStation);
        Task<int> Delete(int pumpingStationId);
    }
}
