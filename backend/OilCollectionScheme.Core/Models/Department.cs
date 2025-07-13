using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class Department
    {
        public Department(int departmentId, string name)
        {
            DepartmentId = departmentId;
            Name = name;
        }

        public int DepartmentId { get; }

        public string Name { get; } = null!;

        public ICollection<Scheme> Schemes { get; } = new List<Scheme>();
    }
}
