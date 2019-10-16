using System;
using System.Data;
using System.Data.SqlClient;

namespace SimERP.Data
{
    public class ConnectionFactory : IDisposable
    {
        #region Properties

        /// <summary>
        /// 
        /// </summary>
        private IDbConnection _connection;

        #endregion

        /// <summary>
        /// Constructors
        /// </summary>
        /// <param name="connection"></param>
        public ConnectionFactory(IDbConnection connection)
        {
            _connection = connection;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public IDbConnection GetOpenConnection()
        {
            string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["DBConnectionString"]
                .ConnectionString;
            _connection = new SqlConnection(connectionString);

            if (_connection.State != ConnectionState.Open && _connection.State != ConnectionState.Connecting)
            {
                _connection.Open();
            }

            return _connection;
        }

        /// <summary>
        /// Close the connection if this is open
        /// </summary>
        public void Dispose()
        {
            if (_connection != null && _connection.State != ConnectionState.Closed)
                _connection.Close();
        }
    }
}