using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Repositories
{
    public interface IStorageTanksRepository
    {
        Task<List<StorageTank>> GetAllBySchemeId(int schemeId);
        Task<int> Create(StorageTank storageTank);
        Task<int> Update(StorageTank storageTank);
        Task<int> Delete(int storageTankId);
    }
}
