using System;
using System.Collections.Generic;
using SimERP.Business.Models.RequestData;
using SimERP.Data.DBEntities;

namespace SimERP.Business.Models.MasterData.ListDTO
{
    #region Basic Param

    [Serializable]
    public class ReqListSearch
    {
        public AuthenParams AuthenParams { get; set; } = new AuthenParams();
        public string SearchString { get; set; }
        public bool? IsActive { get; set; } = null;
        public int StartRow { get; set; } = 0;
        public int MaxRow { get; set; } = 20;
        public Dictionary<string, dynamic> AddtionParams { get; set; }
    }

    public class ReqListAdd
    {
        public AuthenParams AuthenParams { get; set; } = new AuthenParams();
        public dynamic RowData { get; set; }
        public bool IsNew { get; set; }
    }

    public class ReqListDelete
    {
        public AuthenParams AuthenParams { get; set; } = new AuthenParams();
        public dynamic ID { get; set; }
    }

    public class ReqListUpdateSortOrder
    {
        public AuthenParams AuthenParams { get; set; } = new AuthenParams();
        public dynamic UpID { get; set; }
        public dynamic DownID { get; set; }
    }

    #endregion

    public class Tax : Data.DBEntities.Tax
    {
        public string UserName { get; set; }
    }

    public class Unit : Data.DBEntities.Unit
    {
        public string UserName { get; set; }
    }

    public class VendorType : Data.DBEntities.VendorType
    {
        public string UserName { get; set; }
    }

    public class PageList : Data.DBEntities.Page
    {
        public string ModuleName { get; set; }
        public List<Function> lstFunction { get; set; }
    }

    public class Function : Data.DBEntities.Function
    {
        public bool IsCheck { get; set; }
    }

    public class ProductCategory : Data.DBEntities.ProductCategory
    {
        public string CreateName { get; set; }
    }

    public class Customer : Data.DBEntities.Customer
    {
        public string CreateName { get; set; }
    }

    public class TaxSearchParams
    {
        public AuthenParams authenParams { get; set; }
        public string searchString { get; set; }
        public int startRow { get; set; } = 0;
        public int maxRow { get; set; } = 10;
    }

    public class DelTaxParams
    {
        public AuthenParams authenParams { get; set; }
        public int id { get; set; }
    }

    public class AddTaxParams
    {
        public AuthenParams authenParams { get; set; }
        public Tax tax { get; set; }
        public bool isNew { get; set; }
    }

    public partial class Product : Data.DBEntities.Product
    {
        public List<AttachFile> ListAttachFile { get; set; }
        public List<AttachFile> ListAttachFileDelete { get; set; }
        public string UnitName { get; set; }
        public string PackageUnitName { get; set; }
        public string ProductCategoryName { get; set; }
        public string CountryName { get; set; }
        public string VendorName { get; set; }
    }

    public class AttachFile : Data.DBEntities.AttachFile
    {
        public bool IsChange { get; set; } = true;//default has change
        public bool IsNew { get; set; }
    }
}