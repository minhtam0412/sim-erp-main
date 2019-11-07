using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Text.RegularExpressions;
using Dapper;
using Microsoft.EntityFrameworkCore;
using SimERP.Data.DBEntities;

namespace SimERP.Data
{
    public class Repository<T> : IRepository<T> where T : class, new()
    {
        #region Variables

        string MsgCode, MsgMessage, MsgErrorCode;
        protected ConnectionFactory IConnect;

        #endregion

        #region Constructors

        /// <summary>
        /// Constructor
        /// </summary>
        protected Repository()
        {
            if (IConnect == null)
            {
                IConnect = new ConnectionFactory(new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["DBConnectionString"].ConnectionString));
            }
        }

        #endregion

        #region Get Data

        /// <summary>
        /// Get List object
        /// </summary>
        /// <param name="navigationProperties">parameter</param>
        /// <returns>Return IList objects</returns>
        public IList<T> GetAll(params Expression<Func<T, object>>[] navigationProperties)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    List<T> list;
                    IQueryable<T> dbQuery = db.Set<T>();

                    //Apply eager loading
                    foreach (Expression<Func<T, object>> navigationProperty in navigationProperties)
                        dbQuery = dbQuery.Include<T, object>(navigationProperty);

                    list = dbQuery
                        .AsNoTracking()
                        .ToList<T>();
                    this.TotalRows = list.Count();
                    return list;
                }
            }
            catch
            {
                throw;
            }
        }

        public IList<T> GetAll(int startRow, int maxRow, params Expression<Func<T, object>>[] navigationProperties)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    List<T> list;
                    IQueryable<T> dbQuery = db.Set<T>();

                    //Apply eager loading
                    foreach (Expression<Func<T, object>> navigationProperty in navigationProperties)
                        dbQuery = dbQuery.Include<T, object>(navigationProperty);

                    list = dbQuery
                        .AsNoTracking()
                        .ToList<T>();
                    this.TotalRows = list.Count();
                    return list.Skip(startRow).Take(maxRow).ToList();
                }
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get list object by some conditions 
        /// </summary>
        /// <param name="where">Where conditions</param>
        /// <param name="navigationProperties"></param>
        /// <returns></returns>
        public IList<T> GetList(Func<T, bool> where, params Expression<Func<T, object>>[] navigationProperties)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    List<T> list;
                    IQueryable<T> dbQuery = db.Set<T>();

                    //Apply eager loading
                    foreach (Expression<Func<T, object>> navigationProperty in navigationProperties)
                        dbQuery = dbQuery.Include<T, object>(navigationProperty);

                    list = dbQuery
                        .AsNoTracking()
                        .Where(where)
                        .ToList<T>();
                    this.TotalRows = list.Count();
                    return list;
                }
            }
            catch
            {
                throw;
            }
        }

        public IList<T> GetList(int startRow, int maxRow, Func<T, bool> where, params Expression<Func<T, object>>[] navigationProperties)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    List<T> list;
                    IQueryable<T> dbQuery = db.Set<T>();

                    //Apply eager loading
                    foreach (Expression<Func<T, object>> navigationProperty in navigationProperties)
                        dbQuery = dbQuery.Include<T, object>(navigationProperty);

                    list = dbQuery
                        .AsNoTracking()
                        .Where(where)
                        .ToList<T>();
                    this.TotalRows = list.Count();
                    return list.Skip(startRow).Take(maxRow).ToList();
                }
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get single object
        /// </summary>
        /// <param name="where">Where some conditions</param>
        /// <param name="navigationProperties"></param>
        /// <returns>Return Object </returns>
        public T GetSingle(Func<T, bool> where, params Expression<Func<T, object>>[] navigationProperties)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    T item = null;
                    IQueryable<T> dbQuery = db.Set<T>();

                    //Apply eager loading
                    foreach (Expression<Func<T, object>> navigationProperty in navigationProperties)
                        dbQuery = dbQuery.Include<T, object>(navigationProperty);

                    item = dbQuery
                        .AsNoTracking() //Don't track any changes for the selected item
                        .FirstOrDefault(where); //Apply where clause
                    this.TotalRows = 1;
                    return item;
                }
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get object by object ID
        /// </summary>
        /// <param name="ID">object ID</param>
        /// <returns>Return only object</returns>
        public T GetByID(object ID)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    return db.Set<T>().Find(ID);
                }
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get message error by msgCode
        /// </summary>
        /// <param name="Code">Message Code</param>
        /// <returns>Return message</returns>
        public string GetMessage(string Code, string Lang)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    return db.Message.Find(Code, Lang).Messages;
                }
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Get current message
        /// </summary>
        /// <returns>Return message</returns>
        public string GetMessage()
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    return db.Message.Find(MsgCode).Messages;
                }
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Add message
        /// </summary>
        /// <param name="Code">Message Code</param>
        /// <param name="Message">Message Text</param>
        public void AddMessage(string Code, string Message, string ErrorCode = "")
        {
            MsgCode = Code;
            MsgMessage = Message;
            MsgErrorCode = ErrorCode;
        }

        public string getMsgCode()
        {
            return MsgCode;
        }

        public string getMessage()
        {
            return MsgMessage;
        }

        public string getErrorCode()
        {
            return MsgErrorCode;
        }

        #endregion

        #region Insert, Update, Delete

        /// <summary>
        /// Add new item
        /// </summary>
        /// <param name="item">Object</param>
        /// <returns>True/False</returns>
        public bool Add(T item)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    db.Entry(item).State = Microsoft.EntityFrameworkCore.EntityState.Added;
                    db.SaveChanges();
                    return true;
                }
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Add news multi items
        /// </summary>
        /// <param name="items">list items</param>
        /// <returns>True/False</returns>
        public bool Add(List<T> items)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    foreach (T item in items)
                    {
                        db.Entry(item).State = Microsoft.EntityFrameworkCore.EntityState.Added;
                    }

                    db.SaveChanges();
                    return true;
                }
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Update item
        /// </summary>
        /// <param name="item">Item</param>
        /// <returns>True/False</returns>
        public bool Update(T item)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    Microsoft.EntityFrameworkCore.DbSet<T> dbSet = db.Set<T>();
                    db.Entry(item).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    db.SaveChanges();
                    return true;
                }
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Update list items
        /// </summary>
        /// <param name="items">List items</param>
        /// <returns>True/False</returns>
        public bool Update(List<T> items)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    foreach (T item in items)
                    {
                        db.Entry(item).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    }

                    db.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Delete item by ID
        /// </summary>
        /// <param name="ID">Item ID</param>
        /// <returns>True/False</returns>
        public bool Delete(object ID)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    DbSet<T> dbSet;
                    dbSet = db.Set<T>();
                    T obj = db.Set<T>().Find(ID);
                    if (db.Entry(obj).State == EntityState.Detached)
                    {
                        dbSet.Attach(obj);
                    }

                    dbSet.Remove(obj);
                    db.SaveChanges();
                    return true;
                }
            }
            catch (DbUpdateException ex)
            {
                var sqlException = ex.GetBaseException() as SqlException;
                // Exception occur when having other table relation with this table
                if (sqlException != null && sqlException.Number == 547)
                {
                    this.AddMessage("DEL-000002", ex.Message);
                    return false;
                }
                else
                {
                    throw;
                }
            }
            catch
            {
                this.AddMessage("DEL-000001", "Delete dữ liệu không thành công");
                throw;
            }
        }

        /// <summary>
        /// Delete multi items
        /// </summary>
        /// <param name="items">List items</param>
        /// <returns>True/False</returns>
        public bool Delete(List<T> items)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    DbSet<T> dbSet;
                    dbSet = db.Set<T>();
                    dbSet.RemoveRange(items);
                    db.SaveChanges();
                    return true;
                }
            }
            catch (DbUpdateException ex)
            {
                var sqlException = ex.GetBaseException() as SqlException;
                // Exception occur when having other table relation with this table
                if (sqlException != null && sqlException.Number == 547)
                {
                    this.AddMessage("DEL-000002", ex.Message);
                    return false;
                }
                else
                {
                    throw;
                }
            }
            catch
            {
                throw;
            }
        }

        #endregion

        #region Utils Function

        public Fiscal GetCurrentFiscal()
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    var select = from c in db.Fiscal
                        where c.IsCurrent == true
                        select c;
                    return select.FirstOrDefault();
                }
            }
            catch
            {
                return null;
            }
        }

        public decimal GetCurrentBalanceAmount(int storeID, Guid objID, int objType)
        {
            //try
            //{
            //    using (var db = new DBEntities())
            //    {
            //        string sqlWhere = "Where l.StoreID=@StoreID AND l.ObjectID=@ObjectID AND l.ObjectType=@ObjectType";
            //        DynamicParameters param = new DynamicParameters();
            //        param.Add("StoreID", storeID);
            //        param.Add("ObjectID", objID);
            //        param.Add("ObjectType", objType);

            //        string sqlQuery = @"SELECT TOP(1) ISNULL(l.BalanceAmount, 0) as BalanceAmount
            //                                FROM ledger.ARLedger l WITH(NOLOCK) " + sqlWhere + " ORDER BY l.AccountingDate DESC, l.SortNumber DESC";
            //        return db.Database.Connection.Query<long>(sqlQuery, param).FirstOrDefault();
            //    }
            //}
            //catch
            //{
            //    return 0;
            //}
            return 0;
        }

        public string GetStoreList(List<string> storeList)
        {
            try
            {
                if (storeList == null || storeList.Count == 0)
                    return null;
                return String.Join(", ", storeList.ToArray());
            }
            catch
            {
                return null;
            }
        }

        public string GetStoreListID(List<int> storeList)
        {
            try
            {
                if (storeList == null || storeList.Count == 0)
                    return null;
                return "[" + String.Join("], ", storeList.ToArray()) + "]";
            }
            catch
            {
                return null;
            }
        }

        public string GetOptionSystemByID(string OptionID)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    var select = from c in db.OptionSystem
                        where c.OptionName == OptionID
                        select c;
                    return select.First().Value;
                }
            }
            catch
            {
                return null;
            }
        }

        public string GetOptionSystemByID(int storeID, string OptionID)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    var select = from c in db.OptionSystem
                        where c.StoreId == storeID && c.OptionName == OptionID
                        select c;
                    return select.First().Value;
                }
            }
            catch
            {
                return null;
            }
        }

        public bool GetOptionSystemByValue(string OptionID)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    var select = from c in db.OptionSystem
                        where c.OptionName == OptionID
                        select c;
                    return select.First().Value == "1" ? true : false;
                }
            }
            catch
            {
                return false;
            }
        }

        public bool GetOptionSystemByValue(int storeID, string OptionID)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    var select = from c in db.OptionSystem
                        where c.StoreId == storeID && c.OptionName == OptionID
                        select c;
                    return select.First().Value == "1" ? true : false;
                }
            }
            catch
            {
                return false;
            }
        }

        public int GetMaxSortOrder(Func<T, int> columnSelector)
        {
            using (var db = new DBEntities.DBEntities())
            {
                var maxSortOrder = db.Set<T>().Max(columnSelector);
                return maxSortOrder + 1;
            }                
        }

        #endregion

        #region Generate RefNo

        public string GetRefNoCode(int storeID, string refType, DateTime voucherDate)
        {
            try
            {
                int length = 3;
                long currNumber = 0;
                string voucherCode = string.Empty, prefixDate = string.Empty;

                var rowRefNo = this.GetRefNoConfig(storeID, refType);
                if (rowRefNo != null)
                {
                    if (!string.IsNullOrEmpty(rowRefNo.SequenceName))
                        currNumber = (long) this.GetCurrentRefNo(rowRefNo.SequenceName);
                    else
                        currNumber = GetCurrentNumber(storeID, rowRefNo.SqlQueryRefNo, voucherDate);
                    length = rowRefNo.Length;
                    if (rowRefNo.IsProfixDate)
                        prefixDate = (DateTime.Now.Day >= 10 ? "" : "0") + DateTime.Now.Day.ToString();
                    if (rowRefNo.IsProfixMontYear)
                        prefixDate += (DateTime.Now.Month >= 10 ? "" : "0") + DateTime.Now.Month.ToString() + DateTime.Now.Year.ToString().Substring(2, 2);
                    if (rowRefNo.IsProfixDate || rowRefNo.IsProfixMontYear)
                        prefixDate = "/" + prefixDate;
                    voucherCode = rowRefNo.FormateString.Trim() + LeadingZeros(currNumber, length).Trim() + prefixDate;
                    return voucherCode;
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                return null;
            }
        }

        public string GetRefNoCode(int storeID, string refType, DateTime voucherDate, ref long currNumber)
        {
            try
            {
                int length = 3;
                string voucherCode = string.Empty, prefixDate = string.Empty;

                var rowRefNo = this.GetRefNoConfig(storeID, refType);
                if (rowRefNo != null)
                {
                    length = rowRefNo.Length;
                    if (!string.IsNullOrEmpty(rowRefNo.SequenceName))
                        currNumber = (long) this.GetCurrentRefNo(rowRefNo.SequenceName);
                    else
                        currNumber = GetCurrentNumber(storeID, rowRefNo.SqlQueryRefNo, voucherDate);
                    if (rowRefNo.IsProfixDate)
                        prefixDate = (DateTime.Now.Day >= 10 ? "" : "0") + DateTime.Now.Day.ToString();
                    if (rowRefNo.IsProfixMontYear)
                        prefixDate += (DateTime.Now.Month >= 10 ? "" : "0") + DateTime.Now.Month.ToString() + DateTime.Now.Year.ToString().Substring(2, 2);

                    if (rowRefNo.IsProfixDate || rowRefNo.IsProfixMontYear)
                        prefixDate = "/" + prefixDate;
                    voucherCode = rowRefNo.FormateString.Trim() + LeadingZeros(currNumber, length).Trim() + prefixDate;
                    return voucherCode;
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                return null;
            }
        }

        public string GetNextRefNo(int storeID, string refType)
        {
            try
            {
                int length = 3;
                long currNumber = 0;
                string voucherCode = string.Empty, prefixDate = string.Empty;

                var rowRefNo = this.GetRefNoConfig(storeID, refType);
                if (rowRefNo != null)
                {
                    currNumber = (long) this.GetNextSequenceRefNo(rowRefNo.SequenceName);
                    length = rowRefNo.Length;
                    if (rowRefNo.IsProfixDate)
                        prefixDate = (DateTime.Now.Day >= 10 ? "" : "0") + DateTime.Now.Day.ToString();
                    if (rowRefNo.IsProfixMontYear)
                        prefixDate += (DateTime.Now.Month >= 10 ? "" : "0") + DateTime.Now.Month.ToString() + DateTime.Now.Year.ToString().Substring(2, 2);
                    if (rowRefNo.IsProfixDate || rowRefNo.IsProfixMontYear)
                        prefixDate = "/" + prefixDate;
                    voucherCode = rowRefNo.FormateString.Trim() + LeadingZeros(currNumber, length).Trim() + prefixDate;
                    return voucherCode;
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                return null;
            }
        }

        private RefNo GetRefNoConfig(int storeID, string refType)
        {
            try
            {
                using (var db = new DBEntities.DBEntities())
                {
                    var rowRefNo = (from c in db.RefNo
                        where c.StoreId == storeID && c.RefType == refType
                        select c).FirstOrDefault();
                    return rowRefNo;
                }
            }
            catch
            {
                return null;
            }
        }

        private long GetCurrentNumber(int storeID, string sqlQuery, DateTime voucherDate)
        {
            //try
            //{
            //    using (var db = new DBEntities())
            //    {
            //        long currNumber;
            //        if (storeID != -1)
            //        {
            //            DynamicParameters param = new DynamicParameters();
            //            param.Add("StoreID", storeID);
            //            param.Add("VoucherDate", voucherDate);
            //            currNumber = db.Database.Connection.Query<long>(sqlQuery, param).FirstOrDefault();
            //        }
            //        else
            //        {
            //            currNumber = db.Database.Connection.Query<long>(sqlQuery).FirstOrDefault();
            //        }
            //        return currNumber + 1;
            //    }
            //}
            //catch
            //{
            //    return -1;
            //}
            return -1;
        }

        private string LeadingZeros(long currNumber, int length)
        {
            int addNumber = length - currNumber.ToString().Length;
            if (addNumber == 0)
            {
                return currNumber.ToString();
            }
            else
            {
                return currNumber.ToString().PadLeft(length, '0');
            }
        }

        private decimal GetCurrentRefNo(string sequenceName)
        {
            using (System.Data.IDbConnection conn = IConnect.GetOpenConnection())
            {
                #region Where Clause

                DynamicParameters param = new DynamicParameters();
                var sqlWhere = new StringBuilder("name=@pName");
                param.Add("pName", sequenceName);

                #endregion

                string sqlQuery = @"SELECT current_value FROM sys.sequences where " + sqlWhere;

                using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                {
                    return multiResult.Read<int>().Single() + 1;
                }
            }
        }

        private decimal GetNextSequenceRefNo(string sequenceName)
        {
            //using (var db = new DBEntities())
            //{
            //    string sqlQuery = @"SELECT next VALUE FOR " + sequenceName;
            //    var nextSequenceRefNo = db.Database.Connection.Query<decimal>(sqlQuery).First();
            //    if (nextSequenceRefNo == 0)
            //        nextSequenceRefNo = 1;
            //    return nextSequenceRefNo;
            //}
            return -1;
        }

        #endregion

        #region Get & Set

        public int TotalRows { get; set; }
        public string LangID { get; set; }

        public string GetFullNameByUserID(Guid userID)
        {
            //try
            //{
            //    using (var db = new DBEntities())
            //    {
            //        DynamicParameters param = new DynamicParameters();
            //        param.Add("UserID", userID);
            //        param.Add("LanguageID", this.LangID);

            //        string sqlQuery = @"select l.FullName
            //                            from acc.[UserProfile] p with(nolock)
            //                                 left join acc.UserProfileLang l with(nolock) on l.ProfileID=p.ProfileID
            //                            where p.UserID = @UserID and l.LanguageID = @LanguageID";

            //        return db.Database.Connection.Query<string>(sqlQuery, param).First();
            //    }
            //}
            //catch
            //{
            //    throw;
            //}
            return string.Empty;
        }

        #endregion

        #region Private 

        private string GetTableName()
        {
            //using (var db = new DBEntities())
            //{
            //    var objectContext = ((IObjectContextAdapter)db).ObjectContext;
            //    var sql = objectContext.CreateObjectSet<T>().ToTraceString();
            //    var regex = new Regex(@"FROM\s+(?<table>.+)\s+AS");
            //    var match = regex.Match(sql);

            //    return match.Groups["table"].Value;
            //}
            return "TableName";
        }

        #endregion
    }
}