using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Fiscal
    {
        public int FiscalId { get; set; }
        public string FiscalName { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public DateTimeOffset ExpectedClosingDate { get; set; }
        public DateTimeOffset? RefreshDate { get; set; }
        public int? RefreshBy { get; set; }
        public DateTime? ClosePriceDate { get; set; }
        public int? ClosePriceBy { get; set; }
        public DateTimeOffset? ClosingDate { get; set; }
        public int? ClosingBy { get; set; }
        public DateTimeOffset? CancelDate { get; set; }
        public int? CancelBy { get; set; }
        public int? CreatedBy { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
        public string Notes { get; set; }
        public int Status { get; set; }
        public bool IsClosePrice { get; set; }
        public bool IsCurrent { get; set; }
    }
}
