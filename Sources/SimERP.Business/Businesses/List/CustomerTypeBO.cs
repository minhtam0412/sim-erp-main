using Dapper;
using Microsoft.EntityFrameworkCore;
using SimERP.Business.Interfaces.List;
using SimERP.Data;
using SimERP.Data.DBEntities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore.Internal;
using SimERP.Business.Models.MasterData.ListDTO;

namespace SimERP.Business
{
    public class CustomerTypeBO : Repository<CustomerType>, ICustomerType
    {
        public List<CustomerType> GetData(ReqListSearch reqListSearch)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();
                    List<string> listCondition = new List<string>();

                    if (!string.IsNullOrEmpty(reqListSearch.SearchString))
                    {
                        listCondition.Add("t.SearchString Like @SearchString");
                        param.Add("SearchString", "%" + reqListSearch.SearchString + "%");
                    }

                    if (reqListSearch.IsActive != null)
                    {
                        listCondition.Add("t.IsActive = @IsActive");
                        param.Add("IsActive", reqListSearch.IsActive);
                    }

                    if (listCondition.Count > 0)
                    {
                        sqlWhere = "WHERE " + listCondition.Join(" AND ");
                    }

                    string sqlQuery = @" SELECT Count(1) FROM  [list].[CustomerType] t with(nolock) " + sqlWhere +
                                      @";SELECT t.*, u.FullName as UserName FROM [list].[CustomerType] t with(nolock) LEFT JOIN acc.[User] u with(nolock) on u.UserID = t.CreatedBy
                                          " + sqlWhere + " ORDER BY t.SortOrder OFFSET " + reqListSearch.StartRow +
                                      " ROWS FETCH NEXT " + reqListSearch.MaxRow + " ROWS ONLY";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<CustomerType>().ToList();
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

        public bool Save(CustomerType customerType, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        if (CheckExistCode(customerType.CustomerTypeCode))
                        {
                            this.AddMessage("000004", "Mã code đã tồn tại, vui lòng chọn mã khác!");
                            return false;
                        }

                        customerType.SortOrder = db.CustomerType.Max(u => (int?) u.SortOrder) != null
                            ? db.CustomerType.Max(u => (int?) u.SortOrder) + 1
                            : 1;
                        db.CustomerType.Add(customerType);
                    }
                    else
                    {
                        db.Entry(customerType).State = EntityState.Modified;
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

        public bool DeleteCustomerType(int id)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    //TODO LIST: Kiểm tra sử dụng trước khi xóa
                    db.CustomerType.Remove(db.CustomerType.Find(id));
                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete customerType unsucessful");
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
                        @" UPDATE [list].[CustomerType] SET SortOrder = SortOrder - 1 WHERE CustomerTypeID = @UpID;
                                         UPDATE [list].[CustomerType] SET SortOrder = SortOrder + 1 WHERE CustomerTypeID = @DownID;";

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

        #region Private methods

        private bool CheckExistCode(string cusTypeCode)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    int count = 0;
                    count = db.CustomerType.Where(m => m.CustomerTypeCode == cusTypeCode).Count();
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

        #endregion
    }
}