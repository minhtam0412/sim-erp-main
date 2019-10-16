using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Module
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public string Notes { get; set; }
        public int? SortOrder { get; set; }
        public bool? IsActive { get; set; }
    }
}
