using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OilCollectionScheme.Core.Models
{
    public class DriveType
    {
        public DriveType(int driveTypeId, string name, int liftMethodId)
        {
            DriveTypeId = driveTypeId;
            Name = name;
            LiftMethodId = liftMethodId;
        }

        public int DriveTypeId { get; }

        public string Name { get; } = null!;

        public int LiftMethodId { get; }

        public ICollection<Well> Wells { get; } = new List<Well>();

        public LiftMethod LiftMethod { get; } = null!;
    }
}
