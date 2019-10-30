using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Data;
using System.Collections.Generic;
using Currency = SimERP.Business.Models.MasterData.ListDTO.Currency;

namespace SimERP.Business.Interfaces.List
{
    public interface ICurrency : IRepository<Currency>
    {
        List<Currency> GetData(ReqListSearch reqListSearch);

        bool Save(Currency rowData, bool isNew);

        bool DeleteCurrency(string id);

        bool UpdateSortOrder(string upID, string downID);
    }
}