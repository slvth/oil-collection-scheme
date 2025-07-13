using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class Scheme
    {
        private Scheme(int? schemeId, string name, int departmentId, int userId) {
            SchemeId = schemeId;
            Name = name;
            DepartmentId = departmentId;
            UserId = userId;
        }
        public int? SchemeId { get; }
        public string Name { get; } = string.Empty;
        public int DepartmentId { get; }
        public int UserId { get; }
        public Department Department { get; } = null!;

        public static (Scheme Scheme, string Error) Create(int? schemeId, string name, int departmentId, int userId)
        {
            var error = string.Empty;

            if (string.IsNullOrEmpty(name))
            {
                error += "Название схемы не должен быть пустым";
            }

            var scheme = new Scheme(schemeId, name, departmentId, userId);

            return (scheme, error);
        }
    }
}
