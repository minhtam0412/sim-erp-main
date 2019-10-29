export class Stock {
  StockId = 0;
  StockCode: string;
  StockName: string;
  Address: string;
  Latitude: number;
  Longitude: number;
  Notes: string;
  CreatedBy: number;
  CreatedDate: Date;
  ModifyBy: number;
  ModifyDate: Date;
  SearchString: string;
  SortOrder: number;
  IsDefaultForSale: boolean;
  IsDefaultForPurchase: boolean;
  IsActive = true;

  // custom properties
  UserName: string;
}
