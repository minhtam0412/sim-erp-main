import { Function } from '../model/Function';

export class PageList {
  PageId: number;
  PageName: string = "";
  ControllerName: string = "";
  ActionName: string = "";
  FormName: string = "";
  Parameter: string;
  ModuleId: number;
  ModuleName: string = "";
  Notes: string;
  PageType: number;
  SortOrder: number;
  IsRunOnStore: boolean;
  IsCheckSecurity: boolean = true;
  IsUserEditableData: boolean;
  IsActive: boolean = true;
  lstFunction: Function[] = [];
}
