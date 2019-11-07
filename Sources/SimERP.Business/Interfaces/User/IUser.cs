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
    public interface IUser : IRepository<User>
    {
        UserResDTO Login(string userName, string passWord);
        UserResDTO GetInfo(string userName);
        UserResDTO GetInfo(int UserId);
        List<UserDTO> GetData(string searchString, bool? IsActive, int startRow, int maxRows);
        bool Save(User user, bool isNew);
        bool DeleteUser(int userID);
        bool ResetPassUser(int userID);
        bool ChangePassword(int userId, string currentPassword, string newPassword);
        bool ResetPassword(int userId, string newPassword);
        List<PermissionUser> GetListPermission(int userId);
    }
}