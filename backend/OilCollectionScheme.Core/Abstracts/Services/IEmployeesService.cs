using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Abstracts.Services
{
    public interface IEmployeesService
    {
        Task<List<Employee>> GetAllEmployees();
        Task<int> UpdateEmployee(int employeeId, string lastName, string firstName, string middleName);
    }
}
