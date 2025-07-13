using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Repositories
{
    public interface ISchemesRepository
    {
        Task<List<Scheme>> GetAll();
        Task<Scheme?> Get(int schemeId);
        Task<int> Create(Scheme scheme);
        Task<int> Update(int schemeId, string name, int departmentId, int userId);
        Task<int> Delete(int schemeId);
    }
}
