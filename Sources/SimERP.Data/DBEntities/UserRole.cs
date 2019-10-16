using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class UserRole
    {
        public int UserRoleId { get; set; }
        public int? StoreId { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
    }
}
