using SimERP.Data;
using SimERP.Data.DBEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimERP.Business
{
    public interface IRoleList : IRepository<Role>
    {
        List<Models.MasterData.ListDTO.Role> GetData(string searchString, bool? IsActive, int startRow,
            int maxRows);
        bool Save(Role rowData, bool isNew, ref int roleId);
        bool Delete(int id);
        bool UpdateSortOrder(int upID, int downID);
        List<Models.MasterData.ListDTO.PageList> LoadPageListRole(int? moduleID);
        bool DeleteListRolePermission(int roleId);
        bool SaveListRoleFunction(int RoleId, int PermissionId);
    }
}