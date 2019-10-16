using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimERP.Business.Models.RequestData
{
    public class AuthenParams
    {
        public string IpAddress { get; set; } = "192.168.1.8";

        /// <summary>
        /// Tài khoản xác thực
        /// </summary>
        public string ClientUserName { get; set; } = "SIM-EPR";

        /// <summary>
        /// Mật khẩu đã mã hóa
        /// </summary>
        public string ClientPassword { get; set; } = "C4CA4238A0B923820DCC509A6F75849B";

        /// <summary>
        /// Chữ ký bảo mật
        /// </summary>
        public string Sign { get; set; }

        /// <summary>
        /// Access Token
        /// </summary>
        public string Token { get; set; }
    }
}