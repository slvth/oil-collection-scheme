using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Repositories
{
    public interface IMeteringStationsRepository
    {
        Task<List<MeteringStation>> GetAllBySchemeId(int schemeId);
        Task<int> Create(MeteringStation meteringStation);
        Task<int> Update(MeteringStation meteringStation);
        Task<int> Delete(int meteringStationId);

        Task<List<MeteringStationType>> GetTypes();
    }
}
