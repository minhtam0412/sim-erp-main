using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore;
using SimERP.Data;
using SimERP.Data.DBEntities;

namespace SimERP.Business
{
    public class UnitBO : Repository<Unit>, IUnit
    {
        #region Public methods
        public List<Models.MasterData.ListDTO.Unit> GetData(string searchString, int startRow, int maxRows)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();

                    if (!string.IsNullOrEmpty(searchString))
                    {
                        sqlWhere += " WHERE t.SearchString Like @SearchString";
                        param.Add("SearchString", "%" + searchString + "%");
                    }

                    string sqlQuery = @" SELECT Count(1) FROM  [item].[Unit] t with(nolock) " + sqlWhere +
                                      @";SELECT t.*, u.FullName as UserName FROM [item].[Unit] t with(nolock) LEFT JOIN acc.[User] u with(nolock) on u.UserID = t.CreatedBy
                                          " + sqlWhere + " ORDER BY t.SortOrder OFFSET " + startRow +
                                      " ROWS FETCH NEXT " + maxRows + " ROWS ONLY";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<Models.MasterData.ListDTO.Unit>().ToList();
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
        public bool Save(Unit rowData, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        if (CheckExistCode(rowData.UnitCode))
                        {
                            this.AddMessage("000004", "Mã code đã tồn tại, vui lòng chọn mã khác!");
                            return false;
                        }

                        rowData.SortOrder = db.Unit.Max(u => (int?) u.SortOrder) ?? 0 + 1;
                        db.Unit.Add(rowData);
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
        public bool DeleteUnit(int id)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    //TODO LIST: Kiểm tra sử dụng trước khi xóa
                    db.Unit.Remove(db.Unit.Find(id));
                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete Unit unsucessfull");
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

                    string sqlQuery = @" UPDATE [item].[Unit] SET SortOrder = SortOrder - 1 WHERE UnitID = @UpID;
                                         UPDATE [item].[Unit] SET SortOrder = SortOrder + 1 WHERE UnitID = @DownID;";

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
        #endregion

        #region Private methods

        private bool CheckExistCode(string unitCode)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    int count = 0;
                    count = db.Unit.Where(m => m.UnitCode == unitCode).Count();
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