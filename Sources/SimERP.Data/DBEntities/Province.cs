using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Province
    {
        public int ProvinceId { get; set; }
        public string ProvinceCode { get; set; }
        public string ProvinceName { get; set; }
        public string CountryId { get; set; }
        public int? SortOrder { get; set; }
    }
}
