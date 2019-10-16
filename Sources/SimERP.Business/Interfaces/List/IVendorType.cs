using SimERP.Data;
using SimERP.Data.DBEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimERP.Business
{
    public interface IVendorType : IRepository<VendorType>
    {
        List<Models.MasterData.ListDTO.VendorType> GetData(string searchString, bool? IsActive, int startRow,
            int maxRows);

        bool Save(VendorType rowData, bool isNew);
        bool DeleteVendorType(int id);
        bool UpdateSortOrder(int upID, int downID);
    }
}