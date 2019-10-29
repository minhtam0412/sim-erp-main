using Dapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using SimERP.Business.Interfaces.List;
using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Data;
using SimERP.Data.DBEntities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Stock = SimERP.Business.Models.MasterData.ListDTO.Stock;

namespace SimERP.Business
{
    public class StockBO : Repository<Stock>, IStock
    {
        public List<Stock> GetData(ReqListSearch reqListSearch)
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
                        listCondition.Add("s.SearchString Like @SearchString");
                        param.Add("SearchString", "%" + reqListSearch.SearchString + "%");
                    }

                    if (reqListSearch.IsActive != null)
                    {
                        listCondition.Add("s.IsActive = @IsActive");
                        param.Add("IsActive", reqListSearch.IsActive);
                    }

                    if (listCondition.Count > 0)
                    {
                        sqlWhere = "WHERE " + listCondition.Join(" AND ");
                    }

                    string sqlQuery = @"SELECT count(1) FROM inv.Stock s with(nolock) " + sqlWhere +
                                      @";SELECT s.*, u.FullName AS UserName FROM inv.Stock s with(nolock) LEFT JOIN acc.[User] u ON s.CreatedBy = u.UserId
                                          " + sqlWhere + " ORDER BY s.SortOrder OFFSET " + reqListSearch.StartRow +
                                      " ROWS FETCH NEXT " + reqListSearch.MaxRow + " ROWS ONLY";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<Stock>().ToList();
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

        public bool Save(Stock rowData, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        if (CheckExistCode(rowData.StockCode))
                        {
                            this.AddMessage("000004", "Mã code đã tồn tại, vui lòng chọn mã khác!");
                            return false;
                        }

                        rowData.SortOrder = db.Stock.DefaultIfEmpty().Max(x=>x.SortOrder) + 1;
                        db.Stock.Add(rowData);
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

        public bool DeleteStock(int id)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    //TODO LIST: Kiểm tra sử dụng trước khi xóa
                    db.Stock.Remove(db.Stock.Find(id));
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
                        @" UPDATE [inv].[Stock] SET SortOrder = SortOrder - 1 WHERE StockId = @UpID;
                                         UPDATE [inv].[Stock] SET SortOrder = SortOrder + 1 WHERE StockId = @DownID;";

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

        private bool CheckExistCode(string data)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    int count = 0;
                    count = db.Stock.Count(m => m.StockCode == data);
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

        #endregion Private methods
    }
}