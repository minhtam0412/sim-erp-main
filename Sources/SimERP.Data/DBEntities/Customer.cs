using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Customer
    {
        public long CustomerId { get; set; }
        public string CustomerCode { get; set; }
        public string CustomerName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string FaxNumber { get; set; }
        public string Email { get; set; }
        public int? GroupCompanyId { get; set; }
        public int? CustomerTypeId { get; set; }
        public string CustomerTypeList { get; set; }
        public int? PaymentTermId { get; set; }
        public decimal DebtCeiling { get; set; }
        public string TaxNumber { get; set; }
        public string CompanyName { get; set; }
        public string CompanyAddress { get; set; }
        public string BankingNumber { get; set; }
        public string BankingName { get; set; }
        public string Notes { get; set; }
        public string RepresentativeName { get; set; }
        public string RepresentativePhone { get; set; }
        public string RepresentativeAddress { get; set; }
        public string RepresentativeEmail { get; set; }
        public int CreatedBy { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTimeOffset? ModifyDate { get; set; }
        public string CountryId { get; set; }
        public int? ProvinceId { get; set; }
        public int? DistrictId { get; set; }
        public int? WardId { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string SearchString { get; set; }
        public string TrackingNotes { get; set; }
        public bool IsGroupCompany { get; set; }
        public bool IsCompany { get; set; }
        public bool IsActive { get; set; }
        public int? SortOrder { get; set; }
    }
}
