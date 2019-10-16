using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class UserPermission
    {
        public int UserPermissionId { get; set; }
        public int UserId { get; set; }
        public int PermissionId { get; set; }
        public int? StoreId { get; set; }
    }
}
