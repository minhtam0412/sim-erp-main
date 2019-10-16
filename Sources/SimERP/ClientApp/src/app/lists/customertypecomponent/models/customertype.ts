import {ReqListSearch} from '../../../common/commomodel/ReqListSearch';

export class CustomerType {
  CustomerTypeId: number;
  CustomerTypeName: string;
  Notes: string;
  CreatedBy: number;
  CreatedDate?: Date;
  ModifyBy: number;
  ModifyDate?: Date;
  SearchString: string;
  IsActive = false;
  CustomerTypeCode: string;
}
