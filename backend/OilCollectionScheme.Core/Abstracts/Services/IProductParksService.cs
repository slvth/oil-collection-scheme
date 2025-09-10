using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Services
{
    public interface IProductParksService
    {
        Task<List<ProductPark>> GetAllProductParksBySchemeId(int schemeId);
        Task<int> CreateProductPark(ProductPark storageTank);
        Task<int> UpdateProductPark(ProductPark storageTank);
        Task<int> DeleteProductPark(int storageTankId);
    }
}
