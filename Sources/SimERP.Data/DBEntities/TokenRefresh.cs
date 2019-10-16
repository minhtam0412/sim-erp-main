using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class TokenRefresh
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Refreshtoken { get; set; }
        public bool? Revoked { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifedDate { get; set; }
    }
}
