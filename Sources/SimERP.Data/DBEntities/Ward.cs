using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Ward
    {
        public int WardId { get; set; }
        public string WardCode { get; set; }
        public string WardName { get; set; }
        public int DistrictId { get; set; }
        public int? SortOrder { get; set; }
    }
}
