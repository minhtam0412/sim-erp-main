export class VendorProduct {
  RowId: number;
  ProductId = -1;
  VendorId = -1;
  Price: number;
  Notes: string;
  IsActive: boolean;

  // Custom properties
  ProductCode: string;
  ProductName: string;
  UnitName: string;
  CountryName: string;
  ProductCategoryName: string;
}
