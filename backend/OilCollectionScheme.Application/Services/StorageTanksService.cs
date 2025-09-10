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
    public class StorageTanksService : IProductParksService
    {
        private readonly IProductParksRepository _storageTanksRepository;

        public StorageTanksService(IProductParksRepository storageTanksRepository)
        {
            _storageTanksRepository = storageTanksRepository;
        }

        public async Task<List<ProductPark>> GetAllProductParksBySchemeId(int schemeId)
        {
            return await _storageTanksRepository.GetAllBySchemeId(schemeId);
        }

        public async Task<int> CreateProductPark(ProductPark storageTank)
        {
            return await _storageTanksRepository.Create(storageTank);
        }

        public async Task<int> UpdateProductPark(ProductPark storageTank)
        {
            return await _storageTanksRepository.Update(storageTank);
        }

        public async Task<int> DeleteProductPark(int storageTankId)
        {
            return await _storageTanksRepository.Delete(storageTankId);
        }
    }
}
