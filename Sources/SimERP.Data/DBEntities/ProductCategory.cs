using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class ProductCategory
    {
        public Guid ProductCategoryId { get; set; }
        public string ProductCategoryCode { get; set; }
        public string ProductCategoryName { get; set; }
        public Guid? ParentId { get; set; }
        public string ParentListId { get; set; }
        public string Notes { get; set; }
        public string SearchString { get; set; }
        public int CreatedBy { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTimeOffset? ModifyDate { get; set; }
        public bool? IsActive { get; set; }
        public int? SortOrder { get; set; }
    }
}
