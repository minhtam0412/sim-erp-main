using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class User
    {
        public int UserId { get; set; }
        public string UserCode { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public int? DepartmentId { get; set; }
        public int CreatedBy { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTimeOffset? ModifyDate { get; set; }
        public int UserTypeId { get; set; }
        public int? Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public DateTimeOffset? LastestLogin { get; set; }
        public DateTimeOffset? LastestLogout { get; set; }
        public DateTime? PasswordExpire { get; set; }
        public string SystemLanguage { get; set; }
        public string PageDefault { get; set; }
        public string SignatureImage { get; set; }
        public string Avatar { get; set; }
        public bool IsAdminCode { get; set; }
        public string AdminCode { get; set; }
        public bool IsSecondPassword { get; set; }
        public string SecondPassword { get; set; }
        public bool IsSeeAuthorizations { get; set; }
        public bool IsFirstChangePassword { get; set; }
        public bool? IsSystem { get; set; }
        public bool IsActive { get; set; }
        public string SearchString { get; set; }
    }
}
