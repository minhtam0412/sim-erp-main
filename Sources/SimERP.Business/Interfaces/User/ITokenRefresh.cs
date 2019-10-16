using SimERP.Data;
using SimERP.Data.DBEntities;

namespace SimERP.Business.Interfaces.User
{
    public interface ITokenRefresh : IRepository<TokenRefresh>
    {
        TokenRefresh GetData(string Key);

        bool Save(TokenRefresh tokenRefresh, bool isNew);
    }
}