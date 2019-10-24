using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class District
    {
        public int DistrictId { get; set; }
        public string DistrictCode { get; set; }
        public string DistrictName { get; set; }
        public int ProvinceId { get; set; }
        public int? SortOrder { get; set; }
    }
}
