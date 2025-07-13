using Microsoft.EntityFrameworkCore;
using OilCollectionScheme.Core.Abstracts.Repositories;
using OilCollectionScheme.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.DataAccess.Repositories
{
    public class EmployeesRepository: IEmployeesRepository
    {
        private readonly DbOilCollectionContext _context;

        public EmployeesRepository(DbOilCollectionContext context)
        {
            _context = context;
        }

        public async Task<List<Employee>> Get()
        {
            var employeeEntities = await _context.Employees
                .AsNoTracking()
                .ToListAsync();

            var employees = employeeEntities
                .Select(e=>Employee.Create(e.EmployeeId, e.LastName, e.FirstName, e.MiddleName).Employee)
                .ToList();

            return employees;
        }

        public async Task<int> Update(int employeeId, string lastName, string firstName, string middleName)
        {
            await _context.Employees.Where(e => e.EmployeeId == employeeId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(b => b.LastName, b => lastName)
                    .SetProperty(b => b.FirstName, b => firstName)
                    .SetProperty(b => b.MiddleName, b => middleName)
                );
            return employeeId;
        }
    }
}
