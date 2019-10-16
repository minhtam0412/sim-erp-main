using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class AttachFile
    {
        public long AttachId { get; set; }
        public string KeyValue { get; set; }
        public string OptionName { get; set; }
        public string FileTitle { get; set; }
        public string Desctiption { get; set; }
        public string FileNameOriginal { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public decimal? FileSize { get; set; }
        public int CreatedBy { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public int? SortOrder { get; set; }
    }
}
