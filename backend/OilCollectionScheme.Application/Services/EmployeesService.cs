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
    public class EmployeesService:IEmployeesService
    {
        private readonly IEmployeesRepository _employeesRepository;

        public EmployeesService(IEmployeesRepository employeeRepository)
        {
            _employeesRepository = employeeRepository;
        }

        public async Task<List<Employee>> GetAllEmployees()
        {
            return await _employeesRepository.Get();
        }

        public async Task<int> UpdateEmployee(int employeeId, string lastName, string firstName, string middleName)
        {
            return await _employeesRepository.Update(employeeId, lastName, firstName, middleName);
        }
    }
}
