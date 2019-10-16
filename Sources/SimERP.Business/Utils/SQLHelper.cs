using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace SimERP.Business
{
    public class SQLHelper
    {
        public SQLHelper()
        {
            //
            // Add constructor logic here
            //
        }

        /// <summary>
        /// Tạo transaction scope
        /// </summary>
        /// <param name="timeout"></param>
        /// <param name="isolationLevel"></param>
        /// <returns></returns>
        public static TransactionScope CreateTransactionScope(TimeSpan? timeout = null,
            IsolationLevel isolationLevel = IsolationLevel.Serializable)
        {
            timeout = timeout ?? TransactionManager.DefaultTimeout;
            var transactionOptions = new TransactionOptions
            {
                IsolationLevel = isolationLevel,
                Timeout = (TimeSpan) timeout
            };
            //TransactionManager.MaximumTimeout
            return new TransactionScope(TransactionScopeOption.Required, transactionOptions);
        }
    }
}