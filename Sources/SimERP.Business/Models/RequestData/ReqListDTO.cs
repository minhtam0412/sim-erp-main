using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimERP.Business.Models.RequestData.ReqListDTO
{
    public class ReqTax : AuthenParams
    {
        public string SearchString { get; set; }
        public int StartRow { get; set; }
        public int MaxRows { get; set; }
    }
}