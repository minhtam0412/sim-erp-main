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
  SupplierId: number;
  SupplierProductCode: string;
  SupplierProductName: string;
  SupplierNotes: string;
  TermCondition: string;
  ThumbnailPhoto: string;
  LargePhoto: string;
  Image1: string;
  Image2: string;
  Image3: string;
  Image4: string;
  MadeIn = '-1';
  PackageUnitId = -1;
  WeightUnit: number;
  IsUsingExpireDate = false;
  ExpireDays: number;
  IsItemVirtual: boolean;
  IsPackage: boolean;
  SearchString: string;
  IsActive = false;
  CreatedDate: Date;
  CreatedBy: number;
  ModifyDate: Date;
  ModifyBy: number;

  // custom properties
  UnitName: string;
  PackageUnitName: string;
  ProductCategoryName: string;
  CountryName: string;
  VendorName: string;
  ListAttachFile: Attachfile[] = [];
  ListAttachFileDelete: Attachfile[] = [];
}
