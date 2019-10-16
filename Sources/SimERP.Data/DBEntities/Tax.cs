using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Tax
    {
        public int TaxId { get; set; }
        public string TaxCode { get; set; }
        public string TaxName { get; set; }
        public decimal TaxPercent { get; set; }
        public int CreatedBy { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTimeOffset? ModifyDate { get; set; }
        public string Notes { get; set; }
        public string SearchString { get; set; }
        public int? SortOrder { get; set; }
        public bool IsActive { get; set; }
    }
}
