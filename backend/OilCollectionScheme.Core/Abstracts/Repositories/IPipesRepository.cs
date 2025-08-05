using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Repositories
{
    public interface IPipesRepository
    {
        Task<List<Pipe>> GetAllBySchemeId(int schemeId);
        Task<int> Create(Pipe pipe);
        Task<int> Update(Pipe pipe);
        Task<int> Delete(int pipeId);
    }
}
