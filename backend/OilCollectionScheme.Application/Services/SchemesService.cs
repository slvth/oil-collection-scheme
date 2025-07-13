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
    public class SchemesService : ISchemesService
    {
        private readonly ISchemesRepository _schemesRepository;

        public SchemesService(ISchemesRepository schemesRepository) 
        {
            _schemesRepository = schemesRepository;
        }

        public async Task<int> CreateScheme(Scheme scheme)
        {
            return await _schemesRepository.Create(scheme);
        }

        public async Task<int> DeleteScheme(int schemeId)
        {
            return await _schemesRepository.Delete(schemeId);
        }

        public async Task<List<Scheme>> GetAllSchemes()
        {
            return await _schemesRepository.GetAll();
        }

        public async Task<Scheme?> GetScheme(int schemeId)
        {
            return await _schemesRepository.Get(schemeId);
        }

        public async Task<int> UpdateScheme(int schemeId, string name, int departmentId, int userId)
        {
            return await _schemesRepository.Update(schemeId, name, departmentId, userId);
        }
    }
}
