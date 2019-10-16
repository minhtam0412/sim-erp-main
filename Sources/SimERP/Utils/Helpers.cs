
using SimERP.Business;
using SimERP.Business.Utils;
using System;
using System.Configuration;
using System.Dynamic;
using System.Net.Http;
using System.Web;

namespace SimERP.Utils
{
    /// <summary>
    /// 
    /// </summary>

    public static class Helpers
    {
        /// <summary>
        /// Xác thực chữ ký khi gọi API
        /// </summary>
        /// <param name="clientUserName"></param>
        /// <param name="clientPasswordHash"></param>
        /// <param name="clientSign"></param>
        /// <param name="message"></param>
        /// <returns>NULL: hợp lệ, object: lỗi</returns>
        public static ResponeResult CheckSign(string clientUserName, string clientPasswordHash, string clientSign)
        {
            try
            {
                int isCheckSign = int.Parse(ConfigurationManager.AppSettings["IsCheckSign"].ToString());
                if (isCheckSign == 0)
                {
                    //For Development Environment 
                    return null;
                }

                //Server infor
                string serverUserName = ConfigurationManager.AppSettings["API_UserName"];
                string serverPassword = ConfigurationManager.AppSettings["API_Password"];
                string serverSecretKey = ConfigurationManager.AppSettings["API_SecretKey"];
                string serverSignKey = ConfigurationManager.AppSettings["API_SignKey"];

                //Mật mã đã mã hóa (SHA1 - lowercase): Password + SecretKey
                //string serverPasswordHash = System.Security.Cryptography.SHA1Hash(serverPassword + serverSecretKey).ToLower();

                //Kiểm tra tài khoản
                if (clientUserName != serverUserName || clientPasswordHash != serverPassword)
                {
                    Logger.Error(" ******* Check sign unsucessfull********");
                    return CreateResponeResult(MsgCodeConst.Msg_SignInvalid, MsgCodeConst.Msg_SignInvalidText, null, null);
                }

                return null;
            }
            catch (Exception ex)
            {
                Logger.Error("Lỗi Check sign", ex);
                return null;
            }

        }

        public static ResponeResult CreateResponeResult(string messageCode, string messageText = "", string errorMessage = "", dynamic repData = null)
        {
            var reval = new ResponeResult();
            reval.IsOk = false;
            reval.MessageCode = messageCode;    //Mã thông báo
            reval.MessageText = messageText;    //Nội dung thông báo hiển thị lên ứng dụng cho người dùng
            reval.MessageError = errorMessage;  // Nội dung thông báo lỗi phục vụ cho dev (ko hiển thị lên cho người dùng)
            reval.RepData = repData ?? new ExpandoObject(); //Dữ liệu trả về nếu có, ngược lại thì gán new {}
            return reval;
        }
    }
    
}