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
    public class VendorTypeBO : Repository<VendorType>, IVendorType
    {
        public List<Models.MasterData.ListDTO.VendorType> GetData(string searchString, bool? IsActive, int startRow,
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

                    string sqlQuery = @" SELECT Count(1) FROM  [list].[VendorType] t with(nolock) " + sqlWhere +
                                      @";SELECT t.*, u.FullName as UserName FROM [list].[VendorType] t with(nolock) LEFT JOIN acc.[User] u with(nolock) on u.UserID = t.CreatedBy
                                          " + sqlWhere + " ORDER BY t.SortOrder OFFSET " + startRow +
                                      " ROWS FETCH NEXT " + maxRows + " ROWS ONLY";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<Models.MasterData.ListDTO.VendorType>().ToList();
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

        public bool Save(Data.DBEntities.VendorType rowData, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        if (CheckExistCode(rowData.VendorTypeCode))
                        {
                            this.AddMessage("000004", "Mã code đã tồn tại, vui lòng chọn mã khác!");
                            return false;
                        }

                        rowData.SortOrder = db.VendorType.Max(u => (int?) u.SortOrder) ?? 0 + 1;
                        db.VendorType.Add(rowData);
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
                        @" UPDATE [list].[VendorType] SET SortOrder = SortOrder - 1 WHERE VendorTypeID = @UpID;
                                         UPDATE [list].[VendorType] SET SortOrder = SortOrder + 1 WHERE VendorTypeID = @DownID;";

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

        public bool DeleteVendorType(int id)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    //TODO LIST: Kiểm tra sử dụng trước khi xóa
                    db.VendorType.Remove(db.VendorType.Find(id));
                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete VendorType unsucessfull");
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        #region Private methods

        private bool CheckExistCode(string vendorTypeCode)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    int count = 0;
                    count = db.VendorType.Where(m => m.VendorTypeCode == vendorTypeCode).Count();
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