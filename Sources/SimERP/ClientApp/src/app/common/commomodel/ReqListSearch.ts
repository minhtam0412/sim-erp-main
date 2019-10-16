import {AuthenParams} from './AuthenParams';

export class ReqListSearch {
  AuthenParams: AuthenParams;
  SearchString: string;
  IsActive?: boolean;
  StartRow: number;
  MaxRow: number;
  AddtionParams: Map<string, any>;
}
