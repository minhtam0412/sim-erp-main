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
    public class CustomerBO : Repository<Customer>, ICustomer
    {
        public List<Models.MasterData.ListDTO.Customer> GetData(string searchString, int? customerTypeId, bool? IsActive, int startRow,
            int maxRows)
        {
            try
            {
                List<Models.MasterData.ListDTO.Customer> dataResult = new List<Models.MasterData.ListDTO.Customer>();

                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();

                    if (!string.IsNullOrEmpty(searchString) || IsActive != null || customerTypeId != null)
                        sqlWhere += " WHERE ";

                    if (IsActive != null)
                    {
                        sqlWhere += " t.IsActive = @IsActive ";
                        param.Add("IsActive", IsActive);
                    }

                    if (customerTypeId != null)
                    {
                        if (IsActive != null)
                            sqlWhere += " AND ";
                        sqlWhere += " t.CustomerTypeId = @customerTypeId ";
                        param.Add("customerTypeId", customerTypeId);
                    }

                    if (!string.IsNullOrEmpty(searchString))
                    {
                        if (IsActive != null || customerTypeId != null)
                            sqlWhere += " AND ";
                        sqlWhere += " t.SearchString Like @SearchString ";
                        param.Add("SearchString", "%" + searchString + "%");
                    }

                    string sqlQuery = @" SELECT Count(1) FROM  [list].[Customer] t with(nolock) " + sqlWhere +
                                      @";SELECT t.* FROM [list].[Customer] t with(nolock) 
                                        JOIN [list].[CustomerType] m with(nolock) on m.CustomerTypeId = t.CustomerTypeId
                                          " + sqlWhere + " ORDER BY t.SortOrder OFFSET " + startRow +
                                      " ROWS FETCH NEXT " + maxRows + " ROWS ONLY";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        dataResult = multiResult.Read<Models.MasterData.ListDTO.Customer>().ToList();
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

        public bool Save(Data.DBEntities.Customer rowData, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        if (CheckExistCode(rowData.CustomerCode))
                        {
                            this.AddMessage("000004", "Tên page đã tồn tại, vui lòng chọn mã khác!");
                            return false;
                        }

                        rowData.SortOrder = db.Customer.Max(u => u.SortOrder) + 1;


                        db.Customer.Add(rowData);
                    }
                    else
                    {
                        db.Entry(rowData).State = EntityState.Modified;
                    }

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

        public bool UpdateSortOrder(long upID, long downID)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("UpID", upID);
                    param.Add("DownID", downID);

                    string sqlQuery =
                        @" UPDATE [list].[Customer] SET SortOrder = SortOrder - 1 WHERE CustomerId = @UpID;
                                         UPDATE [list].[Customer] SET SortOrder = SortOrder + 1 WHERE CustomerId = @DownID;";

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

        public bool Delete(long id)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    //TODO LIST: Kiểm tra sử dụng trước khi xóa
                    db.Customer.Remove(db.Customer.Find(id));
                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete Page unsucessfull");
                Logger.Error(GetType(), ex);
                return false;
            }
        }
        public List<GroupCompany> GetListGroupCompany()
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();

                    string sqlQuery = @"SELECT t.* FROM [list].[GroupCompany] t with(nolock) WHERE t.IsActive = 1 ORDER BY t.CreatedDate ";

                    var listResult = conn.QueryMultiple(sqlQuery, param);

                    return listResult.Read<GroupCompany>().ToList();
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return null;
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