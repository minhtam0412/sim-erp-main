using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class VendorProduct
    {
        public long RowId { get; set; }
        public int ProductId { get; set; }
        public int VendorId { get; set; }
        public decimal? Price { get; set; }
        public string Notes { get; set; }
        public bool? IsActive { get; set; }
    }
}
