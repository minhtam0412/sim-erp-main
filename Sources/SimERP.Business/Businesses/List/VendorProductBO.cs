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
using VendorProduct = SimERP.Business.Models.MasterData.ListDTO.VendorProduct;

namespace SimERP.Business.Businesses.List
{
    public class VendorProductBO : Repository<VendorProduct>, IVendorProduct
    {
        public List<VendorProduct> GetData(ReqListSearch reqListSearch)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();
                    List<string> listCondition = new List<string>();

                    if (reqListSearch.AddtionParams != null && reqListSearch.AddtionParams.Count > 0)
                    {
                        string VendorId = Convert.ToString(reqListSearch.AddtionParams["VendorId"]);
                        if (!string.IsNullOrEmpty(VendorId) && String.CompareOrdinal(VendorId, "-1") != 0)
                        {
                            listCondition.Add("vp.VendorId = @VendorId");
                            param.Add("VendorId", VendorId);
                        }

                        if (listCondition.Count > 0)
                        {
                            sqlWhere = "WHERE " + listCondition.Join(" AND ");
                        }
                    }

                    string sqlQuery = @"SELECT count(1) FROM list.VendorProduct vp with(nolock) " + sqlWhere +
                                      @";SELECT vp.*, p.ProductCode, p.ProductName, u.UnitName, c.CountryName, pc.ProductCategoryName
                                          FROM list.VendorProduct vp with(nolock)
                                          LEFT JOIN item.Product p ON vp.ProductId = p.ProductId
                                          LEFT JOIN item.Unit u ON p.UnitId = u.UnitId
                                          LEFT JOIN Country c ON p.MadeIn = c.CountryId
                                          LEFT JOIN item.ProductCategory pc ON p.ProductCategoryId = pc.ProductCategoryId 
                                          " + sqlWhere;

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<VendorProduct>().ToList();
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

        public bool Save(VendorProduct rowData, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        db.VendorProduct.Add(rowData);
                        db.SaveChanges();
                    }
                    else
                    {
                        db.Entry(rowData).State = EntityState.Modified;
                    }

                    db.SaveChanges(true);
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_002, "Lưu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }

            return false;
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
                        @" UPDATE [list].[Vendor] SET SortOrder = SortOrder - 1 WHERE VendorId = @UpID;
                                         UPDATE [list].[Vendor] SET SortOrder = SortOrder + 1 WHERE VendorId = @DownID;";

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
                    db.Vendor.Remove(db.Vendor.Find(id));
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

        private bool CheckExistCode(string VendorCode)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    int count = 0;
                    count = db.Vendor.Count(m => m.VendorCode == VendorCode);
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