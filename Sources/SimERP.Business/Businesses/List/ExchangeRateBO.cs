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
using ExchangeRate = SimERP.Business.Models.MasterData.ListDTO.ExchangeRate;

namespace SimERP.Business
{
    public class ExchangeRateBO : Repository<ExchangeRate>, IExchangeRate
    {
        public List<ExchangeRate> GetData(ReqListSearch reqListSearch)
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
                        listCondition.Add("c.SearchString Like @SearchString");
                        param.Add("SearchString", "%" + reqListSearch.SearchString + "%");
                    }

                    if (reqListSearch.AddtionParams != null && reqListSearch.AddtionParams.Count > 0)
                    {
                        if (reqListSearch.AddtionParams["FromDate"] != null)
                        {
                            var fromDate = DateTimeOffset.Parse(reqListSearch.AddtionParams["FromDate"].ToString());
                            if (fromDate != null)
                            {
                                listCondition.Add("cast(er.ExchangeDate as Date) >= cast(@FromDate as Date)");
                                param.Add("FromDate", fromDate);
                            }
                        }


                        if (reqListSearch.AddtionParams["ToDate"] != null)
                        {
                            var toDate = DateTimeOffset.Parse(reqListSearch.AddtionParams["ToDate"].ToString());
                            if (toDate != null)
                            {
                                listCondition.Add("cast(er.ExchangeDate as Date) <= cast(@ToDate as Date)");
                                param.Add("ToDate", toDate);
                            }
                        }
                    }

                    if (listCondition.Count > 0)
                    {
                        sqlWhere = "WHERE " + listCondition.Join(" AND ");
                    }

                    string sqlQuery = @"SELECT count(1)
                                            FROM list.ExchangeRate er WITH (NOLOCK)
                                            LEFT JOIN list.Currency c
                                              ON er.CurrencyId = c.CurrencyId " + sqlWhere +
                                      @";SELECT
                                              er.*
                                             ,c.CurrencyName
                                            FROM list.ExchangeRate er WITH (NOLOCK)
                                            LEFT JOIN list.Currency c
                                              ON er.CurrencyId = c.CurrencyId
                                          " + sqlWhere + " ORDER BY er.ExchangeDate OFFSET " + reqListSearch.StartRow +
                                      " ROWS FETCH NEXT " + reqListSearch.MaxRow + " ROWS ONLY";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<ExchangeRate>().ToList();
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

        public bool Save(ExchangeRate rowData, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        db.ExchangeRate.Add(rowData);
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

        public bool DeleteExchangeRate(int id)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    //TODO LIST: Kiểm tra sử dụng trước khi xóa
                    db.ExchangeRate.Remove(db.ExchangeRate.Find(id));
                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete ExchangeRate unsucessful");
                Logger.Error(GetType(), ex);
                return false;
            }
        }
    }
}