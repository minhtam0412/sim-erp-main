export class SaleInvoiceDetail {
  SaleInvoiceDetailId = 0;
  SaleInvoiceId = 0;
  ProductId = 0;
  ProductCode: string;
  ProductName: string;
  Quantity: number;
  Price: number;
  Amount: number;
  DiscountPercent: number;
  DiscountAmount: number;
  DiscountTotalAmount: number;
  TaxPercent: number;
  TaxAmount: number;
  ChargeAmount: number;
  TotalAmount: number;
  StandardCost: number;
  TotalStandardCost: number;
  ExpireDate: Date;
  LotNumber: string;
  SerialNumber: string;
  ManufactureDate: Date;
  IsPromotion: boolean;
  Notes: string;
  RefDetailId = -1;
  SortOrder: number;

  // custom properties
  UnitName: string;
}
