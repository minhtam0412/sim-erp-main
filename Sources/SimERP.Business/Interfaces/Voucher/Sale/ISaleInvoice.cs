using System.Collections.Generic;
using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Business.Models.Voucher.Sale;
using SimERP.Data;

namespace SimERP.Business.Interfaces.Voucher.Sale
{
    public interface ISaleInvoice : IRepository<SaleInvoice>
    {
        List<SaleInvoice> GetData(ReqListSearch reqListSearch);

        bool Save(SaleInvoice rowData, bool isNew);

        bool DeleteSaleInvoice(long id);

        SaleInvoice GetInfo(ReqListSearch reqListSearch);
    }
}