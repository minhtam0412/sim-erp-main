using Dapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using SimERP.Business.Interfaces.Voucher.Sale;
using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Data;
using SimERP.Data.DBEntities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using SaleInvoice = SimERP.Business.Models.Voucher.Sale.SaleInvoice;

namespace SimERP.Business
{
    public class SaleInvoiceBO : Repository<SaleInvoice>, ISaleInvoice
    {
        public object GetSaleOrderInital()
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();

                    string sqlQuery = @" SELECT * FROM pay.PaymentTerm p Where p.IsActive=1 ORDER BY p.SortOrder;
                                         SELECT * FROM inv.Stock i Where i.IsActive=1 ORDER BY i.SortOrder;
                                         SELECT c.CurrencyId, c.CurrencyName, c.IsMainCurrency, IIF((r.ExchangeRating is null), 1, r.ExchangeRating) as ExchangeRating
                                         FROM list.Currency c with(nolock) left join
	                                        (SELECT max(e.ExchangeRateId) AS ExchangeRateId, e.CurrencyId
	                                         FROM list.ExchangeRate e GROUP BY e.CurrencyId) m on m.CurrencyId=c.CurrencyId
	                                         left join list.ExchangeRate r on r.ExchangeRateId=m.ExchangeRateId
                                         WHERE c.IsActive = 1
                                         ORDER BY c.IsMainCurrency desc, c.CurrencyId;";

                    object dataResult = new object();
                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();

                        object model = new { };
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

        public List<SaleInvoice> GetData(ReqListSearch reqListSearch)
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
                        listCondition.Add("si.SearchString Like @SearchString");
                        param.Add("SearchString", "%" + reqListSearch.SearchString + "%");
                    }

                    if (reqListSearch.AddtionParams != null && reqListSearch.AddtionParams.Count > 0)
                    {
                        if (reqListSearch.AddtionParams["FromDate"] != null)
                        {
                            var fromDate = DateTimeOffset.Parse(reqListSearch.AddtionParams["FromDate"].ToString());
                            if (fromDate != null)
                            {
                                listCondition.Add("cast(si.CreatedDate as Date) >= cast(@FromDate as Date)");
                                param.Add("FromDate", fromDate);
                            }
                        }

                        if (reqListSearch.AddtionParams["ToDate"] != null)
                        {
                            var toDate = DateTimeOffset.Parse(reqListSearch.AddtionParams["ToDate"].ToString());
                            if (toDate != null)
                            {
                                listCondition.Add("cast(si.CreatedDate as Date) <= cast(@ToDate as Date)");
                                param.Add("ToDate", toDate);
                            }
                        }

                        //trạng thái
                        if (reqListSearch.AddtionParams["VoucherStatus"] != null)
                        {
                            var voucherStatus = Convert.ToInt32(reqListSearch.AddtionParams["VoucherStatus"].ToString());
                            if (voucherStatus > -1)
                            {
                                listCondition.Add("VoucherStatus = @voucherStatus");
                                param.Add("VoucherStatus", voucherStatus);
                            }
                        }
                    }

                    if (listCondition.Count > 0)
                    {
                        sqlWhere = "WHERE " + listCondition.Join(" AND ");
                    }

                    string sqlQuery = @"SELECT
                                            count(1)
                                            FROM sale.SaleInvoice si
                                            LEFT JOIN acc.[User] u
                                              ON si.SaleRefId = u.UserId " + sqlWhere +
                                      @";SELECT
                                              si.SaleInvoiceId
                                             ,si.SaleInvoiceCode
                                             ,si.PostedDate
                                             ,si.VoucherDate
                                             ,si.CustomerName
                                             ,si.DeliveryNotes
                                             ,u.FullName SaleRefFullName
                                             ,si.TotalAmount
                                             ,si.VoucherStatus
                                             ,si.CreatedDate
                                            FROM sale.SaleInvoice si
                                            LEFT JOIN acc.[User] u
                                              ON si.SaleRefId = u.UserId
                                          " + sqlWhere + " ORDER BY si.CreatedDate OFFSET " + reqListSearch.StartRow +
                                      " ROWS FETCH NEXT " + reqListSearch.MaxRow + " ROWS ONLY";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<SaleInvoice>().ToList();
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

        public bool Save(SaleInvoice rowData, bool isNew)
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
                                if (CheckExistCode(rowData.SaleInvoiceCode))
                                {
                                    this.AddMessage("000004", "Mã code đã tồn tại, vui lòng chọn mã khác!");
                                    return false;
                                }

                                //gán dữ liệu mặc định cho Sale Order
                                rowData.IsSaleInvoice = false;
                                rowData.RefType = Utils.VoucherType.Sale.SaleOrder;

                                db.SaleInvoice.Add(rowData);
                                db.SaveChanges();

                                if (rowData.SaleInvoiceId > 0)
                                {
                                    foreach (var invoiceDetail in rowData.ListSaleOrderDetail)
                                    {
                                        invoiceDetail.SaleInvoiceId = rowData.SaleInvoiceId;
                                        db.SaleInvoiceDetail.Add(invoiceDetail);
                                    }
                                }
                            }
                            else
                            {
                                rowData.ModifyDate = DateTimeOffset.Now;
                                db.Entry(rowData).State = EntityState.Modified;

                                foreach (var invoiceDetail in rowData.ListSaleOrderDetail)
                                {
                                    invoiceDetail.SaleInvoiceId = rowData.SaleInvoiceId;
                                    if (invoiceDetail.SaleInvoiceDetailId <= 0)
                                    {
                                        db.SaleInvoiceDetail.Add(invoiceDetail);
                                    }
                                    else
                                    {
                                        db.Entry(invoiceDetail).State = EntityState.Modified;
                                    }
                                }

                                if (rowData.ListSaleOrderDetailDelete != null && rowData.ListSaleOrderDetailDelete.Count > 0)
                                {
                                    foreach (var invoiceDetail in rowData.ListSaleOrderDetailDelete)
                                    {
                                        db.SaleInvoiceDetail.Remove(db.SaleInvoiceDetail.Find(invoiceDetail.SaleInvoiceDetailId));
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

        public bool DeleteSaleInvoice(long id)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    //TODO LIST: Kiểm tra sử dụng trước khi xóa
                    db.SaleInvoice.Remove(db.SaleInvoice.Find(id));
                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete Sale Invoice unsucessful");
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public SaleInvoice GetInfo(ReqListSearch reqListSearch)
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
                        string SaleInvoiceId = reqListSearch.SearchString;
                        listCondition.Add("si.SaleInvoiceId = @SaleInvoiceId");
                        param.Add("SaleInvoiceId", SaleInvoiceId);

                        if (listCondition.Count > 0)
                        {
                            sqlWhere = "WHERE " + listCondition.Join(" AND ");
                        }
                    }
                    else
                    {
                        return new SaleInvoice();
                    }

                    string sqlQuery = @"SELECT
                                                  si.*
                                                 ,u.FullName UserName
                                                FROM sale.SaleInvoice si
                                                JOIN acc.[User] u
                                                  ON si.CreatedBy = u.UserId
                                                                                      " + sqlWhere;

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        return multiResult.Read<SaleInvoice>().Single();
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

        private bool CheckExistCode(string code)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    int count = 0;
                    count = db.SaleInvoice.Count(m => m.SaleInvoiceCode == code);
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
    }
}