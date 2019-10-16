using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimERP.Business.Utils
{
    public static class MsgCodeConst
    {
        #region General

        public const string Msg_RequestDataInvalid = "0001"; // Tham số không hợp lệ
        public const string Msg_RequestDataInvalidText = "Lỗi tham số call API"; // Tham số không hợp lệ

        public const string Msg_SignInvalid = "0002"; // Xác thực chữ ký thất bại
        public const string Msg_SignInvalidText = "Xác thực chữ ký thất bại"; // Xác thực chữ ký thất bại

        #endregion
    }
}