using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SimERP.Business;
using SimERP.Business.Businesses.User;
using SimERP.Business.Interfaces.User;
using SimERP.Business.Models.System;
using SimERP.Business.Utils;
using SimERP.Data.DBEntities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Utils;

namespace SimERP.Controllers
{
    public class UserController : BaseController
    {
        #region Variables

        private IUser userBO;
        private IFiscal fiscalBO;
        private ITokenRefresh tokenRefreshBO;
        private IUserPermission userpermissionBO;

        #endregion Variables

        #region Contructor

        public UserController(IHttpContextAccessor httpContextAccessor, IMapper mapper) : base(httpContextAccessor, mapper)
        {
            this.ControllerName = "User";
            this.userBO = this.userBO ?? new UserBO();
            this.fiscalBO = this.fiscalBO ?? new FiscalBO();
            this.tokenRefreshBO = this.tokenRefreshBO ?? new TokenRefreshBO();
            this.userpermissionBO = this.userpermissionBO ?? new UserPermissionBO();
        }

        #endregion Contructor

        #region API Methods

        [AllowAnonymous]
        [HttpPost]
        [Route("api/loginsystem")]
        public ResponeResult Login([FromBody] LoginModel loginModel)
        {
            try
            {
                responeResult = new ResponeResult();
                if (loginModel == null)
                {
                    AddResponeError(ref responeResult, "", "Thông tin không hợp lệ! Vui lòng kiểm tra lại!");
                    return responeResult;
                }

                var dataResult = this.userBO.Login(loginModel.UserName, loginModel.Password);
                if (dataResult != null)
                {
                    if (dataResult.UserId > 0)
                    {
                        var ListPermissionUser = userBO.GetListPermission(dataResult.UserId);
                        // Prepare info for create Access Token
                        var tokeOptions = this.GenerateTokenOption(dataResult);

                        // Prepare info for create Refresh Token
                        TokenRefresh tokenRefresh = this.GenerateTokenRefresh(loginModel.UserName);

                        // Determite is create new or update refresh token
                        bool isNewRefreshToken = string.IsNullOrEmpty(tokenRefresh.Id);

                        // Get user data to push into Session
                        _session = this.GetSession(dataResult.UserId);
                        HttpContext.Session.Set(Utils.Constant.SESSION_NAME, ToByteArray<Utils.Session>(_session));

                        // Create Access Token
                        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);

                        // Save a token & refreshtoken into session object
                        HttpContext.Session.SetString(Utils.Constant.ACCESSTOKEN, tokenString);
                        HttpContext.Session.SetString(Utils.Constant.REFRESHTOKEN, tokenRefresh.Refreshtoken);

                        // Return a brief user info for client
                        responeResult.RepData = new object[] { dataResult, ListPermissionUser };
                        this.tokenRefreshBO.Save(tokenRefresh, isNewRefreshToken);
                    }
                    else
                    {
                        AddResponeError(ref responeResult, "", "Tên đăng nhập hoặc mật khẩu không chính xác!");
                    }
                }
                else
                    responeResult = new ResponeResult
                    { IsOk = false, MessageText = "Tên đăng nhập hoặc mật khẩu không chính xác!" };

                return responeResult;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid,
                    MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [AllowAnonymous]
        [Route("api/logout")]
        [HttpPost]
        public ResponeResult Logout()
        {
            try
            {
                ResponeResult repData = new ResponeResult() { IsOk = true };
                HttpContext.Session.Clear();
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

        [AllowAnonymous]
        [HttpPost("api/refreshtoken")]
        public ResponeResult RefreshToken()
        {
            try
            {
                ResponeResult repData = new ResponeResult();
                // Get refresh token from Session of Server
                string refreshToken = HttpContext.Session.GetString(Utils.Constant.REFRESHTOKEN);

                // Session not existed
                if (string.IsNullOrEmpty(refreshToken))
                {
                    return new ResponeResult { IsOk = false, MessageText = "Phiên yêu cầu không hợp lệ!" };
                }

                // Get user info by UserId
                UserResDTO userRes = this.userBO.GetInfo(this._session.UserID);

                // Get Token Refresh Info from DB 
                TokenRefresh tokenRefresh = this.GenerateTokenRefresh(userRes.UserName);

                if (userRes.UserId > 0)
                {
                    // Generate Token Options
                    var tokeOptions = this.GenerateTokenOption(userRes);
                    // Update record Token Refresh into DB
                    this.tokenRefreshBO.Save(tokenRefresh, false);
                    // Generate new access token
                    var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                    repData.RepData = userRes;
                    // Save a token & refreshtoken into session object
                    HttpContext.Session.SetString(Utils.Constant.ACCESSTOKEN, tokenString);
                    HttpContext.Session.SetString(Utils.Constant.REFRESHTOKEN, tokenRefresh.Refreshtoken);
                }
                else
                {
                    return new ResponeResult { IsOk = false, MessageText = "Người dùng không tồn tại!" };
                }

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
        [Route("api/changepassword")]
        public ResponeResult ChangePasswordModel([FromBody] JObject changePasswordModel)
        {
            var repData = new ResponeResult();
            try
            {
                repData = this.CheckAuthen();
                if (repData == null || !repData.IsOk || repData.RepData == null)
                    return repData;
                var dataResult = userBO.ChangePassword((repData.RepData as UserResDTO).UserId, Convert.ToString(changePasswordModel["currentPassword"]), Convert.ToString(changePasswordModel["newPassword"]));
                if (dataResult)
                {
                    repData.RepData = dataResult;
                }
                else
                    this.AddResponeError(ref repData, userBO.getMsgCode(),
                        userBO.GetMessage(this.userBO.getMsgCode(), this.LangID));

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
        [Authorize]
        [Route("api/user/userdata")]
        public ResponeResult GetUserData([FromBody] ReqListSearch reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = userBO.GetData(ReplaceUnicode(reqData.SearchString), reqData.IsActive, reqData.StartRow, reqData.MaxRow);
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                    repData.TotalRow = this.userBO.TotalRows;
                }
                else
                    this.AddResponeError(ref repData, userBO.getMsgCode(), userBO.GetMessage(this.userBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid, MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [HttpPost]
        [Authorize]
        [Route("api/user/saveuser")]
        public ActionResult<ResponeResult> SaveUser([FromBody] ReqListAdd reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                if (reqData.IsNew)
                    reqData.RowData.CreatedDate = DateTimeOffset.Now;
                else
                    reqData.RowData.ModifyDate = DateTimeOffset.Now;

                var dataResult = userBO.Save(JsonConvert.DeserializeObject<User>(reqData.RowData.ToString()),
                    reqData.IsNew);
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, userBO.getMsgCode(),
                        userBO.GetMessage(this.userBO.getMsgCode(), this.LangID));

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
        [Authorize]
        [Route("api/user/deleteuser")]
        public ActionResult<ResponeResult> DeleteUser([FromBody] ReqListDelete reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = userBO.DeleteUser(Convert.ToInt32(reqData.ID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, userBO.getMsgCode(),
                        userBO.GetMessage(this.userBO.getMsgCode(), this.LangID));

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
        [Authorize]
        [Route("api/user/resetPassUser")]
        public ActionResult<ResponeResult> ResetPassUser([FromBody] ReqListDelete reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData.AuthenParams, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;

                var dataResult = userBO.ResetPassUser(Convert.ToInt32(reqData.ID));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, userBO.getMsgCode(),
                        userBO.GetMessage(this.userBO.getMsgCode(), this.LangID));

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
        [Authorize]
        [Route("api/user/getlistuser")]
        public ResponeResult getListUser([FromBody] ReqListSearch reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = userpermissionBO.getListUser();
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                }
                else
                    this.AddResponeError(ref repData, userpermissionBO.getMsgCode(), userpermissionBO.GetMessage(this.userpermissionBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid, MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [HttpPost]
        [Authorize]
        [Route("api/user/getroleuser")]
        public ResponeResult getRoleUser([FromBody] ReqListSearch reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = userpermissionBO.getRoleUser(reqData.SearchString == null ? (int?)null : Convert.ToInt32(reqData.SearchString));
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                }
                else
                    this.AddResponeError(ref repData, userpermissionBO.getMsgCode(), userpermissionBO.GetMessage(this.userpermissionBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid, MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [HttpPost]
        [Authorize]
        [Route("api/user/getrolelist")]
        public ResponeResult getRoleList([FromBody] ReqListSearch reqData)
        {
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqData.AuthenParams.ClientUserName,
                    reqData.AuthenParams.ClientPassword, reqData.AuthenParams.Sign);
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = userpermissionBO.getRoleList(reqData.SearchString == null ? (int?)null : Convert.ToInt32(reqData.SearchString));
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                }
                else
                    this.AddResponeError(ref repData, userpermissionBO.getMsgCode(), userpermissionBO.GetMessage(this.userpermissionBO.getMsgCode(), this.LangID));

                return repData;
            }
            catch (Exception ex)
            {
                this.responeResult = this.CreateResponeResultError(MsgCodeConst.Msg_RequestDataInvalid, MsgCodeConst.Msg_RequestDataInvalidText, ex.Message, null);
                Logger.Error("EXCEPTION-CALL API", ex);
                return responeResult;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("api/user/saveuserrole")]
        public ActionResult<ResponeResult> SaveUserRole([FromBody] JObject reqData)
        {
            ReqListSearch reqSerach = new ReqListSearch();
            try
            {
                var repData = this.CheckSign(reqData, reqSerach.AuthenParams.ClientUserName, reqSerach.AuthenParams.ClientPassword, "");
                if (repData == null || !repData.IsOk || reqData["userid"] == null)
                    return repData;

                var dataResult = userpermissionBO.Save(JsonConvert.DeserializeObject<List<RoleList>>(reqData["datasave"]["RowData"].ToString()), Convert.ToInt32(reqData["userid"].ToString()));
                if (dataResult)
                    dataResult = userpermissionBO.SaveListUserPermission(reqData["lstpermission"].ToString(), Convert.ToInt32(reqData["userid"].ToString()));
                if (dataResult)
                    repData.RepData = dataResult;
                else
                    this.AddResponeError(ref repData, userpermissionBO.getMsgCode(),
                        userpermissionBO.GetMessage(this.userpermissionBO.getMsgCode(), this.LangID));

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
        [Route("api/user/loadpagelistrole")]
        public ResponeResult LoadPageListRole([FromBody] JObject reqData)
        {
            ReqListSearch reqSerach = new ReqListSearch();
            try
            {
                //Check security & data request
                var repData = this.CheckSign(reqData, reqSerach.AuthenParams.ClientUserName, reqSerach.AuthenParams.ClientPassword, "");
                if (repData == null || !repData.IsOk)
                    return repData;
                var dataResult = userpermissionBO.LoadPageListRole(reqData["moduleID"].ToString() == "" ? (int?)null : Convert.ToInt32(reqData["moduleID"].ToString()),
                    reqData["userID"].ToString() == "" ? (int?)null : Convert.ToInt32(reqData["userID"].ToString()));
                if (dataResult != null)
                {
                    repData.RepData = dataResult;
                }
                else
                    this.AddResponeError(ref repData, userpermissionBO.getMsgCode(),
                        userpermissionBO.GetMessage(this.userpermissionBO.getMsgCode(), this.LangID));

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
        #endregion API Methods

        #region Private Methods

        private Utils.Session GetSession(int userID)
        {
            try
            {
                Utils.Session session = new Utils.Session();
                var user = this.userBO.GetByID(userID);
                if (user == null)
                    return null;

                //session.User = user;
                session.UserID = user.UserId;
                session.IsAdmin = user.IsSystem ?? false;
                session.IsLogin = true;
                session.IsSecondPassword = user.IsSecondPassword;
                var fiscal = this.fiscalBO.GetCurrentFiscal();
                if (fiscal == null)
                    return null;

                //session.Fiscal = fiscal;
                session.FiscalID = fiscal.FiscalId;
                return session;
            }
            catch (Exception ex)
            {
                Logger.Error("Get session login", ex);
                return null;
            }
        }

        /// <summary>
        /// Generate Token Options
        /// </summary>
        /// <param name="userRes">Object Usser Info</param>
        /// <returns></returns>
        private JwtSecurityToken GenerateTokenOption(UserResDTO userRes)
        {
            // Basic claims
            Claim claimUserData = new Claim(ClaimTypes.UserData, JsonConvert.SerializeObject(userRes));
            Claim claimUserName = new Claim(ClaimTypes.Name, userRes.UserName);
            List<Claim> listClaims = new List<Claim>();
            listClaims.Add(claimUserData);
            listClaims.Add(claimUserName);

            // Get token expired info from Constant
            string TokenExpireConfig = Constant.TOKENEXPIRED;
            if (string.IsNullOrEmpty(TokenExpireConfig))
                TokenExpireConfig = "86400";

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constant.JWTENCRYPTKEY));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var jwtSecurityToken = new JwtSecurityToken(
                issuer: "https://simerp.vn",
                audience: "https://simerp.vn",
                claims: listClaims,
                expires: DateTime.Now.AddSeconds(Convert.ToInt32(TokenExpireConfig)),
                signingCredentials: signinCredentials
            );


            return jwtSecurityToken;
        }

        /// <summary>
        /// Generate the TokenRefresh Object
        /// </summary>
        /// <param name="userName">User Name request refresh token</param>
        /// <returns></returns>
        private TokenRefresh GenerateTokenRefresh(string userName)
        {
            // Get theo TokenRefresh info from DB
            TokenRefresh tokenRefresh = this.tokenRefreshBO.GetData(userName);
            // Existed data
            if (tokenRefresh != null)
            {
                //renew refreshtoken
                tokenRefresh.Refreshtoken = Guid.NewGuid().ToString();
            }
            // not existed data
            else
            {
                // create new record
                tokenRefresh = new TokenRefresh
                {
                    Username = userName,
                    Refreshtoken = Guid.NewGuid().ToString()
                };
            }

            return tokenRefresh;
        }
        #endregion Private Methods
    }
}