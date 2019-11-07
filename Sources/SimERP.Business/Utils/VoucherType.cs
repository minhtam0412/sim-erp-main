using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimERP.Business.Utils
{

    public static class VoucherType
    {
        public struct Sale
        {
            public const int SaleOrder = 101;
            public const int SaleInvoice = 102;
            public const int SaleReturn = 103;
        }

        public struct Purchase
        {
            public const int PurchaseOrder = 201;
            public const int PurchaseInvoice = 202;
            public const int PurchaseReturn = 203;
        }

        public struct Payment
        {
            public const int CashIn = 301;
            public const int CashOut = 302;
        }
    }
}
