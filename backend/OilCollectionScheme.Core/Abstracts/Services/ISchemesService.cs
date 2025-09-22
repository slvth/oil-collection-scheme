using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Services
{
    public interface ISchemesService
    {
        Task<List<Scheme>> GetAllSchemes();
        Task<Scheme?> GetScheme(int schemeId);
        Task<int> CreateScheme(Scheme scheme);
        Task<int> UpdateScheme(int schemeId, string name, int departmentId, int userId);
        Task<int> DeleteScheme(int schemeId);
        int ImportSchemeData(string schemeName, byte file);

    }
}
