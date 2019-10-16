using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Data;
using SimERP.Data.DBEntities;
using Product = SimERP.Business.Models.MasterData.ListDTO.Product;

namespace SimERP.Business.Interfaces.List
{
    public interface IProduct : IRepository<Product>
    {
        List<Product> GetData(ReqListSearch reqListSearch);
        bool Save(Product product, bool isNew);
        bool Delete(int id);

        SimERP.Data.DBEntities.Product GetInfo(ReqListSearch reqListSearch);
    }
}