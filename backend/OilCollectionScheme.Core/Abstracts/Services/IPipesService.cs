using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Services
{
    public interface IPipesService
    {
        Task<List<Pipe>> GetAllPipesBySchemeId(int schemeId);
        Task<int> CreatePipe(Pipe pipe);
        Task<int> UpdatePipe(Pipe pipe);
        Task<int> DeletePipe(int pipeId);
    }
}
