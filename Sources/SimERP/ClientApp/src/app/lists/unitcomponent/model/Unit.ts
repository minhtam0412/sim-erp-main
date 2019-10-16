export class Unit {
  UnitId: number;
  UnitCode: string = "";
  UnitName: string = "";
  Notes: string = "";
  CreatedBy: number;
  CreatedDate: Date;
  ModifyBy: number;
  ModifyDate: Date;
  SearchString: string;
  SortOrder: number;
  IsActive: boolean = true;
}

