using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Services
{
    public interface IStorageTanksService
    {
        Task<List<StorageTank>> GetAllStorageTanksBySchemeId(int schemeId);
        Task<int> CreateStorageTank(StorageTank storageTank);
        Task<int> UpdateStorageTank(StorageTank storageTank);
        Task<int> DeleteStorageTank(int storageTankId);
    }
}
