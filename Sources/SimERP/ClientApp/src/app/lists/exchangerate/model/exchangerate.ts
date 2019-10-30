export class ExchangeRate {
  ExchangeRateId = 0;
  CurrencyId = -1;
  ExchangeRating: number;
  ExchangeDate: Date;
  Notes: string;

  // custom properties
  CurrencyName: string;
  ExchangeDateNonOffset: Date;
}
