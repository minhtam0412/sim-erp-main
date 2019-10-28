using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class PaymentTerm
    {
        public int PaymentTermId { get; set; }
        public string PaymentTermName { get; set; }
        public int DueDate { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }
}
