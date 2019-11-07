import {SaleInvoiceDetail} from './saleorderdetail';
import * as moment from 'moment';

export class SaleInvoice {
  SaleInvoiceId = 0;
  SaleInvoiceCode: string;
  AccountingDate: Date;
  VoucherDate: Date;
  DueDate: Date;
  CurrencyId = -1;
  ExchangeRate: number;
  Amount = 0;
  DiscountItemAmount: number;
  TaxAmount = 0;
  AmountSub: number;
  IsDiscountPercent: boolean;
  DiscountPercent: number;
  DiscountAmount = 0;
  DiscountTotalAmount: number;
  FeeAmount: number;
  ChargeAmount: number;
  TotalAmount = 0;
  TotalStandardCost = 0;
  ReferenceCode: string;
  RefType: number;
  RefId = -1;
  rRefType: number;
  rRefCode: string;
  PaymentMethodId = -1;
  PaymentTermId = -1;
  StockId = -1;
  FiscalId = -1;
  CustomerId: number;
  CustomerCode: string;
  CustomerName: string;
  CustomerPhone: string;
  CustomerAddress: string;
  CustomerFax: string;
  Notes: string;
  IsPost: boolean;
  PostedDate: Date;
  PostedBy: number;
  IsPay: boolean;
  CreatedBy: number;
  CreatedDate: Date = new Date();
  ModifyBy: number;
  ModifyDate: Date;
  SourceType: number;
  DepartmentId = -1;
  SaleRefId = -1;
  CodeCurrentNumber: number;
  IsSaleInvoice: boolean;
  VoucherStatus: number;
  IsInventory: boolean;
  InventoryStatus: number;
  PaymentStatus: number;
  SearchString: string;
  DeliveryId = -1;
  DeliveryPlace: string;
  DeliveryAddress: string;
  DeliveryNotes: string;
  Latitude: number;
  Longitude: number;

  // custom propeties
  UserName: string;
  SaleRefFullName: string;
  ListSaleOrderDetail: SaleInvoiceDetail[] = [];
  ListSaleOrderDetailDelete: SaleInvoiceDetail[] = [];

  constructor() {
    this.CreatedDate = new Date();
    const dt = moment(this.CreatedDate, 'YYYY-MM-DDTHH:mm:ssZ').toDate();
    if (Math.abs(dt.getTimezoneOffset()) > 0) {
      dt.setHours(dt.getHours() + Math.abs(dt.getTimezoneOffset() / 60));
    }
    this.CreatedDate = dt;
  }
}
