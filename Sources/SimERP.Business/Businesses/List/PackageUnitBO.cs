using Dapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using SimERP.Business.Interfaces.List;
using SimERP.Data;
using SimERP.Data.DBEntities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using SimERP.Business.Models.MasterData.ListDTO;

namespace SimERP.Business.Businesses.List
{
    public class PackageUnitBO : Repository<PackageUnit>, IPackageUnit
    {
        public List<PackageUnit> GetData(ReqListSearch reqListSearch)
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

                    string sqlQuery = @" SELECT Count(1) FROM  [item].[PackageUnit] t with(nolock) " + sqlWhere +
                                      @";SELECT t.* FROM [item].[PackageUnit] t with(nolock)
                                          " + sqlWhere + " ORDER BY t.SortOrder OFFSET " + reqListSearch.StartRow +
                                      " ROWS FETCH NEXT " + reqListSearch.MaxRow + " ROWS ONLY";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<PackageUnit>().ToList();
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

        public bool Save(PackageUnit packageUnit, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        if (CheckExistCode(packageUnit.PackageUnitId))
                        {
                            this.AddMessage("000004", "Mã quy cách đã tồn tại, vui lòng chọn mã khác!");
                            return false;
                        }

                        packageUnit.SortOrder = db.PackageUnit.Max(u => (int?)u.SortOrder) != null
                            ? db.CustomerType.Max(u => (int?)u.SortOrder) + 1
                            : 1;
                        db.PackageUnit.Add(packageUnit);
                    }
                    else
                    {
                        db.Entry(packageUnit).State = EntityState.Modified;
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

        public bool Delete(int id)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    //TODO LIST: Kiểm tra sử dụng trước khi xóa
                    db.PackageUnit.Remove(db.PackageUnit.Find(id));
                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete packageUnit unsucessful");
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

        private bool CheckExistCode(int Id)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    int count = 0;
                    count = db.PackageUnit.Count(m => m.PackageUnitId == Id);
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