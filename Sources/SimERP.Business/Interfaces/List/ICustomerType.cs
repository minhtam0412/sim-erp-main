using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Data;
using SimERP.Data.DBEntities;

namespace SimERP.Business.Interfaces.List
{
    public interface ICustomerType : IRepository<CustomerType>
    {
        List<CustomerType> GetData(ReqListSearch reqListSearch);
        bool Save(CustomerType tax, bool isNew);
        bool DeleteCustomerType(int id);
        bool UpdateSortOrder(int upID, int downID);
    }
}