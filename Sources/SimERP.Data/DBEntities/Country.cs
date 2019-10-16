using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Country
    {
        public string CountryId { get; set; }
        public string CountryName { get; set; }
        public int? SortOrder { get; set; }
        public string SearchString { get; set; }
    }
}
