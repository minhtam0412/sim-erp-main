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
using Vendor = SimERP.Business.Models.MasterData.ListDTO.Vendor;

namespace SimERP.Business.Businesses.List
{
    public class VendorBO : Repository<Vendor>, IVendor
    {
        public List<Vendor> GetData(ReqListSearch reqListSearch)
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
                        listCondition.Add("v.SearchString Like @SearchString");
                        param.Add("SearchString", "%" + reqListSearch.SearchString + "%");
                    }

                    if (reqListSearch.IsActive != null)
                    {
                        listCondition.Add("v.IsActive = @IsActive");
                        param.Add("IsActive", reqListSearch.IsActive);
                    }

                    if (reqListSearch.AddtionParams != null && reqListSearch.AddtionParams.Count > 0)
                    {
                        string vendorTypeId = Convert.ToString(reqListSearch.AddtionParams["vendorTypeId"]);
                        if (!string.IsNullOrEmpty(vendorTypeId) && String.CompareOrdinal(vendorTypeId, "-1") != 0)
                        {
                            listCondition.Add("v.VendorTypeId = @VendorTypeId");
                            param.Add("VendorTypeId", reqListSearch.IsActive);
                        }
                    }

                    if (listCondition.Count > 0)
                    {
                        sqlWhere = "WHERE " + listCondition.Join(" AND ");
                    }

                    string sqlQuery = @" SELECT count(1)  
                                            FROM list.Vendor v with(nolock) " + sqlWhere +
                                        @";SELECT
                                              v.VendorId
                                             ,v.VendorCode
                                             ,v.VendorName
                                             ,v.Address
                                             ,v.PhoneNumber
                                             ,v.Email
                                             ,v.RepresentativeName
                                             ,v.IsActive
                                            FROM list.Vendor v with(nolock)
                                          " + sqlWhere + " ORDER BY v.SortOrder OFFSET " + reqListSearch.StartRow +
                                      " ROWS FETCH NEXT " + reqListSearch.MaxRow + " ROWS ONLY";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<Vendor>().ToList();
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

        public bool Save(Vendor rowData, bool isNew)
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
                                if (CheckExistCode(rowData.VendorCode))
                                {
                                    this.AddMessage("000004", "Mã code đã tồn tại, vui lòng chọn mã khác!");
                                    return false;
                                }
                                rowData.SortOrder = db.Vendor.Max(u => (int?)u.SortOrder) != null
                                    ? db.Tax.Max(u => (int?)u.SortOrder) + 1
                                    : 1;
                                db.Vendor.Add(rowData);
                                db.SaveChanges();

                                if (rowData.VendorId > 0)
                                {
                                    foreach (var attachFile in rowData.ListAttachFile)
                                    {
                                        attachFile.KeyValue = Convert.ToString(rowData.VendorId);
                                        attachFile.CreatedBy = rowData.CreatedBy;
                                        attachFile.CreatedDate = DateTime.Now;
                                        db.AttachFile.Add(attachFile);
                                    }

                                    foreach (var vendorProduct in rowData.ListVendorProduct)
                                    {
                                        vendorProduct.VendorId = rowData.VendorId;
                                        db.VendorProduct.Add(vendorProduct);
                                    }
                                }
                            }
                            else
                            {
                                db.Entry(rowData).State = EntityState.Modified;

                                foreach (var attachFile in rowData.ListAttachFile)
                                {
                                    attachFile.KeyValue = Convert.ToString(rowData.VendorId);
                                    attachFile.CreatedBy = rowData.CreatedBy;
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

                                if (rowData.ListAttachFileDelete != null && rowData.ListAttachFileDelete.Count > 0)
                                {
                                    foreach (var attachFile in rowData.ListAttachFileDelete)
                                    {
                                        db.AttachFile.Remove(db.AttachFile.Find(attachFile.AttachId));
                                    }
                                }

                                foreach (var vendorProduct in rowData.ListVendorProduct)
                                {
                                    if (vendorProduct.RowId <= 0)
                                    {
                                        vendorProduct.VendorId = rowData.VendorId;
                                        db.VendorProduct.Add(vendorProduct);
                                    }
                                }

                                if (rowData.ListVendorProductDelete != null && rowData.ListVendorProductDelete.Count > 0)
                                {
                                    foreach (var vendorProduct in rowData.ListVendorProductDelete)
                                    {
                                        db.VendorProduct.Remove(db.VendorProduct.Find(vendorProduct.RowId));
                                    }
                                }
                            }

                            db.SaveChanges(true);
                            transaction.Commit();
                            return true;

                        }
                        catch (Exception ex)
                        {
                            this.AddMessage(MessageCode.MSGCODE_002, "Lưu không thành công: " + ex.Message);
                            Logger.Error(GetType(), ex);
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

        public bool DeleteVendor(int id)
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
                this.AddMessage(MessageCode.MSGCODE_003, "Delete Vendor unsucessful");
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public SimERP.Data.DBEntities.Vendor GetInfo(ReqListSearch reqListSearch)
        {
            SimERP.Data.DBEntities.Vendor vendor = null;
            try
            {
                int vendorId = reqListSearch.AddtionParams.ContainsKey("VendorId") ? Convert.ToInt32(reqListSearch.AddtionParams["VendorId"]) : -1;
                using (var db = new DBEntities())
                {
                    vendor = db.Vendor.SingleOrDefault(x => x.VendorId == vendorId);
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return null;
            }

            return vendor;
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