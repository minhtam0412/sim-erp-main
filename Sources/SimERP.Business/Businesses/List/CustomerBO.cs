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
    public class CustomerBO : Repository<Customer>, ICustomer
    {
        public List<Models.MasterData.ListDTO.Customer> GetData(string searchString, int? customerTypeId, bool? IsActive, int startRow,
            int maxRows)
        {
            try
            {
                List<Models.MasterData.ListDTO.Customer> dataResult = new List<Models.MasterData.ListDTO.Customer>();

                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();

                    if (!string.IsNullOrEmpty(searchString) || IsActive != null || customerTypeId != null)
                        sqlWhere += " WHERE ";

                    if (IsActive != null)
                    {
                        sqlWhere += " t.IsActive = @IsActive ";
                        param.Add("IsActive", IsActive);
                    }

                    if (customerTypeId != null)
                    {
                        if (IsActive != null)
                            sqlWhere += " AND ";
                        sqlWhere += " t.CustomerTypeId = @customerTypeId ";
                        param.Add("customerTypeId", customerTypeId);
                    }

                    if (!string.IsNullOrEmpty(searchString))
                    {
                        if (IsActive != null || customerTypeId != null)
                            sqlWhere += " AND ";
                        sqlWhere += " t.SearchString Like @SearchString ";
                        param.Add("SearchString", "%" + searchString + "%");
                    }

                    string sqlQuery = @" SELECT Count(1) FROM  [list].[Customer] t with(nolock) " + sqlWhere +
                                      @";SELECT t.* FROM [list].[Customer] t with(nolock) 
                                        JOIN [list].[CustomerType] m with(nolock) on m.CustomerTypeId = t.CustomerTypeId
                                          " + sqlWhere + " ORDER BY t.SortOrder OFFSET " + startRow +
                                      " ROWS FETCH NEXT " + maxRows + " ROWS ONLY";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        dataResult = multiResult.Read<Models.MasterData.ListDTO.Customer>().ToList();
                    }

                    return dataResult;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return null;
            }
        }

        public Models.MasterData.ListDTO.Customer GetCustomerDetail(int customerId)
        {
            try
            {
                Models.MasterData.ListDTO.Customer dataResult = new Models.MasterData.ListDTO.Customer();

                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();
                    param.Add("customerId", customerId);

                    string sqlQuery = @"SELECT t.*, u.FullName AS 'CreateName' FROM [list].[Customer] t with(nolock) 
                                        JOIN [acc].[User] u with(nolock) ON u.UserId = t.CreatedBy WHERE t.CustomerId = @customerId";

                    var customer = conn.QueryMultiple(sqlQuery, param);
                    dataResult = customer.Read<Models.MasterData.ListDTO.Customer>().ToList()[0];

                    //--Product--
                    sqlQuery = @"SELECT t.*, u.FullName AS 'SaleName', p.ProductCode, p.ProductName, p.ProductCategoryId, pc.ProductCategoryName, un.UnitName FROM [list].[CustomerProduct] t with(nolock) 
                                        LEFT JOIN [acc].[User] u with(nolock) ON u.UserId = t.SaleId
                                        LEFT JOIN [item].Product p with(nolock) ON p.ProductId = t.ProductId
                                        LEFT JOIN [item].ProductCategory pc with(nolock) ON pc.ProductCategoryId = p.ProductCategoryId
                                        LEFT JOIN [item].Unit un with(nolock) ON un.UnitId = p.UnitId
                                        WHERE t.CustomerId = @customerId";

                    var product = conn.QueryMultiple(sqlQuery, param);
                    dataResult.objProduct = product.Read<Models.MasterData.ListDTO.CustomerProduct>().ToList();
                    //--Sale--
                    sqlQuery = @"SELECT t.*, u.UserCode, u.UserName, u.FullName FROM [list].[CustomerSale] t with(nolock) 
                                        LEFT JOIN [acc].[User] u with(nolock) ON u.UserId = t.SaleId
                                        WHERE t.CustomerId = @customerId";

                    var sale = conn.QueryMultiple(sqlQuery, param);
                    dataResult.objSaler = sale.Read<Models.MasterData.ListDTO.CustomerSale>().ToList();

                    //--CustomerCommission--
                    sqlQuery = @"SELECT t.* FROM [list].[CustomerCommission] t with(nolock) 
                                    WHERE t.CustomerId = @customerId";

                    var commission = conn.QueryMultiple(sqlQuery, param);
                    dataResult.objCommission = commission.Read<CustomerCommission>().ToList();

                    //--CustomerDelivery--
                    sqlQuery = @"SELECT t.* FROM [list].[CustomerDelivery] t with(nolock) 
                                    WHERE t.CustomerId = @customerId";

                    var delivery = conn.QueryMultiple(sqlQuery, param);
                    dataResult.objDelivery = delivery.Read<CustomerDelivery>().ToList();

                    dataResult.ListAttachFile = new List<Models.MasterData.ListDTO.AttachFile>();

                    return dataResult;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return null;
            }
        }

        public bool Save(Business.Models.MasterData.ListDTO.Customer rowData, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            //----save Customer
                            if (isNew)
                            {
                                if (CheckExistCustomerCode(rowData.CustomerCode))
                                {
                                    this.AddMessage("000004", "Mã khách hàng đã tồn tại, vui lòng chọn mã khác!");
                                    return false;
                                }

                                var max = db.Customer.Max(u => (int?)u.SortOrder);
                                rowData.SortOrder = db.Customer.Max(u => (int?)u.SortOrder) != null ? db.Customer.Max(u => (int?)u.SortOrder) + 1 : 1;

                                db.Customer.Add(rowData);
                            }
                            else
                            {
                                db.Entry(rowData).State = EntityState.Modified;
                            }

                            db.SaveChanges();

                            //----save CustomerProduct
                            CheckCustomerProduct(rowData, isNew);

                            //----save CustomerSale
                            CheckCustomerSale(rowData, isNew);

                            //----save CustomerCommission
                            CheckCustomerCommission(rowData, isNew);

                            //----save CustomerDelivery
                            CheckCustomerDelivery(rowData, isNew);

                            //----save CustomerAttachFile
                            if (rowData.ListAttachFile.Count > 0)
                                SaveCustomerAttachFile(rowData, isNew);

                            transaction.Commit();
                            return true;
                        }
                        catch (Exception e)
                        {
                            transaction.Rollback();
                            return false;
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
        }

        public bool CheckCustomerProduct(Business.Models.MasterData.ListDTO.Customer rowData, bool isNew)
        {
            try
            {
                if (rowData.objProduct.Count <= 0)
                {
                    using (IDbConnection conn = IConnect.GetOpenConnection())
                    {
                        DynamicParameters param = new DynamicParameters();
                        param.Add("customerId", rowData.CustomerId);

                        string sqlQuery = @"DELETE FROM [list].[CustomerProduct]
                                            WHERE CustomerId = @customerId";

                        conn.Query(sqlQuery, param);
                    }
                }
                else
                {
                    using (IDbConnection conn = IConnect.GetOpenConnection())
                    {
                        DynamicParameters param = new DynamicParameters();
                        param.Add("customerId", rowData.CustomerId);

                        string sqlQuery = @"SELECT t.* FROM [list].[CustomerProduct] t with(nolock) 
                                                        WHERE t.CustomerId = @customerId";

                        var dResult = conn.QueryMultiple(sqlQuery, param);
                        List<Models.MasterData.ListDTO.CustomerProduct> dataResult = dResult.Read<Models.MasterData.ListDTO.CustomerProduct>().ToList();

                        foreach (Models.MasterData.ListDTO.CustomerProduct item in dataResult)
                        {
                            if (rowData.objProduct.FindIndex(x => x.RowId == item.RowId) < 0)
                            {
                                sqlQuery = @"DELETE FROM [list].[CustomerProduct]
                                            WHERE RowId = " + item.RowId;

                                conn.Query(sqlQuery);
                            }
                        }
                    }

                    foreach (CustomerProduct item in rowData.objProduct)
                    {
                        if (!SaveCustomerProduct(item, (int)rowData.CustomerId, isNew))
                            return false;
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_002, "Lưu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool SaveCustomerProduct(Data.DBEntities.CustomerProduct rowData, int CustomerId, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew || rowData.RowId == 0 || rowData.RowId == null)
                    {

                        rowData.CustomerId = CustomerId;
                        db.CustomerProduct.Add(rowData);
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

        public bool CheckCustomerSale(Business.Models.MasterData.ListDTO.Customer rowData, bool isNew)
        {
            try
            {
                if (rowData.objSaler.Count <= 0)
                {
                    using (IDbConnection conn = IConnect.GetOpenConnection())
                    {
                        DynamicParameters param = new DynamicParameters();
                        param.Add("customerId", rowData.CustomerId);

                        string sqlQuery = @"DELETE FROM [list].[CustomerSale]
                                            WHERE CustomerId = @customerId";

                        conn.Query(sqlQuery, param);
                    }
                }
                else
                {
                    using (IDbConnection conn = IConnect.GetOpenConnection())
                    {
                        DynamicParameters param = new DynamicParameters();
                        param.Add("customerId", rowData.CustomerId);

                        string sqlQuery = @"SELECT t.* FROM [list].[CustomerSale] t with(nolock) 
                                                        WHERE t.CustomerId = @customerId";

                        var dResult = conn.QueryMultiple(sqlQuery, param);
                        List<Models.MasterData.ListDTO.CustomerSale> dataResult = dResult.Read<Models.MasterData.ListDTO.CustomerSale>().ToList();

                        foreach (Models.MasterData.ListDTO.CustomerSale item in dataResult)
                        {
                            if (rowData.objSaler.FindIndex(x => x.RowId == item.RowId) < 0)
                            {
                                sqlQuery = @"DELETE FROM [list].[CustomerSale]
                                            WHERE RowId = " + item.RowId;

                                conn.Query(sqlQuery);
                            }
                        }
                    }

                    foreach (CustomerSale item in rowData.objSaler)
                    {
                        if (!SaveCustomerSale(item, (int)rowData.CustomerId, isNew))
                            return false;
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_002, "Lưu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool SaveCustomerSale(Data.DBEntities.CustomerSale rowData, int CustomerId, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew || rowData.RowId == 0 || rowData.RowId == null)
                    {

                        rowData.CustomerId = CustomerId;
                        db.CustomerSale.Add(rowData);
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

        public bool CheckCustomerCommission(Business.Models.MasterData.ListDTO.Customer rowData, bool isNew)
        {
            try
            {
                if (rowData.objCommission.Count <= 0)
                {
                    using (IDbConnection conn = IConnect.GetOpenConnection())
                    {
                        DynamicParameters param = new DynamicParameters();
                        param.Add("customerId", rowData.CustomerId);

                        string sqlQuery = @"DELETE FROM [list].[CustomerCommission]
                                            WHERE CustomerId = @customerId";

                        conn.Query(sqlQuery, param);
                    }
                }
                else
                {
                    using (IDbConnection conn = IConnect.GetOpenConnection())
                    {
                        DynamicParameters param = new DynamicParameters();
                        param.Add("customerId", rowData.CustomerId);

                        string sqlQuery = @"SELECT t.* FROM [list].[CustomerCommission] t with(nolock) 
                                                        WHERE t.CustomerId = @customerId";

                        var dResult = conn.QueryMultiple(sqlQuery, param);
                        List<CustomerCommission> dataResult = dResult.Read<CustomerCommission>().ToList();

                        foreach (CustomerCommission item in dataResult)
                        {
                            if (rowData.objCommission.FindIndex(x => x.RowId == item.RowId) < 0)
                            {
                                sqlQuery = @"DELETE FROM [list].[CustomerCommission]
                                            WHERE RowId = " + item.RowId;

                                conn.Query(sqlQuery);
                            }
                        }
                    }

                    foreach (CustomerCommission item in rowData.objCommission)
                    {
                        if (!SaveCustomerCommission(item, (int)rowData.CustomerId, isNew))
                            return false;
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_002, "Lưu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool SaveCustomerCommission(Data.DBEntities.CustomerCommission rowData, int CustomerId, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew || rowData.RowId == 0 || rowData.RowId == null)
                    {
                        rowData.CustomerId = CustomerId;
                        db.CustomerCommission.Add(rowData);
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

        public bool CheckCustomerDelivery(Business.Models.MasterData.ListDTO.Customer rowData, bool isNew)
        {
            try
            {
                if (rowData.objDelivery.Count <= 0)
                {
                    using (IDbConnection conn = IConnect.GetOpenConnection())
                    {
                        DynamicParameters param = new DynamicParameters();
                        param.Add("customerId", rowData.CustomerId);

                        string sqlQuery = @"DELETE FROM [list].[CustomerDelivery]
                                            WHERE CustomerId = @customerId";

                        conn.Query(sqlQuery, param);
                    }
                }
                else
                {
                    using (IDbConnection conn = IConnect.GetOpenConnection())
                    {
                        DynamicParameters param = new DynamicParameters();
                        param.Add("customerId", rowData.CustomerId);

                        string sqlQuery = @"SELECT t.* FROM [list].[CustomerDelivery] t with(nolock) 
                                                        WHERE t.CustomerId = @customerId";

                        var dResult = conn.QueryMultiple(sqlQuery, param);
                        List<CustomerDelivery> dataResult = dResult.Read<CustomerDelivery>().ToList();

                        foreach (CustomerDelivery item in dataResult)
                        {
                            if (rowData.objDelivery.FindIndex(x => x.RowId == item.RowId) < 0)
                            {
                                sqlQuery = @"DELETE FROM [list].[CustomerDelivery]
                                            WHERE RowId = " + item.RowId;

                                conn.Query(sqlQuery);
                            }
                        }
                    }

                    foreach (CustomerDelivery item in rowData.objDelivery)
                    {
                        if (!SaveCustomerDelivery(item, (int)rowData.CustomerId, isNew))
                            return false;
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_002, "Lưu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool SaveCustomerDelivery(Data.DBEntities.CustomerDelivery rowData, int CustomerId, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew || rowData.RowId == 0 || rowData.RowId == null)
                    {
                        rowData.CustomerId = CustomerId;
                        db.CustomerDelivery.Add(rowData);
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

        public bool SaveCustomerAttachFile(Business.Models.MasterData.ListDTO.Customer rowData, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        if (rowData.CustomerId > 0)
                        {
                            foreach (var attachFile in rowData.ListAttachFile)
                            {
                                attachFile.KeyValue = Convert.ToString(rowData.CustomerId);
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
                        }
                    }
                    else
                    {
                        foreach (var attachFile in rowData.ListAttachFile)
                        {
                            attachFile.KeyValue = Convert.ToString(rowData.CustomerId);
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

        public bool UpdateSortOrder(long upID, long downID)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("UpID", upID);
                    param.Add("DownID", downID);

                    string sqlQuery =
                        @" UPDATE [list].[Customer] SET SortOrder = SortOrder - 1 WHERE CustomerId = @UpID;
                                         UPDATE [list].[Customer] SET SortOrder = SortOrder + 1 WHERE CustomerId = @DownID;";

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

        public bool Delete(long id)
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
                            if (DeleteCustomerAttachFile(id) && DeleteCustomerDelivery(id) && DeleteCustomerSale(id) && DeleteCustomerCommission(id)
                                 && DeleteCustomerProduct(id) && DeleteCustomer(db, id))
                            {
                                transaction.Commit();
                                return true;
                            }
                            else
                            {
                                transaction.Rollback();
                                return false;
                            }

                        }
                        catch (Exception e)
                        {
                            transaction.Rollback();
                            return false;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete Page unsucessfull");
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool DeleteCustomer(DBEntities db, long id)
        {
            try
            {
                db.Customer.Remove(db.Customer.Find(id));
                db.SaveChanges();
                return true;

            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete Customer unsucessfull");
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool DeleteCustomerProduct(long id)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("CustomerId", id);

                    string sqlQuery = @" DELETE [list].[CustomerProduct] WHERE CustomerId = @CustomerId";

                    conn.Query(sqlQuery, param);
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete CustomerProduct unsucessfull");
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool DeleteCustomerSale(long id)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("CustomerId", id);

                    string sqlQuery = @" DELETE [list].[CustomerSale] WHERE CustomerId = @CustomerId";

                    conn.Query(sqlQuery, param);
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete CustomerSale unsucessfull");
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool DeleteCustomerCommission(long id)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("CustomerId", id);

                    string sqlQuery = @" DELETE [list].[CustomerCommission] WHERE CustomerId = @CustomerId";

                    conn.Query(sqlQuery, param);
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete CustomerCommission unsucessfull");
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool DeleteCustomerDelivery(long id)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("CustomerId", id);

                    string sqlQuery = @" DELETE [list].[CustomerDelivery] WHERE CustomerId = @CustomerId";

                    conn.Query(sqlQuery, param);
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete CustomerDelivery unsucessfull");
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool DeleteCustomerAttachFile(long id)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("CustomerId", id);

                    string sqlQuery = @" DELETE [dbo].[AttachFile] WHERE KeyValue = @CustomerId AND OptionName = 'CUSTOMER'";

                    conn.Query(sqlQuery, param);
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_003, "Delete CustomerAttachFile unsucessfull");
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public List<GroupCompany> GetListGroupCompany()
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();

                    string sqlQuery = @"SELECT t.* FROM [list].[GroupCompany] t with(nolock) WHERE t.IsActive = 1 ORDER BY t.CreatedDate ";

                    var listResult = conn.QueryMultiple(sqlQuery, param);

                    return listResult.Read<GroupCompany>().ToList();
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return null;
            }
        }

        #region Private methods

        private bool CheckExistCustomerCode(string CustomerCode)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    int count = 0;
                    count = db.Customer.Where(m => m.CustomerCode == CustomerCode).Count();
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


        private bool CheckIssue(string functionID, List<Permission> lst)
        {
            foreach (Permission item in lst)
            {
                if (item.FunctionId == functionID)
                    return true;
            }
            return false;
        }

        #endregion
    }
}