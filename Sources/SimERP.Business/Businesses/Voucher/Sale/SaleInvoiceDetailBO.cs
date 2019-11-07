using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore.Internal;
using SimERP.Business.Interfaces.Voucher.Sale;
using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Business.Models.Voucher.Sale;
using SimERP.Data;

namespace SimERP.Business.Businesses.Voucher.Sale
{
    public class SaleInvoiceDetailBO : Repository<SaleInvoiceDetail>, ISaleInvoiceDetail
    {
        public List<SaleInvoiceDetail> GetData(ReqListSearch reqListSearch)
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
                        listCondition.Add("sid.SaleInvoiceId = @SaleInvoiceId");
                        param.Add("SaleInvoiceId", SaleInvoiceId);

                        if (listCondition.Count > 0)
                        {
                            sqlWhere = "WHERE " + listCondition.Join(" AND ");
                        }
                    }
                    else
                    {
                        return new List<SaleInvoiceDetail>();
                    }

                    string sqlQuery = @"SELECT count(1)
                                            FROM sale.SaleInvoiceDetail sid WITH(NOLOCK)
                                              JOIN item.Product p ON sid.ProductId = p.ProductId
                                              LEFT JOIN item.Unit u ON p.UnitId = u.UnitId " + sqlWhere +
                                        @";SELECT
                                              sid.*, u.UnitName
                                            FROM sale.SaleInvoiceDetail sid WITH(NOLOCK)
                                              JOIN item.Product p ON sid.ProductId = p.ProductId
                                              LEFT JOIN item.Unit u ON p.UnitId = u.UnitId
                                                                                      " + sqlWhere;

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<SaleInvoiceDetail>().ToList();
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
    }
}
