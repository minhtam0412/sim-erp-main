using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimERP.Data;
using SimERP.Data.DBEntities;

namespace SimERP.Business
{
    public interface IUnit : IRepository<Unit>
    {
        List<Models.MasterData.ListDTO.Unit> GetData(string searchString, int startRow, int maxRows);
        bool Save(Unit rowData, bool isNew);
        bool DeleteUnit(int id);
        bool UpdateSortOrder(int upID, int downID);
    }
}