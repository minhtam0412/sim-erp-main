using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class UserEditableData
    {
        public long RowId { get; set; }
        public int? UserId { get; set; }
        public int PageId { get; set; }
        public string OwnerListId { get; set; }
        public string OwnerListFullName { get; set; }
        public bool IsAllUser { get; set; }
    }
}
