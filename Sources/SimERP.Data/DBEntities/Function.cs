using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Function
    {
        public string FunctionId { get; set; }
        public string FunctionName { get; set; }
        public string Notes { get; set; }
        public int SortOrder { get; set; }
        public bool IsSpecial { get; set; }
        public bool? IsActive { get; set; }
    }
}
