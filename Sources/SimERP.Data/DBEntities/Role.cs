using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Role
    {
        public int RoleId { get; set; }
        public string RoleCode { get; set; }
        public string RoleName { get; set; }
        public int? StoreId { get; set; }
        public int? ModuleId { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTimeOffset? ModifyDate { get; set; }
        public int? ModifyBy { get; set; }
        public string Notes { get; set; }
        public string SearchString { get; set; }
        public bool IsActive { get; set; }
    }
}
