using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class SaleInvoiceDetail
    {
        public long SaleInvoiceDetailId { get; set; }
        public long SaleInvoiceId { get; set; }
        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Amount { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal DiscountTotalAmount { get; set; }
        public decimal TaxPercent { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal ChargeAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal StandardCost { get; set; }
        public decimal TotalStandardCost { get; set; }
        public DateTime? ExpireDate { get; set; }
        public string LotNumber { get; set; }
        public string SerialNumber { get; set; }
        public DateTime? ManufactureDate { get; set; }
        public bool IsPromotion { get; set; }
        public string Notes { get; set; }
        public long? RefDetailId { get; set; }
        public int? SortOrder { get; set; }
    }
}
