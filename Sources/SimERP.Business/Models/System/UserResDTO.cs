using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimERP.Business.Models.System
{
    [Serializable]
    public class UserResDTO
    {
        public int UserId { get; set; }
        public string UserCode { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public int? DepartmentId { get; set; }
        public string Avatar { get; set; }
        public bool IsActive { get; set; }
        public bool UserTypeName { get; set; }
        public bool IsSystem { get; set; } = false;
        public bool IsSecondPassword { get; set; } = false;
        public bool IsFirstChangePassword { get; set; } = false;
        public string PageDefault { get; set; }
    }
}