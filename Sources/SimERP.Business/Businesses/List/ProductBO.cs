using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using SimERP.Business.Interfaces.List;
using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Data;
using SimERP.Data.DBEntities;
using AttachFile = SimERP.Business.Models.MasterData.ListDTO.AttachFile;
using Product = SimERP.Business.Models.MasterData.ListDTO.Product;

namespace SimERP.Business.Businesses.List
{
    public class ProductBO : Repository<Product>, IProduct
    {
        public List<Product> GetData(ReqListSearch reqListSearch)
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
                        listCondition.Add("p.SearchString Like @SearchString");
                        param.Add("SearchString", "%" + reqListSearch.SearchString + "%");
                    }

                    if (reqListSearch.IsActive != null)
                    {
                        listCondition.Add("p.IsActive = @IsActive");
                        param.Add("IsActive", reqListSearch.IsActive);
                    }

                    if (reqListSearch.AddtionParams != null && reqListSearch.AddtionParams.Count > 0)
                    {
                        string productCategoryId = Convert.ToString(reqListSearch.AddtionParams["productCategory"]);
                        if (!string.IsNullOrEmpty(productCategoryId) && !productCategoryId.Equals("undefined") && !productCategoryId.Equals("null"))
                        {
                            listCondition.Add("';' + p.ProductCategoryList +';' LIKE @ProductCategoryList OR p.ProductCategoryId = @ProductCategoryId");
                            param.Add("ProductCategoryList", "%;" + productCategoryId + ";%");
                            param.Add("ProductCategoryId", productCategoryId);
                        }
                    }

                    if (listCondition.Count > 0)
                    {
                        sqlWhere = "WHERE " + listCondition.Join(" AND ");
                    }

                    string sqlQuery = @" SELECT Count(1) FROM [item].[Product] p with(nolock) " + sqlWhere +
                                      @";SELECT
                                                p.ProductId
                                                ,p.ProductCode
                                                ,p.ProductName
                                                ,p.Price
                                                ,u.UnitName
                                                ,pu.PackageUnitName
                                                ,pc.ProductCategoryId
                                                ,pc.ProductCategoryName
                                                ,c.CountryName
                                                ,v.VendorName
                                                ,p.IsActive
                                                FROM item.Product p
                                                LEFT JOIN item.Unit u
                                                ON p.UnitId = u.UnitId
                                                LEFT JOIN item.PackageUnit pu
                                                ON p.PackageUnitId = pu.PackageUnitId
                                                LEFT JOIN item.ProductCategory pc
                                                ON p.ProductCategoryId = pc.ProductCategoryId
                                                LEFT JOIN Country c
                                                ON c.CountryId = p.MadeIn
                                                LEFT JOIN list.Vendor v
                                                ON v.VendorId = p.SupplierId
                                          " + sqlWhere + " ORDER BY p.ProductId OFFSET " + reqListSearch.StartRow +
                                      " ROWS FETCH NEXT " + reqListSearch.MaxRow + " ROWS ONLY";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<Product>().ToList();
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

        public bool Save(Product product, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            if (isNew)
                            {
                                if (CheckExistCode(product.ProductCode))
                                {
                                    this.AddMessage("000004", "Mã sản phẩm đã tồn tại, vui lòng chọn mã khác!");
                                    return false;
                                }

                                db.Product.Add(product);
                                db.SaveChanges();
                                if (product.ProductId > 0)
                                {
                                    foreach (var attachFile in product.ListAttachFile)
                                    {
                                        attachFile.KeyValue = Convert.ToString(product.ProductId);
                                        attachFile.CreatedBy = product.CreatedBy;
                                        attachFile.CreatedDate = DateTime.Now;
                                        if (attachFile.IsNew)
                                        {
                                            db.AttachFile.Add(attachFile);
                                        }
                                        else
                                        {
                                            db.Entry(attachFile).State = EntityState.Modified;
                                        }
                                    }
                                }
                            }
                            else
                            {
                                db.Entry(product).State = EntityState.Modified;
                                foreach (var attachFile in product.ListAttachFile)
                                {
                                    attachFile.KeyValue = Convert.ToString(product.ProductId);
                                    attachFile.CreatedBy = product.CreatedBy;
                                    attachFile.CreatedDate = DateTime.Now;
                                    if (attachFile.IsNew)
                                    {
                                        db.AttachFile.Add(attachFile);
                                    }
                                    else
                                    {
                                        db.Entry(attachFile).State = EntityState.Modified;
                                    }
                                }

                                if (product.ListAttachFileDelete != null && product.ListAttachFileDelete.Count > 0)
                                {
                                    foreach (var attachFile in product.ListAttachFileDelete)
                                    {
                                        db.AttachFile.Remove(db.AttachFile.Find(attachFile.AttachId));
                                    }
                                }
                            }

                            db.SaveChanges(true);
                            transaction.Commit();
                            return true;
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
                this.AddMessage(MessageCode.MSGCODE_002, "Lưu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }

            return false;
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
                            var lstAttachFile = db.AttachFile.Where(x => x.KeyValue == Convert.ToString(id));
                            foreach (var attachFile in lstAttachFile)
                            {
                                db.AttachFile.Remove(attachFile);
                            }

                            db.Product.Remove(db.Product.Find(id));

                            db.SaveChanges();

                            transaction.Commit();
                            return true;
                        }
                        catch (Exception e)
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete product unsucessful");
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public SimERP.Data.DBEntities.Product GetInfo(ReqListSearch reqListSearch)
        {
            SimERP.Data.DBEntities.Product product = null;
            try
            {
                int productId = reqListSearch.AddtionParams.ContainsKey("ProductId") ? Convert.ToInt32(reqListSearch.AddtionParams["ProductId"]) : -1;
                using (var db = new DBEntities())
                {
                    product = db.Product.SingleOrDefault(x => x.ProductId == productId);
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return null;
            }

            return product;
        }

        #region Private methods

        private bool CheckExistCode(string productCode)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    int count = 0;
                    count = db.Product.Count(m => m.ProductCode.Equals(productCode));
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