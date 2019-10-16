using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class ProductSupplier
    {
        public long RowId { get; set; }
        public int ProductId { get; set; }
        public int SupplierId { get; set; }
        public decimal? Price { get; set; }
        public string Notes { get; set; }
    }
}
