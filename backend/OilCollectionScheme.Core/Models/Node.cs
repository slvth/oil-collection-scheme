using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace OilCollectionScheme.Core.Models
{
    public class Node
    {
        public Node(string name, int objectId, int objectTypeId)
        {
            Name = name;
            ObjectId = objectId;
            ObjectTypeId = objectTypeId;
        }

        public Guid NodeId { get; } = Guid.NewGuid();
        public string Name { get; } = string.Empty;
        public int ObjectId { get; }
        public int ObjectTypeId { get; }
        public List<Node> Children { get; } = new List<Node>();

        public void AddChildren(Node node)
        {
            Children.Add(node); 
        }
    }
}
