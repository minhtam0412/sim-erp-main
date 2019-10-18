
export class RoleList {

  RoleId: number;
  RoleCode: string = "";
  RoleName: string = "";
  StoreId?: number;
  ModuleId?: number = -1;
  CreatedDate: Date;
  CreatedBy: number;
  CreatedName: string;
  ModifyDate: Date;
  ModifyBy?: number;
  Notes: string;
  SearchString: string;
  IsActive: boolean = true;
  SortOrder?: number;
  LstPermission: string;
}
