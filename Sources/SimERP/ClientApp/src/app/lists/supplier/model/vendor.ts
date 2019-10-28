import {Attachfile} from '../../product/model/attachfile';
import {VendorProduct} from './vendorproduct';

export class Vendor {
  VendorId: number;
  VendorCode: string;
  VendorName: string;
  Address: string;
  PhoneNumber: string;
  FaxNumber: string;
  Email: string;
  VendorTypeId = -1;
  TaxNumber: string;
  CompanyName: string;
  CompanyAddress: string;
  BankingNumber: string;
  BankingName: string;
  PaymentTermId = -1;
  DebtCeiling: number;
  CurrencyId = -1;
  Website: string;
  RepresentativeName: string;
  RepresentativePhone: string;
  RepresentativeAddress: string;
  RepresentativeEmail: string;
  CreatedBy: number;
  CreatedDate: Date;
  ModifyBy: number;
  ModifyDate: Date;
  TrackingNote: string;
  SearchString: string;
  IsActive: boolean;
  SortOrder: number;

  // các danh sách detail
  ListAttachFile: Attachfile[] = [];
  ListAttachFileDelete: Attachfile[] = [];

  ListVendorProduct: VendorProduct[] = [];
  ListVendorProductDelete: VendorProduct[] = [];
}
