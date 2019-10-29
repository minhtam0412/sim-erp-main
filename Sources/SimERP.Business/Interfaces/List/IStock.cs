using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Data;
using System.Collections.Generic;
using Stock = SimERP.Business.Models.MasterData.ListDTO.Stock;

namespace SimERP.Business.Interfaces.List
{
    public interface IStock : IRepository<Stock>
    {
        List<Stock> GetData(ReqListSearch reqListSearch);

        bool Save(Stock rowData, bool isNew);

        bool DeleteStock(int id);

        bool UpdateSortOrder(int upID, int downID);
    }
}