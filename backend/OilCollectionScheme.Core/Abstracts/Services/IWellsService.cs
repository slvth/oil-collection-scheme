using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Services
{
    public interface IWellsService
    {
        Task<List<Well>> GetAllWellsBySchemeId(int schemeId);
        Task<Well?> GetWell(int wellId);
        Task<int?> CreateWell(Well well);
        Task<int> UpdateWell(int wellId, Well well);
        Task<int> DeleteWell(int wellId);

        Task<List<LiftMethod>> GetLiftMethods();
        Task<List<Models.DriveType>> GetDriveTypes();
        Task<List<WellPump>> GetWellPumps();
    }
}
