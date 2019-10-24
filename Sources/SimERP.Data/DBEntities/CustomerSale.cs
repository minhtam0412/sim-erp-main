using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class CustomerSale
    {
        public long RowId { get; set; }
        public int CustomerId { get; set; }
        public int SaleId { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTimeOffset? FromDate { get; set; }
        public DateTimeOffset? ToDate { get; set; }
        public string Notes { get; set; }
        public bool? IsActive { get; set; }
    }
}
