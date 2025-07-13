using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class ObjectType
    {
        public ObjectType(int objectTypeId, string name)
        {
            ObjectTypeId = objectTypeId;
            Name = name;
        }

        public int ObjectTypeId { get; }

        public string Name { get; } = null!;

        public ICollection<Pipe> PipeEndObjectTypes { get; } = new List<Pipe>();

        public ICollection<Pipe> PipeStartObjectTypes { get; } = new List<Pipe>();
    }
}
