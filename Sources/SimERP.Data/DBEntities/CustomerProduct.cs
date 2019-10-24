using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class CustomerProduct
    {
        public long RowId { get; set; }
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public int? SaleId { get; set; }
        public decimal? Price { get; set; }
        public string Notes { get; set; }
        public bool? IsActive { get; set; }
    }
}
