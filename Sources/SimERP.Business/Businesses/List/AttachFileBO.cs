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
using AttachFile = SimERP.Business.Models.MasterData.ListDTO.AttachFile;

namespace SimERP.Business.Businesses.List
{
    public class AttachFileBO : Repository<AttachFile>, IAttachFile
    {
        public List<AttachFile> GetData(ReqListSearch reqListSearch)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();
                    List<string> listCondition = new List<string>();

                    if (reqListSearch.AddtionParams.ContainsKey("KeyValue"))
                    {
                        listCondition.Add("af.KeyValue = @KeyValue");
                        param.Add("KeyValue", Convert.ToString(reqListSearch.AddtionParams["KeyValue"]));
                    }

                    if (reqListSearch.AddtionParams.ContainsKey("OptionName"))
                    {
                        listCondition.Add("af.OptionName = @OptionName");
                        param.Add("OptionName", Convert.ToString(reqListSearch.AddtionParams["OptionName"]));
                    }

                    if (listCondition.Count > 0)
                    {
                        sqlWhere = "WHERE " + listCondition.Join(" AND ");
                    }

                    string sqlQuery = @"SELECT * FROM AttachFile af " + sqlWhere + " ORDER BY af.SortOrder ASC";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        return multiResult.Read<AttachFile>().ToList();
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

        public bool Save(AttachFile attachFile, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        db.AttachFile.Add(attachFile);
                    }
                    else
                    {
                        db.Entry(attachFile).State = EntityState.Modified;
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
                    db.AttachFile.Remove(db.AttachFile.Find(id));
                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete attachFile unsucessful");
                Logger.Error(GetType(), ex);
                return false;
            }
        }
    }
}