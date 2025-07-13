using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class Employee
    {
        private Employee(int employeeId, string lastName, string firstName, string? middleName)
        {
            EmployeeId = employeeId;
            LastName = lastName;
            FirstName = firstName;
            MiddleName = middleName;
        }

        public int EmployeeId { get; }

        public string LastName { get; } = string.Empty;

        public string FirstName { get; } = string.Empty;

        public string? MiddleName { get; }

        public static (Employee Employee, string Error) Create(int employeeId, string lastName, string firstName, string? middleName)
        {
            var error = string.Empty;

            if (string.IsNullOrEmpty(lastName) || string.IsNullOrEmpty(firstName)) {
                error += "Last_name (Фамилия) и First_name (Имя) не должны быть пустыми";
            }

            var employee = new Employee(employeeId, lastName, firstName, middleName);
            return (employee, error);
        }
    }
}
