using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimERP.Data;
using SimERP.Data.DBEntities;

namespace SimERP.Business
{
    public interface ITax : IRepository<Tax>
    {
        List<Models.MasterData.ListDTO.Tax> GetData(string searchString, int startRow, int maxRows);
        bool Save(Tax tax, bool isNew);
        bool DeleteTax(int id);
        bool UpdateSortOrder(int upID, int downID);
    }
}