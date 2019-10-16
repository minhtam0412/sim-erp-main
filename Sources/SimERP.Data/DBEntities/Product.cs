using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Product
    {
        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public string Barcode { get; set; }
        public string Rfid { get; set; }
        public string ProductName { get; set; }
        public string ProductNameShort { get; set; }
        public decimal Price { get; set; }
        public decimal StandardCost { get; set; }
        public decimal PurchasePrice { get; set; }
        public Guid? ProductCategoryId { get; set; }
        public string ProductCategoryList { get; set; }
        public int UnitId { get; set; }
        public int TaxId { get; set; }
        public int? ImportTaxId { get; set; }
        public int ItemType { get; set; }
        public int ProductType { get; set; }
        public int CostMethod { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierProductCode { get; set; }
        public string SupplierProductName { get; set; }
        public string SupplierNotes { get; set; }
        public string TermCondition { get; set; }
        public string ThumbnailPhoto { get; set; }
        public string LargePhoto { get; set; }
        public int? LeadTime { get; set; }
        public string MadeIn { get; set; }
        public int? PackageUnitId { get; set; }
        public decimal? PackageUnit { get; set; }
        public decimal? WeightUnit { get; set; }
        public bool IsUsingExpireDate { get; set; }
        public int? ExpireDays { get; set; }
        public bool IsItemVirtual { get; set; }
        public bool IsPackage { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTimeOffset? ModifyDate { get; set; }
        public int? ModifyBy { get; set; }
        public string SearchString { get; set; }
        public bool? IsActive { get; set; }
        public string Note { get; set; }
    }
}
