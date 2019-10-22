using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Business.Models.System;
using SimERP.Data;
using SimERP.Data.DBEntities;

namespace SimERP.Business
{
    public interface IUserPermission : IRepository<User>
    {
        List<User> getListUser();
        List<RoleList> getRoleUser(int? userId);
        List<RoleList> getRoleList(int? userId);
        bool Save(List<RoleList> list, int userId);
        bool SaveListUserPermission(string listPermission, int userId);
        List<Models.MasterData.ListDTO.PageList> LoadPageListRole(int? moduleID, int? userId);
    }
}