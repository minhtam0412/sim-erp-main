using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class CustomerDelivery
    {
        public long RowId { get; set; }
        public string DeliveryPlace { get; set; }
        public string DeliveryAddress { get; set; }
        public string Notes { get; set; }
        public string CountryId { get; set; }
        public int? ProvinceId { get; set; }
        public int? DistrictId { get; set; }
        public int? WardId { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public int CustomerId { get; set; }
        public int? GroupCompanyId { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTimeOffset? ModifyDate { get; set; }
        public int? ModifyBy { get; set; }
        public bool? IsActive { get; set; }
    }
}
