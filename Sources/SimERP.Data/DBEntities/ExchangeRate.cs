using System;
using System.Collections.Generic;

namespace SimERP.Data.DBEntities
{
    public partial class ExchangeRate
    {
        public int ExchangeRateId { get; set; }
        public string CurrencyId { get; set; }
        public decimal ExchangeRating { get; set; }
        public DateTimeOffset? ExchangeDate { get; set; }
        public string Notes { get; set; }
    }
}
