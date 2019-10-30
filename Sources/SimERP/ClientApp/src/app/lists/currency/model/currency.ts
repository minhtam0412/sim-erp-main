export class Currency {
  CurrencyId = '';
  CurrencyName: string;
  Notes: string;
  CreatedBy: number;
  CreatedDate: Date;
  ModifyBy: number;
  ModifyDate: Date;
  SearchString: string;
  SortOrder: number;
  IsMainCurrency: boolean;
  IsActive: boolean;

  // custom propeties
  UserName: string;
}
