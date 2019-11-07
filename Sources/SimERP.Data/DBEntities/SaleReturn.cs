using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class SaleReturn
    {
        public long SaleReturnId { get; set; }
        public string SaleReturnCode { get; set; }
        public DateTimeOffset AccountingDate { get; set; }
        public DateTimeOffset VoucherDate { get; set; }
        public DateTimeOffset DueDate { get; set; }
        public decimal Amount { get; set; }
        public decimal DiscountItemAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal AmountSub { get; set; }
        public bool IsDiscountPercent { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal DiscountTotalAmount { get; set; }
        public decimal FeeAmount { get; set; }
        public decimal ChargeAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalStandardCost { get; set; }
        public long? SaleInvoiceId { get; set; }
        public string ReferenceCode { get; set; }
        public int RefType { get; set; }
        public long? RefId { get; set; }
        public int? RRefType { get; set; }
        public string RRefCode { get; set; }
        public int? PaymentMethodId { get; set; }
        public int PaymentTermId { get; set; }
        public int? StockId { get; set; }
        public int FiscalId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerCode { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerAddress { get; set; }
        public string Notes { get; set; }
        public bool IsPost { get; set; }
        public int? PostedBy { get; set; }
        public DateTimeOffset? PostedDate { get; set; }
        public bool IsPay { get; set; }
        public int CreatedBy { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTimeOffset? ModifyDate { get; set; }
        public short? SourceType { get; set; }
        public int? DepartmentId { get; set; }
        public int? SaleRefId { get; set; }
        public int CodeCurrentNumber { get; set; }
        public short VoucherStatus { get; set; }
        public bool IsInventory { get; set; }
        public short InventoryStatus { get; set; }
        public int PaymentStatus { get; set; }
        public string SearchString { get; set; }
        public long? DeliveryId { get; set; }
        public string DeliveryPlace { get; set; }
        public string DeliveryAddress { get; set; }
        public string DeliveryNotes { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }
}
