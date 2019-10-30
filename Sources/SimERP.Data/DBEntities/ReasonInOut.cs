using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class ReasonInOut
    {
        public int ReasonId { get; set; }
        public string ReasonName { get; set; }
        public string Notes { get; set; }
        public int? SortOrder { get; set; }
        public bool? IsStockIn { get; set; }
        public bool? IsActive { get; set; }
    }
}
