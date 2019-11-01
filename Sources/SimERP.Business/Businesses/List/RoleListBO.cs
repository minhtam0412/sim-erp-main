using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Dapper;
using SimERP.Data;
using SimERP.Data.DBEntities;

namespace SimERP.Business
{
    public class RoleListBO : Repository<Role>, IRoleList
    {
        public List<Models.MasterData.ListDTO.Role> GetData(string searchString, bool? IsActive, int startRow,
            int maxRows)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();

                    if (!string.IsNullOrEmpty(searchString))
                    {
                        sqlWhere += " WHERE t.SearchString Like @SearchString ";
                        param.Add("SearchString", "%" + searchString + "%");

                        if (IsActive != null)
                        {
                            sqlWhere += " AND t.IsActive = @IsActive ";
                            param.Add("IsActive", IsActive);
                        }
                    }
                    else
                    {
                        if (IsActive != null)
                        {
                            sqlWhere += " WHERE t.IsActive = @IsActive ";
                            param.Add("IsActive", IsActive);
                        }
                    }

                    string sqlQuery = @" SELECT Count(1) FROM  [sec].[Role] t with(nolock) " + sqlWhere +
                                      @";SELECT t.*, u.FullName as CreatedName, dbo.fn_GetListPermissionId(t.RoleId) as LstPermission FROM [sec].[Role] t with(nolock) LEFT JOIN acc.[User] u with(nolock) on u.UserID = t.CreatedBy
                                          " + sqlWhere + " ORDER BY t.SortOrder OFFSET " + startRow +
                                      " ROWS FETCH NEXT " + maxRows + " ROWS ONLY";


                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<Models.MasterData.ListDTO.Role>().ToList();
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

        public bool Save(Data.DBEntities.Role rowData, bool isNew, ref int roleId)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        if (CheckExistCode(rowData.RoleCode))
                        {
                            this.AddMessage("000004", "Mã Role đã tồn tại, vui lòng chọn mã khác!");
                            return false;
                        }
                        var max = db.Role.Max(u => (int?)u.SortOrder);
                        rowData.SortOrder = db.Role.Max(u => (int?)u.SortOrder) != null
                            ? db.Role.Max(u => (int?)u.SortOrder) + 1
                            : 1;

                        db.Role.Add(rowData);
                    }
                    else
                    {
                        db.Entry(rowData).State = EntityState.Modified;
                    }

                    db.SaveChanges();
                    roleId = rowData.RoleId;
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

        public bool UpdateSortOrder(int upID, int downID)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("UpID", upID);
                    param.Add("DownID", downID);

                    string sqlQuery =
                        @" UPDATE [sec].[Role] SET SortOrder = SortOrder - 1 WHERE RoleId = @UpID;
                                         UPDATE [sec].[Role] SET SortOrder = SortOrder + 1 WHERE RoleId = @DownID;";

                    conn.Query(sqlQuery, param);
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

        public bool Delete(int id)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            //TODO LIST: Kiểm tra sử dụng trước khi xóa
                            if (this.DeleteListRolePermission(id))
                            {
                                db.Role.Remove(db.Role.Find(id));
                                db.SaveChanges();
                                transaction.Commit();
                                return true;
                            }
                        }
                        catch (Exception e)
                        {
                            transaction.Rollback();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete Page unsucessfull");
                Logger.Error(GetType(), ex);
                return false;
            }
            return false;
        }
        public List<Models.MasterData.ListDTO.PageList> LoadPageListRole(int? moduleID)
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
        public bool DeleteListRolePermission(int roleId)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("RoleId", roleId);

                    string sqlQuery = @" DELETE [sec].[RolePermission] WHERE RoleId = @RoleId";

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
        public bool SaveListRoleFunction(int RoleId, int PermissionId)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    RolePermission item = new RolePermission();
                    item.RoleId = RoleId;
                    item.PermissionId = PermissionId;

                    db.RolePermission.Add(item);

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


        #region Private methods

        private bool CheckExistCode(string rolecode)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    int count = 0;
                    count = db.Role.Where(m => m.RoleCode == rolecode).Count();
                    if (count > 0)
                        return true;
                    return false;
                }
            }
            catch (Exception ex)

            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return true;
            }
        }

        private bool CheckIssue(string functionID, List<Permission> lst)
        {
            foreach (Permission item in lst)
            {
                if (item.FunctionId == functionID)
                    return true;
            }
            return false;
        }
        #endregion
    }
}