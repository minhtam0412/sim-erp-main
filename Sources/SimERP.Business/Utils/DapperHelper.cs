using System.Collections.Generic;
using System.Dynamic;


namespace SimERP.Business
{
    public class DapperHelper
    {
        public DapperHelper()
        {
            //
            // Add constructor logic here
            //
        }

        /// <summary>
        /// Convert sang ExpandoObject dạng IDictionary.
        /// Call: db.Database.Connection.Query(sqlQuery, param).Select(x => (ExpandoObject)DapperHelper.ToExpandoDynamic(x))
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static dynamic ToExpandoDynamic(object value)
        {
            IDictionary<string, object> dapperRowProperties = value as IDictionary<string, object>;

            IDictionary<string, object> expando = new ExpandoObject();

            foreach (KeyValuePair<string, object> property in dapperRowProperties)
                expando.Add(property.Key, property.Value);

            return expando as ExpandoObject;
        }

        public static string sqlQueryApp(string applist)
        {
            string _sqlquery = " AND ( ";
            var list = applist.Split(',');
            if (list.Length > 0)
            {
                for (int i = 0; i < list.Length; i++)
                {
                    _sqlquery += " CHARINDEX(cast(" + list[i] + "  as varchar(20)), AppID)>0 ";
                    if (i < list.Length - 1)
                    {
                        _sqlquery += " OR ";
                    }
                }
            }
            else
            {
                _sqlquery += " CHARINDEX(cast(" + applist + "  as varchar(20)), AppID)>0 ";
            }

            _sqlquery += " ) ";
            return _sqlquery;
        }
    }
}