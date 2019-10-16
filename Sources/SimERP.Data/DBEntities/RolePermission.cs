using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class RolePermission
    {
        public int RolePermissionId { get; set; }
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
    }
}
