using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SimERP.Business;
using SimERP.Business.Utils;
using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using SimERP.Business.Interfaces.List;
using SimERP.Business.Models.System;
using SimERP.Data.DBEntities;
using SimERP.Utils;
using Tax = SimERP.Business.Models.MasterData.ListDTO.Tax;
using Unit = SimERP.Business.Models.MasterData.ListDTO.Unit;
using VendorType = SimERP.Business.Models.MasterData.ListDTO.VendorType;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.EntityFrameworkCore.Internal;
using SimERP.Business.Businesses.List;
using SimERP.Business.Models.MasterData.ListDTO;
using AttachFile = SimERP.Business.Models.MasterData.ListDTO.AttachFile;
using Function = SimERP.Business.Models.MasterData.ListDTO.Function;
using Product = SimERP.Business.Models.MasterData.ListDTO.Product;
using ProductCategory = SimERP.Business.Models.MasterData.ListDTO.ProductCategory;

namespace SimERP.Controllers
{
    public partial class ListController : BaseController
    {
        #region Variables
        private IHttpContextAccessor httpContextAccessor { get; }
        private ITax taxBO;
        private IUnit unitBO;
        private IVendorType vendortypeBO;
        private ICustomerType customerTypeBO;
        private IPageList pageListBO;
        private ICountry countryBO;
        private IPackageUnit packageUnitBO;
        private IProduct productBO;
        private IProductCategory productcategoryBO;
        private IAttachFile attachFileBO;
        private ICustomer customerBO;


        #endregion Variables

        #region Contructor
        public ListController(IHttpContextAccessor httpContextAccessor, IMapper mapper) : base(httpContextAccessor, mapper)
        {
            this.ControllerName = "List";
            this.httpContextAccessor = httpContextAccessor;
            this.taxBO = this.taxBO ?? new TaxBO();
            this.unitBO = this.unitBO ?? new UnitBO();
            this.customerTypeBO = this.customerTypeBO ?? new CustomerTypeBO();
            this.vendortypeBO = this.vendortypeBO ?? new VendorTypeBO();
            this.pageListBO = this.pageListBO ?? new PageListBO();
            this.countryBO = this.countryBO ?? new CountryBO();
            this.packageUnitBO = this.packageUnitBO ?? new PackageUnitBO();
            this.productBO = this.productBO ?? new ProductBO();
            this.productcategoryBO = this.productcategoryBO ?? new ProductCategoryBO();
            this.attachFileBO = this.attachFileBO ?? new AttachFileBO();
            this.customerBO = this.customerBO ?? new CustomerBO();
        }
        #endregion Contructor

        #region Tax

        [HttpPost]
        [Route("api/list/tax")]
        public ResponeResult GetTaxData([FromBody] ReqListSearch objReqListSearch)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(objReqListSearch.AuthenParams,
                    objReqListSearch.AuthenParams.ClientUserName, objReqListSearch.AuthenParams.ClientPassword,
                    objReqListSearch.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = taxBO.GetData(ReplaceUnicode(objReqListSearch.SearchString), objReqListSearch.StartRow,
                    objReqListSearch.MaxRow);
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.taxBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, taxBO.getMsgCode(),
                        taxBO.GetMessage(this.taxBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [HttpPost]
        [Route("api/list/savetax")]
        public ActionResult<ResponeResult> SaveTax([FromBody] ReqListAdd objReqListAdd)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(objReqListAdd.AuthenParams, objReqListAdd.AuthenParams.ClientUserName,
                    objReqListAdd.AuthenParams.ClientPassword, objReqListAdd.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                Tax taxData = JsonConvert.DeserializeObject<Tax>(objReqListAdd.RowData.ToString());
                if (objReqListAdd.IsNew)
                {
                    taxData.CreatedBy = this._session.UserID;
                }
                else
                {
                    taxData.ModifyBy = this._session.UserID;
                }
                var dataResult = taxBO.Save(taxData, objReqListAdd.IsNew);
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, taxBO.getMsgCode(),
                        taxBO.GetMessage(this.taxBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [HttpPost]
        [Route("api/list/deletetax")]
        public ActionResult<ResponeResult> DeleteTax([FromBody] ReqListDelete objReqListDelete)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(objReqListDelete.AuthenParams,
                    objReqListDelete.AuthenParams.ClientUserName, objReqListDelete.AuthenParams.ClientPassword,
                    objReqListDelete.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = taxBO.DeleteTax(Convert.ToInt32(objReqListDelete.ID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, taxBO.getMsgCode(),
                        taxBO.GetMessage(this.taxBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [HttpPost]
        [Route("api/list/updateSortOrderTax")]
        public ActionResult<ResponeResult> UpdateSortOrderTax([FromBody] ReqListUpdateSortOrder reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = taxBO.UpdateSortOrder(Convert.ToInt32(reqData.UpID), Convert.ToInt32(reqData.DownID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, unitBO.getMsgCode(),
                        unitBO.GetMessage(this.unitBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        #endregion Tax

        #region Unit

        [HttpPost]
        [Route("api/list/unit")]
        public ResponeResult GetUnitData([FromBody] ReqListSearch reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = unitBO.GetData(ReplaceUnicode(reqData.SearchString), reqData.StartRow, reqData.MaxRow);
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.unitBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, unitBO.getMsgCode(),
                        unitBO.GetMessage(this.unitBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [HttpPost]
        [Route("api/list/saveunit")]
        public ActionResult<ResponeResult> SaveUnit([FromBody] ReqListAdd reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                reqData.RowData.CreatedDate = DateTimeOffset.Now;
                reqData.RowData.ModifyDate = DateTimeOffset.Now;
                var dataResult = unitBO.Save(JsonConvert.DeserializeObject<Unit>(reqData.RowData.ToString()),
                    reqData.IsNew);
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, unitBO.getMsgCode(),
                        unitBO.GetMessage(this.unitBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [HttpPost]
        [Route("api/list/deleteunit")]
        public ActionResult<ResponeResult> DeleteUnit([FromBody] ReqListDelete reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = unitBO.DeleteUnit(Convert.ToInt32(reqData.ID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, unitBO.getMsgCode(),
                        unitBO.GetMessage(this.unitBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [HttpPost]
        [Route("api/list/updateSortOrderUnit")]
        public ActionResult<ResponeResult> UpdateSortOrderUnit([FromBody] ReqListUpdateSortOrder reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = unitBO.UpdateSortOrder(Convert.ToInt32(reqData.UpID), Convert.ToInt32(reqData.DownID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, unitBO.getMsgCode(),
                        unitBO.GetMessage(this.unitBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        #endregion Unit

        #region VendorType

        [HttpPost]
        [Route("api/list/vendortype")]
        public ResponeResult GetVendorTypeData([FromBody] ReqListSearch reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = vendortypeBO.GetData(ReplaceUnicode(reqData.SearchString), reqData.IsActive,
                    reqData.StartRow, reqData.MaxRow);
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.vendortypeBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, vendortypeBO.getMsgCode(),
                        vendortypeBO.GetMessage(this.vendortypeBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [HttpPost]
        [Route("api/list/savevendortype")]
        public ActionResult<ResponeResult> SaveVendorType([FromBody] ReqListAdd reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                reqData.RowData.CreatedDate = DateTimeOffset.Now;
                reqData.RowData.ModifyDate = DateTimeOffset.Now;
                var dataResult =
                    vendortypeBO.Save(JsonConvert.DeserializeObject<VendorType>(reqData.RowData.ToString()),
                        reqData.IsNew);
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, vendortypeBO.getMsgCode(),
                        vendortypeBO.GetMessage(this.vendortypeBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [HttpPost]
        [Route("api/list/deletevendortype")]
        public ActionResult<ResponeResult> DeleteVendorType([FromBody] ReqListDelete reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = vendortypeBO.DeleteVendorType(Convert.ToInt32(reqData.ID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, vendortypeBO.getMsgCode(),
                        vendortypeBO.GetMessage(this.vendortypeBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [HttpPost]
        [Route("api/list/updateSortOrderVendorType")]
        public ActionResult<ResponeResult> UpdateSortOrderVendorType([FromBody] ReqListUpdateSortOrder reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult =
                    vendortypeBO.UpdateSortOrder(Convert.ToInt32(reqData.UpID), Convert.ToInt32(reqData.DownID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, vendortypeBO.getMsgCode(),
                        vendortypeBO.GetMessage(this.vendortypeBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        #endregion

        #region CustomerType
        /// <summary>
        /// Lấy danh sách loại khách hàng
        /// </summary>
        /// <param name="objReqListSearch">Params tìm kiếm theo chuẩn hệ thống</param>
        /// <returns>Danh sách loại khách hàng kiểu json</returns>
        [Authorize]
        [HttpPost]
        [Route("api/list/customertype")]
        public ResponeResult GetCustomerTypeData([FromBody] ReqListSearch objReqListSearch)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckAuthen();
                if (repData == null || !repData.IsOk)
                    return repData;

                objReqListSearch.SearchString = ReplaceUnicode(objReqListSearch.SearchString);
                var dataResult = this.customerTypeBO.GetData(objReqListSearch);
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.customerTypeBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, customerTypeBO.getMsgCode(),
                        customerTypeBO.GetMessage(this.customerTypeBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }
        [Authorize]
        [HttpPost]
        [Route("api/list/savecustomertype")]
        public ActionResult<ResponeResult> SaveCustomerType([FromBody] ReqListAdd objReqListAdd)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckAuthen();
                if (repData == null || !repData.IsOk)
                    return repData;

                CustomerType cusTypeData = JsonConvert.DeserializeObject<CustomerType>(objReqListAdd.RowData.ToString());
                if (cusTypeData != null)
                {
                    cusTypeData.SearchString =
                        ReplaceUnicode(cusTypeData.CustomerTypeCode + " " + cusTypeData.CustomerTypeName);
                    if (objReqListAdd.IsNew)
                    {
                        cusTypeData.CreatedBy = this._session.UserID;
                    }
                    else
                    {
                        cusTypeData.ModifyBy = this._session.UserID;
                    }

                    var dataResult = this.customerTypeBO.Save(cusTypeData, objReqListAdd.IsNew);
                    if (dataResult)
                        repData.RepData = dataResult;
                    else
                        this.AddResponeError(ref repData, this.customerTypeBO.getMsgCode(),
                            this.customerTypeBO.GetMessage(this.customerTypeBO.getMsgCode(), this.LangID));

                    return repData;
                }
                else
                {
                    this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                        MsgCodeConst.Msg_RequestDataInvalidText, "Lỗi tham số gọi API", null);
                    Logger.Error("EXCEPTION-CALL API", new Exception("Lỗi tham số gọi API"));
                    return this.responeResult;
                }
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }
        [Authorize]
        [HttpPost]
        [Route("api/list/deletecustomertype")]
        public ActionResult<ResponeResult> DeleteCustomerType([FromBody] ReqListDelete objReqListDelete)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(objReqListDelete.AuthenParams,
                    objReqListDelete.AuthenParams.ClientUserName, objReqListDelete.AuthenParams.ClientPassword,
                    objReqListDelete.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = this.customerTypeBO.DeleteCustomerType(Convert.ToInt32(objReqListDelete.ID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, this.customerTypeBO.getMsgCode(),
                        this.customerTypeBO.GetMessage(this.customerTypeBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }
        [Authorize]
        [HttpPost]
        [Route("api/list/updateSortOrderCustomerType")]
        public ActionResult<ResponeResult> UpdateSortOrderCustomerType([FromBody] ReqListUpdateSortOrder reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult =
                    this.customerTypeBO.UpdateSortOrder(Convert.ToInt32(reqData.UpID), Convert.ToInt32(reqData.DownID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, customerTypeBO.getMsgCode(),
                        customerTypeBO.GetMessage(this.customerTypeBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }
        #endregion

        #region PageList

        [Authorize]
        [HttpPost]
        [Route("api/list/pagelist")]
        public ResponeResult GetPageListData([FromBody] JObject reqData)
        {
            ReqListSearch reqSerach = new ReqListSearch();
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqSerach.AuthenParams.ClientUserName, reqSerach.AuthenParams.ClientPassword, "");
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = pageListBO.GetData(ReplaceUnicode(reqData["dataserach"]["SearchString"].ToString()),
                    reqData["moduleID"].ToString() == "" ? (int?)null : Convert.ToInt32(reqData["moduleID"].ToString()),
                    reqData["dataserach"]["IsActive"].ToString() == "" ? (bool?)null : Convert.ToBoolean(reqData["dataserach"]["IsActive"].ToString()),
                    Convert.ToInt32(reqData["dataserach"]["StartRow"].ToString()), Convert.ToInt32(reqData["dataserach"]["MaxRow"].ToString()));
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.pageListBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, pageListBO.getMsgCode(),
                        pageListBO.GetMessage(this.pageListBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/savepagelist")]
        public ActionResult<ResponeResult> SavePageList([FromBody] ReqListAdd reqData)
        {
            try
            {
                int pageID = -1;
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                if (reqData.IsNew)
                    reqData.RowData.CreatedDate = DateTimeOffset.Now;
                else
                    reqData.RowData.ModifyDate = DateTimeOffset.Now;

                var dataResult = pageListBO.Save(JsonConvert.DeserializeObject<Page>(reqData.RowData.ToString()), reqData.IsNew, ref pageID);

                //---save list page function
                if (pageID != -1)
                {
                    if (!reqData.IsNew)
                    {
                        pageListBO.DeleteListPagePermission(pageID);
                    }

                    PageList pageList = JsonConvert.DeserializeObject<PageList>(reqData.RowData.ToString());
                    foreach (Function item in pageList.lstFunction)
                    {
                        if (item.IsCheck)
                            dataResult = pageListBO.SaveListPageFunction(pageID, item.FunctionId);
                    }
                }

                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, pageListBO.getMsgCode(),
                        pageListBO.GetMessage(this.pageListBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/deletepagelist")]
        public ActionResult<ResponeResult> DeletePageList([FromBody] ReqListDelete reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = pageListBO.DeletePageList(Convert.ToInt32(reqData.ID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, pageListBO.getMsgCode(),
                        pageListBO.GetMessage(this.pageListBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/updateSortOrderPageList")]
        public ActionResult<ResponeResult> UpdateSortOrderPageList([FromBody] ReqListUpdateSortOrder reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult =
                    pageListBO.UpdateSortOrder(Convert.ToInt32(reqData.UpID), Convert.ToInt32(reqData.DownID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, pageListBO.getMsgCode(),
                        pageListBO.GetMessage(this.pageListBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/getlistmodule")]
        public ResponeResult GetListModule([FromBody] ReqListSearch reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = pageListBO.GetListModule();
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.vendortypeBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, vendortypeBO.getMsgCode(),
                        vendortypeBO.GetMessage(this.vendortypeBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/getlistfunction")]
        public ResponeResult GetListFunction([FromBody] ReqListSearch reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = pageListBO.GetListFunction();
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.vendortypeBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, vendortypeBO.getMsgCode(),
                        vendortypeBO.GetMessage(this.vendortypeBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }
        #endregion

        #region Country

        [HttpPost]
        [Route("api/list/country")]
        public ResponeResult GetCountryData([FromBody] ReqListSearch objReqListSearch)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(objReqListSearch.AuthenParams,
                    objReqListSearch.AuthenParams.ClientUserName, objReqListSearch.AuthenParams.ClientPassword,
                    objReqListSearch.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = countryBO.GetData(objReqListSearch);
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.countryBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, countryBO.getMsgCode(),
                        countryBO.GetMessage(this.countryBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }
        #endregion

        #region PackageUnit

        [HttpPost]
        [Route("api/list/packageunit")]
        public ResponeResult GetPackageUnitData([FromBody] ReqListSearch objReqListSearch)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(objReqListSearch.AuthenParams,
                    objReqListSearch.AuthenParams.ClientUserName, objReqListSearch.AuthenParams.ClientPassword,
                    objReqListSearch.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = packageUnitBO.GetData(objReqListSearch);
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.packageUnitBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, packageUnitBO.getMsgCode(),
                        packageUnitBO.GetMessage(this.packageUnitBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        #endregion

        #region Product
        [Authorize]
        [HttpPost]
        [Route("api/list/saveproduct")]
        public async System.Threading.Tasks.Task<ActionResult<ResponeResult>> SaveProductAsync()
        {
            ReqListAdd objReqListAdd = null;
            try
            {
                //Check security & data request
                var repData = this.CheckAuthen();
                if (repData == null || !repData.IsOk)
                    return repData;

                if (Request.HasFormContentType)
                {
                    if (Request.Form.ContainsKey("formData"))
                    {
                        var form = await Request.ReadFormAsync();
                        string formData = form["formData"];
                        objReqListAdd = JsonConvert.DeserializeObject<ReqListAdd>(formData);
                    }
                }

                if (objReqListAdd == null)
                {
                    return new ResponeResult() { IsOk = false, MessageText = "Lỗi parse tham số!" };
                }

                Product product = JsonConvert.DeserializeObject<Product>(objReqListAdd.RowData.ToString());
                if (product != null)
                {
                    product.SearchString =
                        ReplaceUnicode(product.ProductName + " " + product.ProductCode);
                    if (objReqListAdd.IsNew)
                    {
                        product.CreatedBy = this._session.UserID;
                    }
                    else
                    {
                        product.ModifyBy = this._session.UserID;
                    }

                    // action upload attach file 
                    var rslUpload = new UploadController(httpContextAccessor, mapper).UploadFile(Request.Form.Files);
                    var mapPath = (Dictionary<string, AttachFile>)rslUpload.Result.RepData;
                    if (mapPath != null && mapPath.Count > 0)
                    {
                        foreach (string mapPathKey in mapPath.Keys)
                        {
                            string fileName = mapPathKey;
                            var attachFile = product.ListAttachFile.SingleOrDefault(x => x.FileNameOriginal.Equals(fileName));
                            if (attachFile != null)
                            {
                                // get data uploaded
                                var mapPathValue = mapPath[fileName];

                                // assign new value 
                                attachFile.FileName = mapPathValue.FileName;
                                attachFile.FileNameOriginal = mapPathValue.FileNameOriginal;
                                attachFile.FilePath = mapPathValue.FilePath;
                            }
                        }
                    }

                    var dataResult = this.productBO.Save(product, objReqListAdd.IsNew);

                    if (dataResult)
                        repData.RepData = dataResult;
                    else
                        this.AddResponeError(ref repData, this.productBO.getMsgCode(),
                            this.productBO.GetMessage(this.productBO.getMsgCode(), this.LangID));

                    return repData;
                }
                else
                {
                    this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                        MsgCodeConst.Msg_RequestDataInvalidText, "Lỗi tham số gọi API", null);
                    Logger.Error("EXCEPTION-CALL API", new Exception("Lỗi tham số gọi API"));
                    return this.responeResult;
                }
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/product")]
        public ResponeResult GetProductData([FromBody] ReqListSearch objReqListSearch)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckAuthen();
                if (repData == null || !repData.IsOk)
                    return repData;

                objReqListSearch.SearchString = ReplaceUnicode(objReqListSearch.SearchString);
                var dataResult = this.productBO.GetData(objReqListSearch);
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.productBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, productBO.getMsgCode(),
                        productBO.GetMessage(this.productBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/getproductinfo")]
        public ResponeResult GetProductInfo([FromBody] ReqListSearch objReqListSearch)
        {
            Product product = null;
            try
            {
                //Check security & data request
                var repData = this.CheckAuthen();
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = this.productBO.GetInfo(objReqListSearch);

                if (dataResult != null)
                {
                    product = this.mapper.Map<Product>(dataResult);

                    ReqListSearch reqListSearch = new ReqListSearch();
                    reqListSearch.AddtionParams = new Dictionary<string, dynamic>();
                    reqListSearch.AddtionParams.Add("KeyValue", product.ProductId);
                    reqListSearch.AddtionParams.Add("OptionName", "PRODUCT");

                    var lstAttachFile = this.attachFileBO.GetData(reqListSearch);

                    product.ListAttachFile = lstAttachFile;
                    repData.RepData = product;
                }
                else
                    this.AddResponeError(ref repData, productBO.getMsgCode(),
                        productBO.GetMessage(this.productBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        #endregion

        #region ProductCategory

        [Authorize]
        [HttpPost]
        [Route("api/list/productcategory")]
        public ResponeResult GetProductCategoryData([FromBody] ReqListSearch reqData)
        {
            ReqListSearch reqSerach = new ReqListSearch();
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = productcategoryBO.GetData(ReplaceUnicode(reqData.SearchString), reqData.IsActive, reqData.StartRow, reqData.MaxRow);
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.productcategoryBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, productcategoryBO.getMsgCode(),
                        productcategoryBO.GetMessage(this.productcategoryBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        class TreeProductCategory
        {
            public ProductCategory productCategory { get; set; }
            public List<ProductCategory> lstProductCategories { get; set; }
        }

        private void GetTreeData(List<ProductCategory> lstSource, ref List<TreeProductCategory> lstRsl)
        {
            foreach (var productCategory in lstSource)
            {
                TreeProductCategory treeProductCategory = new TreeProductCategory();
                treeProductCategory.productCategory = productCategory;
                if (productCategory.ParentId == null)
                {
                    var lstChild = lstSource.FindAll(x => x.ParentId == productCategory.ProductCategoryId);
                    treeProductCategory.lstProductCategories = lstChild;
                    lstRsl.Add(treeProductCategory);
                    GetTreeData(lstChild, ref lstRsl);
                    foreach (var child in lstChild)
                    {
                        TreeProductCategory treeProductCategory2 = new TreeProductCategory();
                        treeProductCategory2.productCategory = child;
                        var lstChild2 = lstSource.FindAll(y => y.ParentId.Equals(child.ProductCategoryId));
                        if (lstChild2.Count > 0)
                        {
                            treeProductCategory2.lstProductCategories = lstChild2;
                            lstRsl.Add(treeProductCategory2);
                            GetTreeData(lstChild2, ref lstRsl);
                        }

                    }
                }
                else
                {
                    var lstChild = lstSource.FindAll(x => x.ParentId == productCategory.ParentId);
                }
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/saveproductcategory")]
        public ActionResult<ResponeResult> SaveProductCategory([FromBody] ReqListAdd reqData)
        {
            try
            {
                int pageID = -1;
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                if (reqData.IsNew)
                    reqData.RowData.CreatedDate = DateTimeOffset.Now;
                else
                    reqData.RowData.ModifyDate = DateTimeOffset.Now;

                var dataResult = productcategoryBO.Save(JsonConvert.DeserializeObject<Data.DBEntities.ProductCategory>(reqData.RowData.ToString()), reqData.IsNew);

                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, productcategoryBO.getMsgCode(),
                        productcategoryBO.GetMessage(this.productcategoryBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/deleteproductcategory")]
        public ActionResult<ResponeResult> DeleteProductCategory([FromBody] ReqListDelete reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = productcategoryBO.Delete(Guid.Parse(reqData.ID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, productcategoryBO.getMsgCode(),
                        productcategoryBO.GetMessage(this.productcategoryBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/updateSortOrderProductCategory")]
        public ActionResult<ResponeResult> UpdateSortOrderProductCategory([FromBody] ReqListUpdateSortOrder reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult =
                    productcategoryBO.UpdateSortOrder(Guid.Parse(reqData.UpID), Guid.Parse(reqData.DownID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, productcategoryBO.getMsgCode(),
                        productcategoryBO.GetMessage(this.productcategoryBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/getalltproductcategory")]
        public ResponeResult GetAllProductCategoryData([FromBody] ReqListSearch reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = productcategoryBO.GetAllData();
                if (dataResult != null)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, productcategoryBO.getMsgCode(),
                        productcategoryBO.GetMessage(this.productcategoryBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }
        #endregion

        #region Customer

        [Authorize]
        [HttpPost]
        [Route("api/list/customer")]
        public ResponeResult GetCustomerData([FromBody] JObject reqData)
        {
            ReqListSearch reqSerach = new ReqListSearch();
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqSerach.AuthenParams.ClientUserName, reqSerach.AuthenParams.ClientPassword, "");
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = customerBO.GetData(ReplaceUnicode(reqData["dataserach"]["SearchString"].ToString()),
                    reqData["customertypeID"].ToString() == "" ? (int?)null : Convert.ToInt32(reqData["customertypeID"].ToString()),
                    reqData["dataserach"]["IsActive"].ToString() == "" ? (bool?)null : Convert.ToBoolean(reqData["dataserach"]["IsActive"].ToString()),
                    Convert.ToInt32(reqData["dataserach"]["StartRow"].ToString()), Convert.ToInt32(reqData["dataserach"]["MaxRow"].ToString()));
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.customerBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, customerBO.getMsgCode(),
                        customerBO.GetMessage(this.customerBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/savepagelist")]
        public ActionResult<ResponeResult> SaveCustomer([FromBody] ReqListAdd reqData)
        {
            try
            {
                int pageID = -1;
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                if (reqData.IsNew)
                    reqData.RowData.CreatedDate = DateTimeOffset.Now;
                else
                    reqData.RowData.ModifyDate = DateTimeOffset.Now;

                var dataResult = customerBO.Save(JsonConvert.DeserializeObject<Data.DBEntities.Customer>(reqData.RowData.ToString()), reqData.IsNew);


                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, customerBO.getMsgCode(),
                        customerBO.GetMessage(this.customerBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/deletecustomer")]
        public ActionResult<ResponeResult> DeleteCustomer([FromBody] ReqListDelete reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = customerBO.Delete((long)reqData.ID);
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, customerBO.getMsgCode(),
                        customerBO.GetMessage(this.customerBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/list/updateSortOrderCustomer")]
        public ActionResult<ResponeResult> UpdateSortOrderCustomer([FromBody] ReqListUpdateSortOrder reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult =
                    customerBO.UpdateSortOrder((long)reqData.UpID, (long)reqData.DownID);
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, customerBO.getMsgCode(),
                        customerBO.GetMessage(this.customerBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        #endregion
    }
}