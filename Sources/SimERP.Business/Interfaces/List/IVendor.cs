using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Data;
using SimERP.Data.DBEntities;
using System.Collections.Generic;
using Vendor = SimERP.Business.Models.MasterData.ListDTO.Vendor;

namespace SimERP.Business.Interfaces.List
{
    public interface IVendor : IRepository<Vendor>
    {
        List<Vendor> GetData(ReqListSearch reqListSearch);

        bool Save(Vendor rowData, bool isNew);

        bool DeleteVendor(int id);

        bool UpdateSortOrder(int upID, int downID);

        SimERP.Data.DBEntities.Vendor GetInfo(ReqListSearch reqListSearch);
    }
}