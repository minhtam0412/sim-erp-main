using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Page
    {
        public int PageId { get; set; }
        public string PageName { get; set; }
        public string ControllerName { get; set; }
        public string ActionName { get; set; }
        public string FormName { get; set; }
        public string Parameter { get; set; }
        public int ModuleId { get; set; }
        public string Notes { get; set; }
        public int? PageType { get; set; }
        public int SortOrder { get; set; }
        public bool IsRunOnStore { get; set; }
        public bool? IsCheckSecurity { get; set; }
        public bool IsUserEditableData { get; set; }
        public bool? IsActive { get; set; }
        public string SearchString { get; set; }
    }
}
