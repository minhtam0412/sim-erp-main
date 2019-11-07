using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Business.Models.Voucher.Sale;
using SimERP.Data;
using System.Collections.Generic;

namespace SimERP.Business.Interfaces.Voucher.Sale
{
    public interface ISaleInvoiceDetail : IRepository<SaleInvoiceDetail>
    {
        List<SaleInvoiceDetail> GetData(ReqListSearch reqListSearch);
    }
}