using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Business.Models.System;
using SimERP.Data;
using SimERP.Data.DBEntities;

namespace SimERP.Business
{
    public class UserPermissionBO : Repository<User>, IUserPermission
    {
        #region Public method
        public List<User> getListUser()
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();

                    string sqlQuery = @"SELECT t.* FROM [acc].[User] t with(nolock) WHERE t.IsActive = 1 ORDER BY t.CreatedDate ";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        return multiResult.Read<User>().ToList();
                    }
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return null;
            }
        }

        public List<RoleList> getRoleUser(int? userId)
        {
            using (IDbConnection conn = IConnect.GetOpenConnection())
            {
                string sqlWhere = string.Empty;
                DynamicParameters param = new DynamicParameters();

                if (userId != null)
                {
                    sqlWhere += " WHERE t.UserId  = @UserId";
                    param.Add("UserId", userId);
                }

                string sqlQuery = @" SELECT t.RoleId, r.RoleName FROM [sec].[UserRole] t with(nolock) JOIN [sec].Role r ON r.RoleId = t.RoleId" + sqlWhere; 

                using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                {
                    return multiResult.Read<RoleList>().ToList();
                }
            }
        }

        public List<RoleList> getRoleList(int? userId)
        {
            using (IDbConnection conn = IConnect.GetOpenConnection())
            {
                string sqlWhere = string.Empty;
                DynamicParameters param = new DynamicParameters();

                sqlWhere += " WHERE t.UserId  = @UserId";
                param.Add("UserId", userId);
               
                string sqlQuery = "SELECT m.RoleId, m.RoleName FROM [sec].[Role] m with(nolock) WHERE m.RoleId NOT IN ( " +
                    "SELECT t.RoleId FROM[sec].[UserRole] t with(nolock) JOIN[sec].Role r ON r.RoleId = t.RoleId " + sqlWhere + " )";

                using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                {
                    return multiResult.Read<RoleList>().ToList();
                }
            }
        }

        public bool Save(List<RoleList> list, int userId)
        {
            try
            {
                

                if (DeleteUserRole(userId))
                {
                    if (list.Count <= 0)
                        return true;
                    foreach (RoleList item in list)
                    {
                        SaveUserRole(userId, item.RoleId);
                    }
                    return true;
                }
                else
                    return false;
            }
            catch
            {
                return false;
            }
        }

        public bool SaveUserRole(int userId, int roleId )
        {
            try
            {
                using (var db = new DBEntities())
                {
                    UserRole item = new UserRole();
                    item.UserId = userId;
                    item.RoleId = roleId;

                    db.UserRole.Add(item);

                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_002, "Lưu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool SaveListUserPermission(string listPermission, int userId)
        {
            try
            {
                string[] lstPermission = listPermission.Split(';');
                if (lstPermission.Length > 0)
                {
                    if (DeleteUserPermission(userId))
                    {
                        foreach (string permis in lstPermission)
                        {
                            if(permis != "" && permis != null)
                                SaveUserPermission(userId, Convert.ToInt32(permis));
                        }
                        return true;
                    }
                    else
                        return false;
                }
                return false;
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_002, "Lưu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool SaveUserPermission(int userId, int permissionId)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    UserPermission item = new UserPermission();
                    item.UserId = userId;
                    item.PermissionId = permissionId;

                    db.UserPermission.Add(item);

                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_002, "Lưu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool DeleteUserRole (int userId)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("UserId", userId);

                    string sqlQuery = @" DELETE [sec].[UserRole] WHERE UserId = @UserId";

                    conn.Query(sqlQuery, param);
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_002, "Xóa không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool DeleteUserPermission(int userId)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("UserId", userId);

                    string sqlQuery = @" DELETE [sec].[UserPermission] WHERE UserId = @UserId";

                    conn.Query(sqlQuery, param);
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_002, "Xóa không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public List<PageList> LoadPageListRole(int? moduleID, int? userId)
        {
            try
            {
                List<Models.MasterData.ListDTO.PageList> dataResult = new List<Models.MasterData.ListDTO.PageList>();

                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();
                    sqlWhere += " WHERE t.IsActive = 1 ";
                    if (moduleID != null)
                    {
                        sqlWhere += " AND t.ModuleID = @ModuleID ";
                        param.Add("ModuleID", moduleID);
                    }

                    string sqlQuery = @" SELECT Count(1) FROM  [sec].[Page] t with(nolock) " + sqlWhere +
                                      @";SELECT t.*, m.ModuleName FROM [sec].[Page] t with(nolock) 
                                        JOIN sec.[Module] m with(nolock) on m.ModuleID = t.ModuleID
                                          " + sqlWhere + " ORDER BY t.SortOrder";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        dataResult = multiResult.Read<Models.MasterData.ListDTO.PageList>().ToList();
                    }

                    foreach (Models.MasterData.ListDTO.PageList item in dataResult)
                    {
                        sqlQuery = @"SELECT t.* FROM [sec].[Function] t with(nolock) ORDER BY t.SortOrder";
                        var lsttem_fun = conn.QueryMultiple(sqlQuery);
                        List<Models.MasterData.ListDTO.Function> lstFunction = lsttem_fun.Read<Models.MasterData.ListDTO.Function>().ToList();

                        sqlQuery = @"SELECT t.* FROM [sec].[Permission] t with(nolock) WHERE t.PageID = " + item.PageId;
                        var lsttem_per = conn.QueryMultiple(sqlQuery);
                        List<Permission> lstPermission = lsttem_per.Read<Permission>().ToList();


                        sqlQuery = @" SELECT dbo.fn_GetListUserPermissionId(" +  userId  + ")";
                        var lsttem_userper = conn.QueryMultiple(sqlQuery);
                        List<string> str_array = lsttem_userper.Read<string>().ToList();
                        string[] lstUserPermission = null;
                        if (str_array.Count > 0 && str_array[0] != null)
                            lstUserPermission = str_array[0].Split(';');
                       
                        
                        foreach (Models.MasterData.ListDTO.Function node in lstFunction)
                        {
                            node.IsCheck = false;
                            node.PermissionID = Convert.ToInt32(null);
                            foreach (Permission ps in lstPermission)
                            {
                                if (node.FunctionId == ps.FunctionId)
                                {
                                    node.IsCheck = true;
                                    node.PermissionID = ps.PermissionId;
                                    if (lstUserPermission != null && lstUserPermission.Length > 0 && checkUserPermission(lstUserPermission, node.PermissionID))
                                        node.IsRole = true;
                                }
                            }

                        }

                        item.lstFunction = lstFunction;
                    }

                    return dataResult;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return null;
            }
        }

        #endregion

        #region Private methods
        public bool checkUserPermission(string[] lstUserPer, int permis)
        {
            foreach(string id in lstUserPer)
            {
                if (id != "" && id == permis.ToString())
                    return true;
            }
            return false;
        }
        #endregion

    }
}