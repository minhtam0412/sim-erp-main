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
    public class ProductCategoryBO : Repository<ProductCategory>, IProductCategory
    {
        #region Public methods
        public List<Models.MasterData.ListDTO.ProductCategory> GetData(string searchString, bool? IsActive, int startRow, int maxRows)
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

                    string sqlQuery = @" SELECT Count(1) FROM  [item].[ProductCategory] t with(nolock) " + sqlWhere +
                                      @";SELECT t.*, u.FullName as CreateName FROM [item].[ProductCategory] t with(nolock) LEFT JOIN acc.[User] u with(nolock) on u.UserID = t.CreatedBy
                                          " + sqlWhere + " ORDER BY t.SortOrder OFFSET " + startRow +
                                      " ROWS FETCH NEXT " + maxRows + " ROWS ONLY";


                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<Models.MasterData.ListDTO.ProductCategory>().ToList();
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
        public bool Save(ProductCategory rowData, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        if (CheckExistCode(rowData.ProductCategoryCode))
                        {
                            this.AddMessage("000004", "Mã code đã tồn tại, vui lòng chọn mã khác!");
                            return false;
                        }

                        rowData.SortOrder = db.ProductCategory.Max(u => (int?)u.SortOrder) + 1;
                        db.ProductCategory.Add(rowData);
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
        public bool Delete(Guid id)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    //TODO LIST: Kiểm tra sử dụng trước khi xóa
                    db.ProductCategory.Remove(db.ProductCategory.Find(id));
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
        public bool UpdateSortOrder(Guid upID, Guid downID)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("UpID", upID);
                    param.Add("DownID", downID);

                    string sqlQuery = @" UPDATE [item].[ProductCategory] SET SortOrder = SortOrder - 1 WHERE ProductCategoryId = @UpID;
                                         UPDATE [item].[ProductCategory] SET SortOrder = SortOrder + 1 WHERE ProductCategoryId = @DownID;";

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

        public List<ProductCategory> GetAllData()
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                   
                    DynamicParameters param = new DynamicParameters();

                    string sqlQuery = @"SELECT t.* FROM [item].[ProductCategory] t with(nolock) WHERE t.IsActive = 1 ORDER BY t.SortOrder";

                    var multiResult = conn.QueryMultiple(sqlQuery, param);
                    
                    return multiResult.Read<ProductCategory>().ToList();
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