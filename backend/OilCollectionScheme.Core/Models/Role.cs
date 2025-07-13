using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class Role
    {
        public Role(int roleId, string name)
        {
            RoleId = roleId;
            Name = name;
        }

        public int RoleId { get; }
        public string Name { get; }
        public ICollection<User> Users { get; set; } = new List<User>();

        public static Role Create(int roleId, string name)
        {
            var role = new Role(roleId, name);
            return role;
        }
    }
}
