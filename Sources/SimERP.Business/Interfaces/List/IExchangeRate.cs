using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Data;
using System.Collections.Generic;

namespace SimERP.Business.Interfaces.List
{
    public interface IExchangeRate : IRepository<ExchangeRate>
    {
        List<ExchangeRate> GetData(ReqListSearch reqListSearch);

        bool Save(ExchangeRate rowData, bool isNew);
        bool DeleteExchangeRate(int id);
    }
}