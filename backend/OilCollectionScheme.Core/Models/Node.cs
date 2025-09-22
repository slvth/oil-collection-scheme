using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class Node
    {
        public int NodeId { get; }
        public string Name { get; } = string.Empty;
        public List<Node> Children { get; } = new List<Node>();
    }
}
