export class VendorType {
  VendorTypeId: number;
  VendorTypeCode: string = "";
  VendorTypeName: string = "";
  Notes: string = "";
  CreatedBy: number;
  CreatedDate: Date;
  ModifyBy: number;
  ModifyDate: Date;
  SearchString: string;
  SortOrder: number;
  IsActive: boolean = true;
}

