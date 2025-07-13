using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Repositories
{
    public interface IEmployeesRepository
    {
        Task<List<Employee>> Get();
        Task<int> Update(int employeeId, string lastName, string firstName, string middleName);
    }
}
