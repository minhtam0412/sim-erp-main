using SimERP.Data;
using SimERP.Data.DBEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimERP.Business
{
    public interface IPageList : IRepository<Page>
    {
        List<Models.MasterData.ListDTO.PageList> GetData(string searchString, int? moduleID, bool? IsActive, int startRow,
            int maxRows);
        bool Save(Page rowData, bool isNew, ref int pageID);
        bool SaveListPageFunction(int pageID, string functionID);
        bool DeletePageList(int id, ref string MessageText);
        bool DeleteListPagePermission(int pageID, ref string MessageText);
        bool UpdateSortOrder(int upID, int downID);
        List<Module> GetListModule();
        List<Models.MasterData.ListDTO.Function> GetListFunction();
        bool checkIssuePermission(int pageId, string functionID);
    }
}