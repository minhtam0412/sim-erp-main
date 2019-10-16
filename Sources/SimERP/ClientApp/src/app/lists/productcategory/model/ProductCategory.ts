import { Guid } from "guid-typescript";

export class ProductCategory {
  ProductCategoryId: Guid;
  ProductCategoryCode: string = "";
  ProductCategoryName: string = "";
  ParentId: Guid;
  ParentListId: string;
  Notes: string;
  SearchString: string;
  CreatedBy: number;
  CreateName: string;
  CreatedDate: Date;
  ModifyBy?: number;
  ModifyDate?: Date;
  IsActive?: boolean = true;
}

