using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Stock
    {
        public int StockId { get; set; }
        public string StockCode { get; set; }
        public string StockName { get; set; }
        public string Address { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string Notes { get; set; }
        public int CreatedBy { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTimeOffset? ModifyDate { get; set; }
        public string SearchString { get; set; }
        public int SortOrder { get; set; }
        public bool? IsDefaultForSale { get; set; }
        public bool? IsDefaultForPurchase { get; set; }
        public bool? IsActive { get; set; }
    }
}
