using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Vendor
    {
        public int VendorId { get; set; }
        public string VendorCode { get; set; }
        public string VendorName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string FaxNumber { get; set; }
        public string Email { get; set; }
        public int? VendorTypeId { get; set; }
        public string TaxNumber { get; set; }
        public string CompanyName { get; set; }
        public string CompanyAddress { get; set; }
        public string BankingNumber { get; set; }
        public string BankingName { get; set; }
        public int? PaymentTermId { get; set; }
        public decimal DebtCeiling { get; set; }
        public string CurrencyId { get; set; }
        public string Website { get; set; }
        public string RepresentativeName { get; set; }
        public string RepresentativePhone { get; set; }
        public string RepresentativeAddress { get; set; }
        public string RepresentativeEmail { get; set; }
        public int CreatedBy { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTimeOffset? ModifyDate { get; set; }
        public string TrackingNote { get; set; }
        public string SearchString { get; set; }
        public bool IsActive { get; set; }
        public int? SortOrder { get; set; }
    }
}
