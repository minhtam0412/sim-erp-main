using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class Message
    {
        public string Code { get; set; }
        public string LangId { get; set; }
        public string Messages { get; set; }
        public string Notes { get; set; }
    }
}
