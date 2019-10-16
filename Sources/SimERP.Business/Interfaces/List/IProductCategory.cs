using SimERP.Data;
using SimERP.Data.DBEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimERP.Business
{
    public interface IProductCategory : IRepository<ProductCategory>
    {
        List<Models.MasterData.ListDTO.ProductCategory> GetData(string searchString, bool? IsActive, int startRow,
            int maxRows);
        bool Save(ProductCategory rowData, bool isNew);
        bool Delete(Guid id);
        bool UpdateSortOrder(Guid upID, Guid downID);
        List<ProductCategory> GetAllData();
    }
}