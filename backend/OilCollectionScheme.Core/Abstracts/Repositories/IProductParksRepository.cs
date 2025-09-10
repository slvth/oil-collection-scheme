using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Repositories
{
    public interface IProductParksRepository
    {
        Task<List<ProductPark>> GetAllBySchemeId(int schemeId);
        Task<int> Create(ProductPark storageTank);
        Task<int> Update(ProductPark storageTank);
        Task<int> Delete(int storageTankId);
    }
}
