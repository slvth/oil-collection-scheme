using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace OilCollectionScheme.Core.Models
{
    public class User
    {
        private User(int userId, int employeeId, int departmentId, string login, string password)
        {
            UserId = userId;
            EmployeeId = employeeId;
            RoleId = departmentId;
            Login = login;
            Password = password;
        }
        public int UserId { get; }

        public int EmployeeId { get; }

        public int RoleId { get; }

        public string Login { get; } = string.Empty;

        public string Password { get; } = string.Empty;

        public Role Role { get; } = null!;

        public static (User User, string Error) Create(int userId, int employeeId, int departmentId, string login, string password)
        {
            var error = string.Empty;

            if (string.IsNullOrWhiteSpace(login) || string.IsNullOrWhiteSpace(password)) {
                error += "login и password не должны быть пустыми";
            }

            var user = new User(userId, employeeId, departmentId, login, password);

            return (user, error);
        }
    }
}
