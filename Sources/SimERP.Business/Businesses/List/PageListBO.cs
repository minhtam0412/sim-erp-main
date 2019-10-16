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
    public class PageListBO : Repository<Page>, IPageList
    {
        public List<Models.MasterData.ListDTO.PageList> GetData(string searchString, int? moduleID, bool? IsActive, int startRow,
            int maxRows)
        {
            try
            {
                List<Models.MasterData.ListDTO.PageList> dataResult = new List<Models.MasterData.ListDTO.PageList>();

                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();

                    if (!string.IsNullOrEmpty(searchString) || IsActive != null || moduleID != null)
                        sqlWhere += " WHERE ";

                    if (IsActive != null)
                    {
                        sqlWhere += " t.IsActive = @IsActive ";
                        param.Add("IsActive", IsActive);
                    }

                    if (moduleID != null)
                    {
                        if (IsActive != null)
                            sqlWhere += " AND ";
                        sqlWhere += " t.ModuleID = @ModuleID ";
                        param.Add("ModuleID", moduleID);
                    }

                    if (!string.IsNullOrEmpty(searchString))
                    {
                        if (IsActive != null || moduleID != null)
                            sqlWhere += " AND ";
                        sqlWhere += " t.SearchString Like @SearchString ";
                        param.Add("SearchString", "%" + searchString + "%");
                    }

                    string sqlQuery = @" SELECT Count(1) FROM  [sec].[Page] t with(nolock) " + sqlWhere +
                                      @";SELECT t.*, m.ModuleName FROM [sec].[Page] t with(nolock) 
                                        JOIN sec.[Module] m with(nolock) on m.ModuleID = t.ModuleID
                                          " + sqlWhere + " ORDER BY t.SortOrder OFFSET " + startRow +
                                      " ROWS FETCH NEXT " + maxRows + " ROWS ONLY";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        dataResult = multiResult.Read<Models.MasterData.ListDTO.PageList>().ToList();
                    }

                    foreach(Models.MasterData.ListDTO.PageList item in dataResult)
                    {
                        sqlQuery = @"SELECT t.* FROM [sec].[Function] t with(nolock) ORDER BY t.SortOrder";
                        var lsttem_fun = conn.QueryMultiple(sqlQuery);
                        List<Models.MasterData.ListDTO.Function> lstFunction = lsttem_fun.Read<Models.MasterData.ListDTO.Function>().ToList();

                        sqlQuery = @"SELECT t.* FROM [sec].[Permission] t with(nolock) WHERE t.PageID = " + item.PageId;
                        var lsttem_per = conn.QueryMultiple(sqlQuery);

                        List<Permission> lstPermission = lsttem_per.Read<Permission>().ToList();

                        foreach(Models.MasterData.ListDTO.Function node in lstFunction)
                        {
                            if (CheckIssue(node.FunctionId, lstPermission))
                                node.IsCheck = true;
                            else node.IsCheck = false;
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

        public bool Save(Data.DBEntities.Page rowData, bool isNew, ref int pageID)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        if (CheckExistCode(rowData.PageName))
                        {
                            this.AddMessage("000004", "Tên page đã tồn tại, vui lòng chọn mã khác!");
                            return false;
                        }

                        rowData.SortOrder = db.Page.Max(u => u.SortOrder) + 1;
                            

                        db.Page.Add(rowData);
                    }
                    else
                    {
                        db.Entry(rowData).State = EntityState.Modified;
                    }

                    db.SaveChanges();
                    pageID = rowData.PageId;
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

        public bool SaveListPageFunction(int pageID, string functionID)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    Permission item = new Permission();
                    item.PageId = pageID;
                    item.FunctionId = functionID;

                    db.Permission.Add(item);

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
                        @" UPDATE [sec].[Page] SET SortOrder = SortOrder - 1 WHERE PageID = @UpID;
                                         UPDATE [sec].[Page] SET SortOrder = SortOrder + 1 WHERE PageID = @DownID;";

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

        public bool DeletePageList(int id)
        {
            try
            {
                if (this.DeleteListPagePermission(id))
                {
                    using (var db = new DBEntities())
                    {
                        //TODO LIST: Kiểm tra sử dụng trước khi xóa
                        db.Page.Remove(db.Page.Find(id));
                        db.SaveChanges();
                        return true;
                    }
                }
                else return false;
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete Page unsucessfull");
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public List<Module> GetListModule()
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();

                    string sqlQuery = @"SELECT t.* FROM [sec].[Module] t with(nolock) WHERE t.IsActive = 1 ORDER BY t.SortOrder ";

                    var listResult = conn.QueryMultiple(sqlQuery, param);

                    return listResult.Read<Module>().ToList();
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return null;
            }
        }

        public List<Models.MasterData.ListDTO.Function> GetListFunction()
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();

                    string sqlQuery = @"SELECT t.* FROM [sec].[Function] t with(nolock) WHERE t.IsActive = 1 ORDER BY t.SortOrder ";

                    var listResult = conn.QueryMultiple(sqlQuery, param);

                    return listResult.Read<Models.MasterData.ListDTO.Function>().ToList();
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return null;
            }
        }

        public bool DeleteListPagePermission(int pageID)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("PageID", pageID);

                    string sqlQuery = @" DELETE [sec].[Permission] WHERE PageID = @PageID";

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

        #region Private methods

        private bool CheckExistCode(string pagename)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    int count = 0;
                    count = db.Page.Where(m => m.PageName == pagename).Count();
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
            foreach(Permission item in lst)
            {
                if (item.FunctionId == functionID)
                    return true;
            }
            return false;
        }
        #endregion
    }
}