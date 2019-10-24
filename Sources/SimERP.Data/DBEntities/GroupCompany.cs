using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class GroupCompany
    {
        public int GroupCompanyId { get; set; }
        public string GroupCompanyCode { get; set; }
        public string GroupCompanyName { get; set; }
        public string Notes { get; set; }
        public int CreatedBy { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTimeOffset? ModifyDate { get; set; }
        public string SearchString { get; set; }
        public bool? IsActive { get; set; }
    }
}
