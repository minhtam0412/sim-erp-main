using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Permission
    {
        public int PermissionId { get; set; }
        public int PageId { get; set; }
        public string FunctionId { get; set; }
    }
}
