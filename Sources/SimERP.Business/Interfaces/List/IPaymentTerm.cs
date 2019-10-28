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
    public interface IPaymentTerm : IRepository<PaymentTerm>
    {
        List<PaymentTerm> GetData(ReqListSearch reqListSearch);
        bool Save(PaymentTerm tax, bool isNew);
        bool Delete(int id);
        bool UpdateSortOrder(int upID, int downID);
    }
}