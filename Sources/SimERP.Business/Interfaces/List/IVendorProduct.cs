using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Data;
using System.Collections.Generic;
using VendorProduct = SimERP.Business.Models.MasterData.ListDTO.VendorProduct;

namespace SimERP.Business.Interfaces.List
{
    public interface IVendorProduct : IRepository<VendorProduct>
    {
        List<VendorProduct> GetData(ReqListSearch reqListSearch);

        bool Save(VendorProduct rowData, bool isNew);
    }
}