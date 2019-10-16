using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class RefNo
    {
        public int RowId { get; set; }
        public int StoreId { get; set; }
        public string RefType { get; set; }
        public string FormateString { get; set; }
        public int Length { get; set; }
        public int? RRefType { get; set; }
        public string SqlQueryRefNo { get; set; }
        public string SqlQueryRefNoSql { get; set; }
        public string SequenceName { get; set; }
        public bool IsProfixDate { get; set; }
        public bool IsProfixMontYear { get; set; }
        public string Notes { get; set; }
    }
}
