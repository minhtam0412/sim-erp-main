using SimERP.Data;
using SimERP.Data.DBEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimERP.Business
{
    public interface ICustomer : IRepository<Customer>
    {
        List<Models.MasterData.ListDTO.Customer> GetData(string searchString, int? customerType, bool? IsActive, int startRow,
            int maxRows);
        bool Save(Customer rowData, bool isNew);
        bool Delete(long id);
        bool UpdateSortOrder(long upID, long downID);
        List<GroupCompany> GetListGroupCompany();
    }
}