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
    public class StorageTanksService : IStorageTanksService
    {
        private readonly IStorageTanksRepository _storageTanksRepository;

        public StorageTanksService(IStorageTanksRepository storageTanksRepository)
        {
            _storageTanksRepository = storageTanksRepository;
        }

        public async Task<List<StorageTank>> GetAllStorageTanksBySchemeId(int schemeId)
        {
            return await _storageTanksRepository.GetAllBySchemeId(schemeId);
        }

        public async Task<int> CreateStorageTank(StorageTank storageTank)
        {
            return await _storageTanksRepository.Create(storageTank);
        }

        public async Task<int> UpdateStorageTank(StorageTank storageTank)
        {
            return await _storageTanksRepository.Update(storageTank);
        }

        public async Task<int> DeleteStorageTank(int storageTankId)
        {
            return await _storageTanksRepository.Delete(storageTankId);
        }
    }
}
