using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class OptionSystem
    {
        public int OptionId { get; set; }
        public string OptionName { get; set; }
        public string OptionType { get; set; }
        public int? StoreId { get; set; }
        public string Value { get; set; }
        public string DataType { get; set; }
        public string Notes { get; set; }
    }
}
