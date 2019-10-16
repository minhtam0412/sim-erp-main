using Microsoft.EntityFrameworkCore;
using SimERP.Business.Interfaces.User;
using SimERP.Data;
using SimERP.Data.DBEntities;
using System;
using System.Linq;

namespace SimERP.Business.Businesses.User
{
    public class TokenRefreshBO : Repository<TokenRefresh>, ITokenRefresh
    {
        /// <summary>
        /// lấy thông tin refresh token của username hiện tại
        /// </summary>
        /// <param name="userName">username hoặc refreshtken cần refresh</param>
        /// <returns></returns>
        public TokenRefresh GetData(string Key)
        {
            try
            {
                TokenRefresh tokenRefresh = null;
                using (var db = new DBEntities())
                {
                    tokenRefresh = db.TokenRefresh.SingleOrDefault(x => x.Username.Equals(Key) || x.Refreshtoken.Equals(Key));
                }

                return tokenRefresh;
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_001, ex.Message);
                Logger.Error(GetType(), ex);
                return null;
            }
        }

        /// <summary>
        /// Insert/Update thông tin Token Refresh của user hiện tại
        /// </summary>
        /// <param name="tokenRefresh"></param>
        /// <param name="isNew"></param>
        /// <returns></returns>
        public bool Save(TokenRefresh tokenRefresh, bool isNew)
        {
            try
            {
                using (var db = new DBEntities())
                {
                    if (isNew)
                    {
                        db.TokenRefresh.Add(tokenRefresh);
                    }
                    else
                    {
                        db.Entry(tokenRefresh).State = EntityState.Modified;
                    }

                    db.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.AddMessage(MessageCode.MSGCODE_002, "Lưu không thành công: " + ex.Message);
                Logger.Error(GetType(), ex);
                return false;
            }
        }
    }
}