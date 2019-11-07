using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SimERP.Business;
using SimERP.Business.Businesses.Voucher.Sale;
using SimERP.Business.Interfaces.Voucher.Sale;
using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Business.Models.Voucher.Sale;
using SimERP.Business.Utils;
using SimERP.Data;

namespace SimERP.Controllers
{
    public class SaleController : BaseController
    {
        #region Variabales
        private IHttpContextAccessor httpContextAccessor { get; }
        private readonly ISaleInvoice saleInvoiceBO;
        private readonly ISaleInvoiceDetail saleInvoiceDetailBO;
        #endregion

        #region Contructor
        public SaleController(IHttpContextAccessor httpContextAccessor, IMapper mapper) : base(httpContextAccessor, mapper)
        {
            this.ControllerName = "sale";
            this.httpContextAccessor = httpContextAccessor;
            this.saleInvoiceBO = this.saleInvoiceBO ?? new SaleInvoiceBO();
            this.saleInvoiceDetailBO = this.saleInvoiceDetailBO ?? new SaleInvoiceDetailBO();
        }
        #endregion

        #region Sale Invoice
        [HttpGet]
        [Route("api/sale/saleInvoiceinitial")]
        public ResponeResult SaleInvoiceInitial([FromBody] ReqListSearch reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqData.AuthenParams.ClientUserName, reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;




                //var dataResult = unitBO.GetData(ReplaceUnicode(reqData.SearchString), reqData.StartRow, reqData.MaxRow);
                //if (dataResult != null)
                //{
                //    repData.RepData = dataResult;
                //    repData.TotalRow = this.unitBO.TotalRows;
                //}
                //else
                //    this.AddResponeError(ref repData, unitBO.getMsgCode(),
                //        unitBO.GetMessage(this.unitBO.getMsgCode(), this.LangID));

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

        #region SaleOrder
        [HttpPost]
        [Route("api/list/savesaleorder")]
        public ActionResult<ResponeResult> SaveSaleOrder([FromBody] ReqListAdd objReqListAdd)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckAuthen();
                if (repData == null || !repData.IsOk)
                    return repData;

                SaleInvoice rowData = JsonConvert.DeserializeObject<SaleInvoice>(objReqListAdd.RowData.ToString());
                if (rowData != null)
                {
                    rowData.SearchString =
                        ReplaceUnicode(rowData.SaleInvoiceCode + " " + rowData.CustomerCode + " " + rowData.CustomerName);
                    if (objReqListAdd.IsNew)
                    {
                        rowData.CreatedBy = this._session.UserID;
                    }
                    else
                    {
                        rowData.ModifyBy = this._session.UserID;
                    }

                    var dataResult = this.saleInvoiceBO.Save(rowData, objReqListAdd.IsNew);
                    if (dataResult)
                        repData.RepData = dataResult;
                    else
                        this.AddResponeError(ref repData, this.saleInvoiceBO.getMsgCode(),
                            this.saleInvoiceBO.GetMessage(this.saleInvoiceBO.getMsgCode(), this.LangID));

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

        [HttpPost]
        [Route("api/list/saleorder")]
        public ResponeResult GetSaleOrderData([FromBody] ReqListSearch objReqListSearch)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckAuthen();
                if (repData == null || !repData.IsOk)
                    return repData;

                objReqListSearch.SearchString = ReplaceUnicode(objReqListSearch.SearchString);
                var dataResult = this.saleInvoiceBO.GetData(objReqListSearch);
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.saleInvoiceBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, saleInvoiceBO.getMsgCode(),
                        saleInvoiceBO.GetMessage(this.saleInvoiceBO.getMsgCode(), this.LangID));

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
        [Route("api/list/getsaleorderinfo")]
        public ResponeResult GettSaleOrderInfo([FromBody] ReqListSearch objReqListSearch)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckAuthen();
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = this.saleInvoiceBO.GetInfo(objReqListSearch);

                if (dataResult != null)
                {
                    var rowData = dataResult;

                    #region Load info List AttachFile
                    ReqListSearch reqListSearch = new ReqListSearch();
                    reqListSearch.SearchString = Convert.ToString(rowData.SaleInvoiceId);
                    var lstSaleInvoiceDetails = this.saleInvoiceDetailBO.GetData(reqListSearch);
                    rowData.ListSaleOrderDetail = lstSaleInvoiceDetails;
                    #endregion
                   
                    repData.RepData = rowData;
                }
                else
                    this.AddResponeError(ref repData, saleInvoiceBO.getMsgCode(),
                        saleInvoiceBO.GetMessage(this.saleInvoiceBO.getMsgCode(), this.LangID));

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
        [Route("api/list/deletesaleorder")]
        public ActionResult<ResponeResult> DeleteVendor([FromBody] ReqListDelete objReqListDelete)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(objReqListDelete.AuthenParams,
                    objReqListDelete.AuthenParams.ClientUserName, objReqListDelete.AuthenParams.ClientPassword,
                    objReqListDelete.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = this.saleInvoiceBO.DeleteSaleInvoice(Convert.ToInt32(objReqListDelete.ID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, this.saleInvoiceBO.getMsgCode(),
                        this.saleInvoiceBO.GetMessage(this.saleInvoiceBO.getMsgCode(), this.LangID));

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