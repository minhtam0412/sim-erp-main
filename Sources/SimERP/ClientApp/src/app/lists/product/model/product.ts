import {Attachfile} from './attachfile';
import {Guid} from 'guid-typescript';

export class Product {
  constructor() {

  }

  ProductId: number;
  ProductCode: string;
  Barcode: string;
  RFID: string;
  ProductName: string;
  ProductNameShort: string;
  Price: number;
  StandardCost: number;
  PurchasePrice: number;
  ProductCategoryId: Guid = undefined;
  ProductCategoryList: string;
  UnitId = -1;
  TaxId = -1;
  ImportTaxId = -1;
  ItemType = -1;
  ProductType = -1;
  CostMethod: number;
  SupplierId = -1;
  SupplierProductCode: string;
  SupplierProductName: string;
  SupplierNotes: string;
  TermCondition: string;
  ThumbnailPhoto: string;
  LargePhoto: string;
  LeadTime: number;
  MadeIn = '-1';
  PackageUnitId = -1;
  PackageUnit: number;
  WeightUnit: number;
  IsUsingExpireDate = false;
  ExpireDays: number;
  IsItemVirtual: boolean;
  IsPackage: boolean;
  CreatedDate: Date;
  CreatedBy: number;
  ModifyDate: Date;
  ModifyBy: number;
  SearchString: string;
  IsActive = false;
  Note: string;


  // custom properties
  UnitName: string;
  PackageUnitName: string;
  ProductCategoryName: string;
  CountryName: string;
  VendorName: string;
  ListAttachFile: Attachfile[] = [];
  ListAttachFileDelete: Attachfile[] = [];
}
