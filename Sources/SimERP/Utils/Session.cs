using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SimERP.Data.DBEntities;

namespace SimERP.Utils
{
    [Serializable]
    public class Session
    {
        public string LangID { get; set; } = "vi-VN";
        //public Fiscal Fiscal { get; set; } = new Fiscal();
        //public User User { get; set; } = new User();
        public int UserID { get; set; }
        public int FiscalID { get; set; }
        public bool IsLogin { get; set; } = false;
        public bool IsAdmin { get; set; } = false;
        public bool IsSecondPassword { get; set; } = false;
    }
}
