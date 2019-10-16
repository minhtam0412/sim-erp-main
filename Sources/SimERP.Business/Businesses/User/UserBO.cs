using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using SimERP.Business.Models.System;
using SimERP.Data;
using SimERP.Data.DBEntities;

namespace SimERP.Business
{
    public class UserBO : Repository<User>, IUser
    {
        #region Public methods
        /// <summary>
        /// Function Login
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="passWord"></param>
        /// <returns></returns>
        public UserResDTO Login(string userName, string passWord)
        {
            try
            {             
                using (var db = new DBEntities())
                {
                    string passwordEncode = this.CreateMD5(passWord);
                    User userInfo = new User();

                    userInfo = db.User.Where(m => m.UserName == userName && m.Password == passwordEncode && m.IsActive).FirstOrDefault();
                    if(userInfo!=null)
                    {
                        //Login password chính thành công
                        return new UserResDTO()
                        {
                            UserId = userInfo.UserId,
                            UserCode = userInfo.UserCode,
                            UserName = userInfo.UserName,
                            FullName = userInfo.FullName,
                            Address = userInfo.Address,
                            PhoneNumber = userInfo.PhoneNumber,
                            Email = userInfo.Email,
                            DepartmentId = userInfo.DepartmentId,
                            Avatar = userInfo.Avatar,
                            IsActive = userInfo.IsActive,
                            IsSystem = userInfo.IsSystem ?? false,
                            IsSecondPassword = false,
                            IsFirstChangePassword = userInfo.IsFirstChangePassword,
                            PageDefault = userInfo.PageDefault
                        };
                    }
                    else
                    {
                        userInfo = db.User.Where(m => m.UserName == userName && m.SecondPassword == passwordEncode && m.IsActive).FirstOrDefault();
                        if(userInfo!=null)
                        {
                            //Login bằng second password
                            return new UserResDTO()
                            {
                                UserId = userInfo.UserId,
                                UserCode = userInfo.UserCode,
                                UserName = userInfo.UserName,
                                FullName = userInfo.FullName,
                                Address = userInfo.Address,
                                PhoneNumber = userInfo.PhoneNumber,
                                Email = userInfo.Email,
                                DepartmentId = userInfo.DepartmentId,
                                Avatar = userInfo.Avatar,
                                IsActive = userInfo.IsActive,
                                IsSystem = userInfo.IsSystem ?? false,
                                IsSecondPassword = true
                            };
                        }
                        else
                        {
                            return null;
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                this.AddMessage("USE-004", "Đổi mật khẩu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return null;
            }
        }

        public UserResDTO GetInfo(string userName)
        {
            using (var db = new DBEntities())
            {
                var userInfo = db.User.FirstOrDefault(x =>
                    x.UserName.Equals(userName.Trim()) && x.IsActive);
                if (userInfo != null && userInfo.UserId > 0)
                {
                    return new UserResDTO()
                    {
                        UserId = userInfo.UserId,
                        UserCode = userInfo.UserCode,
                        UserName = userInfo.UserName,
                        FullName = userInfo.FullName,
                        Address = userInfo.Address,
                        PhoneNumber = userInfo.PhoneNumber,
                        Email = userInfo.Email,
                        DepartmentId = userInfo.DepartmentId,
                        Avatar = userInfo.Avatar,
                        IsActive = userInfo.IsActive
                    };
                }
                else
                {
                    return new UserResDTO();
                }
            }
        }

        public UserResDTO GetInfo(int UserId)
        {
            using (var db = new DBEntities())
            {
                var userInfo = db.User.FirstOrDefault(x =>
                    x.UserId == UserId && x.IsActive);
                if (userInfo != null && userInfo.UserId > 0)
                {
                    return new UserResDTO()
                    {
                        UserId = userInfo.UserId,
                        UserCode = userInfo.UserCode,
                        UserName = userInfo.UserName,
                        FullName = userInfo.FullName,
                        Address = userInfo.Address,
                        PhoneNumber = userInfo.PhoneNumber,
                        Email = userInfo.Email,
                        DepartmentId = userInfo.DepartmentId,
                        Avatar = userInfo.Avatar,
                        IsActive = userInfo.IsActive
                    };
                }
                else
                {
                    return new UserResDTO();
                }
            }
        }

        public List<User> GetData(string searchString, bool? IsActive, int startRow, int maxRows)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    string sqlWhere = string.Empty;
                    DynamicParameters param = new DynamicParameters();

                    if (!string.IsNullOrEmpty(searchString))
                    {
                        sqlWhere += " WHERE t.SearchString Like @SearchString ";
                        param.Add("SearchString", "%" + searchString + "%");

                        if (IsActive != null)
                        {
                            sqlWhere += " AND t.IsActive = @IsActive ";
                            param.Add("IsActive", IsActive);
                        }
                    }
                    else
                    {
                        if (IsActive != null)
                        {
                            sqlWhere += " WHERE t.IsActive = @IsActive ";
                            param.Add("IsActive", IsActive);
                        }
                    }

                    string sqlQuery = @" SELECT Count(1) FROM  [acc].[User] t with(nolock) " + sqlWhere +
                                      @";SELECT t.* FROM [acc].[User] t with(nolock) 
                                          " + sqlWhere + " ORDER BY t.CreatedDate OFFSET " + startRow +
                                      " ROWS FETCH NEXT " + maxRows + " ROWS ONLY";

                    using (var multiResult = conn.QueryMultiple(sqlQuery, param))
                    {
                        this.TotalRows = multiResult.Read<int>().Single();
                        return multiResult.Read<User>().ToList();
                    }
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return null;
            }
        }

        public bool Save(User user, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        if (CheckUserExisting(user.UserName))
                            return false;

                        if (CheckUserExistCode(user.UserCode))
                            return false;

                        user.Password = CreateMD5(user.Password);
                        if (user.IsAdminCode)
                            user.AdminCode = this.CreateMD5(user.AdminCode);
                        db.User.Add(user);
                        db.SaveChanges();
                    }
                    else
                    {
                        db.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                        db.SaveChanges();
                    }
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage("000002", "Lưu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool DeleteUser(int userID)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("UserID", userID);

                    string sqlQuery = @" UPDATE [acc].[User] SET IsActive = 0  WHERE UserID = @UserID";

                    conn.Query(sqlQuery, param);
                    return true;
                }

                //using (var db = new DBEntities())
                //{
                //    //TODO: Check replation
                //    db.User.Remove(db.User.Find(userID));
                //    db.SaveChanges();
                //    return true;
                //}
            }
            catch (Exception ex)
            {
                this.AddMessage("000003", "Xóa không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool ResetPassUser(int userID)
        {
            try
            {
                using (IDbConnection conn = IConnect.GetOpenConnection())
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add("UserID", userID);
                    
                    string newpass =  CreateMD5("1");
                    string sqlQuery = @" UPDATE [acc].[User] SET IsFirstChangePassword = 0, Password = '" + newpass + "' WHERE UserID = @UserID";

                    conn.Query(sqlQuery, param);
                    return true;
                }
               
            }
            catch (Exception ex)
            {
                this.AddMessage("000003", "Cập nhật không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool ChangePassword(int userId, string currentPassword, string newPassword)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    string currPasswordEndcode, newPasswordEndcode;
                    var user = (from c in db.User
                                where c.UserId == userId
                                select c).FirstOrDefault();

                    currPasswordEndcode = this.CreateMD5(currentPassword);
                    if (user == null || currPasswordEndcode != user.Password)
                    {
                        this.AddMessage("USE-003", "Thay đổi mật khẩu không thành công");
                        return false;
                    }
                    else
                    {
                        user.IsFirstChangePassword = false;
                        newPasswordEndcode = this.CreateMD5(newPassword);
                        user.Password = newPasswordEndcode;
                        db.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                        db.SaveChanges();
                        return true;
                    }
                }
            }
            catch(Exception ex)
            {
                this.AddMessage("USE-004", "Đổi mật khẩu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        public bool ResetPassword(int userId, string newPassword)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    var user = (from c in db.User
                                where c.UserId == userId
                                select c).FirstOrDefault();

                    string Password = this.CreateMD5(newPassword);
                    user.Password = Password;
                    user.IsFirstChangePassword = false;
                    db.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage("USE-004", "Đổi mật khẩu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }

        #endregion

        #region Private methods
        private string CreateMD5(string input)
        {
            try
            {
                // Use input string to calculate MD5 hash
                MD5 md5 = System.Security.Cryptography.MD5.Create();
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Convert the byte array to hexadecimal string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }
                return sb.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private bool CheckUserExisting(string userName)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    var user = (from c in db.User
                                where c.UserName == userName
                                select c).FirstOrDefault();
                    if (user == null)
                        return false;
                    else
                    {
                        this.AddMessage("USE-001", "Tên đăng nhập đã tồn tại. Vui lòng nhập lại tên đăng nhập mới!");
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }
        private bool CheckUserExistCode(string code)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    var user = (from c in db.User
                                where c.UserCode == code
                                select c).FirstOrDefault();
                    if (user == null)
                        return false;
                    else
                    {
                        this.AddMessage("USE-002", "Mã nhân viên đã tồn tại. Vui lòng kiểm tra lại!");
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                return false;
            }
        }
        #endregion

    }
}